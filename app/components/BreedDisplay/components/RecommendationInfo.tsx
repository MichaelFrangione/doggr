"use client";

import { Heading, Text, Flex } from "@radix-ui/themes";
import styles from "../BreedDisplay.module.css";
import type { MatchedAttribute } from "../types";

export type { MatchedAttribute } from "../types";

interface RecommendationInfoProps {
    matchedAttributes?: MatchedAttribute[];
}

export default function RecommendationInfo({ matchedAttributes }: RecommendationInfoProps) {
    return (
        <>
            {matchedAttributes && matchedAttributes.length > 0 && (
                <div className={styles.matchedAttributesContainer}>
                    <Heading size="5" mb="3">Why this breed would be perfect for you</Heading>
                    <Flex gap="3" direction="column">
                        {matchedAttributes.map((attr, attrIndex) => (
                            <div key={attrIndex} className={styles.matchedAttributeItem}>
                                <Text size="2" weight="bold" className={styles.matchedAttributeLabel}>
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
        </>
    );
}

