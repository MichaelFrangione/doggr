export interface MatchedAttribute {
    category: string;
    label: string;
    breedValue: string;
    userValue: string;
    matched: boolean;
}

export interface DogRecommendation {
    breed: string;
    matchScore?: number;
    why?: string;
    description?: string;
    temperament?: string[];
    popularity?: number;
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

export interface BreedDisplayProps {
    breed: DogRecommendation;
    onReset?: () => void;
    showRecommendationHeader?: boolean;
}

export interface BreedDetailsProps {
    popularity?: number;
    size?: {
        height: { min: number; max: number; };
        weight: { min: number; max: number; };
    };
    energy?: {
        level: string;
        value: number;
    };
    grooming?: {
        frequency: string;
        value: string;
        shedding: string;
    };
    trainability?: {
        level: string;
        value: number;
    };
    lifeExpectancy?: {
        min: number;
        max: number;
    };
    group?: string;
    temperament?: string[];
}




