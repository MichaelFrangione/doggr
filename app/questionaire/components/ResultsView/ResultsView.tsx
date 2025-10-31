"use client";

import { Button } from "@radix-ui/themes";
import BreedDisplay from "@/app/components/BreedDisplay/BreedDisplay";
import type { ResultsViewProps } from "./types";
import type { DogRecommendation } from "@/app/components/BreedDisplay/types";

export { type DogRecommendation };

export default function ResultsView({ recommendation, onReset }: ResultsViewProps) {
    return (
        <>
            <BreedDisplay breed={recommendation} showRecommendationHeader />
            <Button mt="6" variant="outline" color="cyan" size="4" onClick={onReset}>
                Start Over
            </Button>
        </>
    );
}

