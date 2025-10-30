"use client";

import { useState } from "react";
import Survey from "./components/Survey/Survey";
import Loading from "../components/loading";
import ResultsView from "./components/ResultsView/ResultsView";
import type { DogRecommendation } from "./components/ResultsView/types";
import ErrorView from "./components/ErrorView";
import IntroView from "./components/IntroView";
import { processQuestionnaireAnswers } from "./utils";
import { QuestionaireAnswer } from "../actions";

export type ViewState = 'intro' | 'questionnaire' | 'loading' | 'results' | 'error';

export default function Questionaire() {
    const [viewState, setViewState] = useState<ViewState>('intro');
    const [questionaireAnswers, setQuestionaireAnswers] = useState<QuestionaireAnswer[] | undefined>();
    const [results, setResults] = useState<DogRecommendation | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleComplete = async (answers: QuestionaireAnswer[]) => {
        setQuestionaireAnswers(answers);
        setViewState('loading');
        setError(null);

        const result = await processQuestionnaireAnswers(answers);

        if (result.type === 'success') {
            setResults(result.recommendation);
            setViewState('results');
        } else {
            setError(result.message);
            setViewState('error');
        }
    };

    const handleReset = () => {
        setViewState('intro');
        setQuestionaireAnswers(undefined);
        setResults(null);
        setError(null);
    };

    const renderContent = () => {
        switch (viewState) {
            case 'intro':
                return <IntroView onStart={() => setViewState('questionnaire')} />;
            case 'questionnaire':
                return <Survey onComplete={handleComplete} />;
            case 'loading':
                return <Loading />;
            case 'results':
                return results ? (
                    <ResultsView recommendation={results} onReset={handleReset} />
                ) : null;
            case 'error':
                return (
                    <ErrorView
                        error={error}
                        onReset={handleReset}
                        onGoBack={() => setViewState('questionnaire')}
                        showGoBack={!!questionaireAnswers}
                    />
                );
        }
    };

    return renderContent();
}