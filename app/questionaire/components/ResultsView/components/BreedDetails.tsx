"use client";

import { Heading, Text, Flex } from "@radix-ui/themes";
import type { BreedDetailsProps } from "../types";
import styles from "../ResultsView.module.css";

export type { BreedDetailsProps } from "../types";

export default function BreedDetails({
    size,
    energy,
    grooming,
    trainability,
    lifeExpectancy,
    group,
    temperament
}: BreedDetailsProps) {
    // Helper function to round numbers for display
    const roundNum = (num: number): number => Math.round(num * 10) / 10;

    // Convert kg to lbs (1 kg = 2.20462 lbs)
    const kgToLbs = (kg: number): number => kg * 2.20462;

    return (
        <div className={styles.breedDetailsContainer}>
            <Heading size="5" mb="3">Breed Details</Heading>

            <Flex gap="3" direction="column" mb="3">
                {size && (
                    <Text size="2">
                        <strong>Size:</strong> Height {roundNum(size.height.min)}-{roundNum(size.height.max)}cm, Weight {roundNum(kgToLbs(size.weight.min))}-{roundNum(kgToLbs(size.weight.max))}lbs
                    </Text>
                )}
                {energy && (
                    <Text size="2">
                        <strong>Energy Level:</strong> {energy.level}
                    </Text>
                )}
                {grooming && (
                    <Text size="2">
                        <strong>Grooming:</strong> {grooming.frequency} grooming, {grooming.shedding} shedding
                    </Text>
                )}
                {trainability && (
                    <Text size="2">
                        <strong>Trainability:</strong> {trainability.level}
                    </Text>
                )}
                {lifeExpectancy && (
                    <Text size="2">
                        <strong>Life Expectancy:</strong> {roundNum(lifeExpectancy.min)}-{roundNum(lifeExpectancy.max)} years
                    </Text>
                )}
                {group && (
                    <Text size="2">
                        <strong>Group:</strong> {group}
                    </Text>
                )}
                {temperament && (
                    <Text size="2">
                        <strong>Temperament:</strong> {temperament}
                    </Text>
                )}
            </Flex>
        </div>
    );
}

