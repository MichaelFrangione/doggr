"use client";

import { Button } from "@radix-ui/themes";
import BreedDisplay from "@/app/components/BreedDisplay/BreedDisplay";
import type { ResultsViewProps, DogRecommendation } from "./types";

export { type DogRecommendation };

export default function ResultsView({ recommendation, onReset }: ResultsViewProps) {
    const adaptedRecommendation = {
        ...recommendation,
        temperament: typeof recommendation.temperament === 'string'
            ? recommendation.temperament.split(',').map((t) => t.trim()).filter(Boolean)
            : recommendation.temperament,
    } as any;

    return (
        <>
            <BreedDisplay breed={adaptedRecommendation} showRecommendationHeader />
            <Button mt="6" variant="outline" color="cyan" size="4" onClick={onReset}>
                Start Over
            </Button>
        </>
    );
}

