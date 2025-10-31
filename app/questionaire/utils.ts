import { findMatchingDogs, QuestionaireAnswer } from "../actions";
import type { DogRecommendation } from "@/app/components/BreedDisplay/types";

export type ProcessResult =
    | { type: 'success'; recommendation: DogRecommendation; }
    | { type: 'error'; message: string; };

export async function processQuestionnaireAnswers(
    answers: QuestionaireAnswer[]
): Promise<ProcessResult> {
    try {
        const response = await findMatchingDogs(answers);

        if ('error' in response) {
            return {
                type: 'error',
                message: response.error || 'Failed to get recommendations'
            };
        }

        if (response.recommendation) {
            return {
                type: 'success',
                recommendation: response.recommendation
            };
        }

        return {
            type: 'error',
            message: 'Invalid response format'
        };
    } catch (error) {
        console.error('Error processing results:', error);
        return {
            type: 'error',
            message: 'An error occurred while processing your answers. Please try again.'
        };
    }
}

