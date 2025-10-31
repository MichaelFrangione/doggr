// Re-export types from the centralized source
export type { 
    MatchedAttribute, 
    DogRecommendation, 
    BreedDetailsProps 
} from "@/app/components/BreedDisplay/types";

export interface ResultsViewProps {
    recommendation: DogRecommendation;
    onReset?: () => void;
}

