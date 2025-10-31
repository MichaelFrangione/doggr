"use client";

import { Heading, Text, Flex, Button, Separator } from "@radix-ui/themes";
import styles from "./BreedDisplay.module.css";
import BreedDetails from "./components/BreedDetails";
import DogImage from "./components/DogImage";
import RecommendationInfo from "./components/RecommendationInfo";
import type { BreedDisplayProps, DogRecommendation } from "./types";

export { type DogRecommendation };

export default function BreedDisplay({ breed, onReset, showRecommendationHeader = false }: BreedDisplayProps) {
    const showRecommendationInfo = breed.matchScore !== undefined && (breed.matchScore > 0 || breed.matchedAttributes);

    return (
        <>
            {showRecommendationHeader && (
                <Heading size="8" mb="6">
                    Your Perfect Match
                </Heading>
            )}

            <Flex gap="4" direction="column" align="stretch">
                <div className={styles.breedCard}>
                    <div className={styles.breedContent}>
                        <div className={styles.breedInfo}>
                            <Heading size="6" mb="4">
                                {breed.breed}
                            </Heading>
                            {breed.matchScore != null && (
                                <div className={styles.matchScoreContainer}>
                                    <Text size="3" color="cyan" weight="bold">
                                        Match Score: {breed.matchScore}%
                                    </Text>
                                </div>
                            )}
                            {breed.description && (
                                <Text size="3" color="gray" mb={showRecommendationInfo ? "4" : "0"}>
                                    {breed.description}
                                </Text>
                            )}
                        </div>
                        <DogImage breed={breed.breed} className={styles.dogImageContainer} />
                    </div>
                    <Separator className={styles.separator} color="gray" />
                    <div className={styles.detailsContent}>
                        {showRecommendationInfo && (
                            <RecommendationInfo
                                matchedAttributes={breed.matchedAttributes}
                            />
                        )}
                        <BreedDetails
                            size={breed.size}
                            energy={breed.energy}
                            grooming={breed.grooming}
                            trainability={breed.trainability}
                            lifeExpectancy={breed.lifeExpectancy}
                            group={breed.group}
                            temperament={breed.temperament}
                            popularity={breed.popularity}
                        />
                    </div>
                </div>
            </Flex >

            {onReset && (
                <Button mt="6" variant="outline" color="cyan" size="4" onClick={onReset}>
                    Start Over
                </Button>
            )}
        </>
    );
}

