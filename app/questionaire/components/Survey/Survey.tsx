"use client";

import { useState, useEffect, useRef } from "react";
import { Heading, Text, Button, Flex, RadioGroup, Container } from "@radix-ui/themes";
import classNames from "classnames";
import { QuestionaireAnswer } from "../../../actions";
import { Pencil1Icon } from '@radix-ui/react-icons';

import styles from "./Survey.module.css";
import { QUESTIONS } from "./questions";

export default function Survey({ onComplete }: { onComplete: (questionnaireAnswers: QuestionaireAnswer[]) => void; }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [surveyComplete, setSurveyComplete] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const currentQuestion = QUESTIONS[currentIndex];
    const isLastQuestion = currentIndex === QUESTIONS.length - 1;

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    // Handle transition to results screen
    useEffect(() => {
        if (surveyComplete && !showResults) {
            setIsTransitioning(true);
            timeoutRef.current = setTimeout(() => {
                setShowResults(true);
                setIsTransitioning(false);
            }, 250);
        }
    }, [surveyComplete, showResults]);

    const transition = (direction: 'next' | 'prev') => {
        setIsTransitioning(true);

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Wait for fade out animation to complete (250ms per CSS)
        timeoutRef.current = setTimeout(() => {
            setCurrentIndex(prev => direction === 'next' ? prev + 1 : prev - 1);
            // Immediately start fade in after content change
            setIsTransitioning(false);
        }, 250);
    };

    const handleAnswer = (answerId: string) => {
        setAnswers({ ...answers, [currentQuestion.id]: answerId });
        if (editMode) {
            setEditMode(false);
            setSurveyComplete(true);
            return;
        }
        if (isLastQuestion) {
            setSurveyComplete(true);
        } else {
            transition('next');
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            transition('prev');
        }
    };

    const handleEditAnswer = (questionId: string, shouldSetShowResults: boolean = false) => {
        setIsTransitioning(true);
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            if (shouldSetShowResults) {
                setShowResults(false);
            }
            setCurrentIndex(QUESTIONS.findIndex((question) => question.id === questionId));
            setSurveyComplete(false);
            setEditMode(true);
            setIsTransitioning(false);
        }, 250);
    };

    const getAnswerText = (questionId: string) => {
        const question = QUESTIONS.find((question) => question.id === questionId);
        const answerId = answers[questionId];

        if (question?.type === 'boolean') {
            return answerId === "yes" ? "Yes" : "No";
        }

        // For multiple choice, find the option text
        if (question?.options) {
            const option = question.options.find(opt => opt.id === answerId);
            return option?.text || answerId;
        }

        return answerId;
    };

    const handleComplete = () => {
        const questionsAndAnswers: QuestionaireAnswer[] = QUESTIONS.map(({ id, question, type, options }) => {
            const answerId = answers[id] || (type === 'boolean' ? 'no' : '');

            const getAnswerText = () => {
                if (type === 'boolean') {
                    return answerId === 'yes' ? 'Yes' : 'No';
                } else if (options) {
                    const questionOption = options.find(opt => opt.id === answerId);
                    return questionOption?.text || answerId;
                }
                return answerId;
            };

            return {
                question: {
                    id: id,
                    text: question
                },
                answer: {
                    id: answerId,
                    text: getAnswerText()
                }
            };
        });
        onComplete(questionsAndAnswers);
    };

    if (surveyComplete && showResults) {
        return (
            <div className={classNames(styles.surveyContainer, {
                [styles.fadeIn]: !isTransitioning,
                [styles.fadeOut]: isTransitioning,
            })}>
                <Heading size="7" mb="6" className={styles.question}>
                    You are almost there!
                </Heading>
                <Text size="4" color="gray" mb="6">
                    Please review your answers and make any changes you need.
                </Text>
                <div className={styles.resultsGrid}>
                    {QUESTIONS.map((question) => (
                        <Flex key={question.id} direction="column" align="start">
                            <Flex gap="4" justify="center" align="center">
                                <Button
                                    variant="ghost"
                                    onClick={() => handleEditAnswer(question.id, true)}
                                    aria-label="Edit answer"
                                >
                                    <Pencil1Icon />
                                </Button>
                                <Text size="3" color="gray" weight="bold" mb="2">
                                    {question.question}
                                </Text>
                            </Flex>
                            <Text size="2" color="gray" mb="4" ml="6">
                                {getAnswerText(question.id)}
                            </Text>

                        </Flex>
                    ))}
                </div>
                <Button
                    variant="solid"
                    color="cyan"
                    size="4"
                    onClick={handleComplete}
                >
                    Show me my results
                </Button>
            </div>
        );
    }

    // Show loading/fade-out during transition to results
    if (surveyComplete && !showResults && isTransitioning) {
        return (
            <div className={classNames(styles.surveyContainer, styles.fadeOut)}>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: '100%' }}
                    />
                </div>
                <div className={styles.questionContainer}>
                    <Text size="2" color="gray" mb="4">
                        Question {QUESTIONS.length} of {QUESTIONS.length}
                    </Text>
                    <Heading size="7" mb="6" className={styles.question}>
                        {currentQuestion.question}
                    </Heading>
                </div>
            </div>
        );
    }

    return (
        <Container>
            <div className={classNames(styles.surveyContainer, {
                [styles.fadeOut]: isTransitioning,
                [styles.fadeIn]: !isTransitioning,
            })}>
                <Text size="2" color="gray">
                    Question {currentIndex + 1} of {QUESTIONS.length}
                </Text>
                <div className={styles.progressBar}>
                    <div
                        className={styles.progressFill}
                        style={{ width: `${(currentIndex / QUESTIONS.length) * 100}%` }}
                    />
                </div>
                <div key={currentIndex} className={styles.questionContainer}>
                    <Heading size="7" mb="6" className={styles.question}>
                        {currentQuestion.question}
                    </Heading>

                    {currentQuestion.type === "multiple" && currentQuestion.options && (
                        <RadioGroup.Root
                            value={answers[currentQuestion.id]}
                            onValueChange={handleAnswer}
                            className={styles.optionsGroup}
                        >
                            {currentQuestion.options.map((option, index) => (
                                <RadioGroup.Item
                                    value={option.id}
                                    key={index}
                                    className={styles.option}
                                >
                                    {option.text}
                                </RadioGroup.Item>
                            ))}
                        </RadioGroup.Root>
                    )}

                    {currentQuestion.type === "boolean" && (
                        <Flex gap="4" justify="center" className={styles.booleanGroup}>
                            <Button
                                variant={answers[currentQuestion.id] === "yes" ? "solid" : "outline"}
                                color="cyan"
                                size="4"
                                onClick={() => handleAnswer("yes")}
                                className={styles.booleanButton}
                            >
                                Yes
                            </Button>
                            <Button
                                variant={answers[currentQuestion.id] === "no" ? "solid" : "outline"}
                                color="cyan"
                                size="4"
                                onClick={() => handleAnswer("no")}
                                className={styles.booleanButton}
                            >
                                No
                            </Button>
                        </Flex>
                    )}

                    {currentIndex > 0 && !editMode && (
                        <Button
                            variant="ghost"
                            color="gray"
                            size="2"
                            onClick={handleBack}
                            className={styles.backButton}
                        >
                            ← Back
                        </Button>
                    )}
                </div>
            </div>
        </Container>
    );
}