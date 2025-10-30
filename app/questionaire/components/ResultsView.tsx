"use client";

import { Heading, Text, Flex, Button } from "@radix-ui/themes";
import styles from "../page.module.css";
import BreedDetails from "@/app/components/BreedDisplay/components/BreedDetails";

export interface MatchedAttribute {
    category: string;
    label: string;
    breedValue: string;
    userValue: string;
    matched: boolean;
}

export interface DogRecommendation {
    breed: string;
    matchScore: number;
    why?: string;
    description?: string;
    temperament?: string;
    popularity?: string;
    size?: {
        height: { min: number; max: number; };
        weight: { min: number; max: number; };
    };
    lifeExpectancy?: { min: number; max: number; };
    group?: string;
    grooming?: {
        frequency: string;
        value: string;
        shedding: string;
    };
    energy?: {
        level: string;
        value: number;
    };
    trainability?: {
        level: string;
        value: number;
    };
    demeanor?: {
        type: string;
        value: number;
    };
    matchedAttributes?: MatchedAttribute[];
}

interface ResultsViewProps {
    recommendations: DogRecommendation[];
    onReset?: () => void;
}

export default function ResultsView({ recommendations, onReset }: ResultsViewProps) {
    return (
        <>
            <Heading size="8" mb="6">
                Your Perfect Match
            </Heading>
            <Flex gap="4" direction="column" align="stretch">
                {recommendations.map((dog, index) => (
                    <div key={index} className={styles.recommendationCard}>
                        <Heading size="6" mb="3">
                            {dog.breed}
                        </Heading>

                        <Text size="3" color="cyan" mb="4" weight="bold">
                            Match Score: {dog.matchScore}%
                        </Text>

                        {dog.description && (
                            <Text size="3" color="gray" mb="4">
                                {dog.description}
                            </Text>
                        )}

                        {/* Matched Attributes */}
                        {dog.matchedAttributes && dog.matchedAttributes.length > 0 && (
                            <div style={{ marginBottom: '24px' }}>
                                <Heading size="5" mb="3">Why This Breed Matches</Heading>
                                <Flex gap="3" direction="column">
                                    {dog.matchedAttributes.map((attr, attrIndex) => (
                                        <div key={attrIndex} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Text size="2" weight="bold" style={{ minWidth: '200px' }}>
                                                {attr.label}:
                                            </Text>
                                            <Text size="2" color={attr.matched ? 'green' : 'gray'}>
                                                {attr.breedValue}
                                            </Text>
                                            {attr.matched && (
                                                <Text size="2" color="green">✓</Text>
                                            )}
                                        </div>
                                    ))}
                                </Flex>
                            </div>
                        )}

                        {/* Detailed Breed Information */}
                        <BreedDetails
                            size={dog.size}
                            energy={dog.energy}
                            grooming={dog.grooming}
                            trainability={dog.trainability}
                            lifeExpectancy={dog.lifeExpectancy}
                            group={dog.group}
                            temperament={dog.temperament}
                        />
                    </div>
                ))}
            </Flex>

            {onReset && (
                <Button mt="6" variant="outline" color="cyan" size="4" onClick={onReset}>
                    Start Over
                </Button>
            )}
        </>
    );
}

