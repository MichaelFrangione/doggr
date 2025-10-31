import type { DogRecommendation, MatchedAttribute } from "@/app/components/BreedDisplay/types";

export const mockBreed: DogRecommendation = {
    breed: "Labrador Retriever",
    matchScore: 95,
    description: "Friendly and outgoing breed",
    temperament: ["friendly", "outgoing", "gentle"],
    popularity: 1,
    size: {
        height: { min: 55, max: 62 },
        weight: { min: 25, max: 36 }
    },
    lifeExpectancy: { min: 10, max: 12 },
    group: "Sporting Group",
    grooming: {
        frequency: "weekly brushing",
        value: "0.3",
        shedding: "regularly"
    },
    energy: {
        level: "energetic",
        value: 0.8
    },
    trainability: {
        level: "eager to please",
        value: 0.9
    },
    matchedAttributes: [
        {
            category: "energy",
            label: "Energy Level",
            breedValue: "energetic",
            userValue: "high",
            matched: true
        }
    ]
};

export const mockBreedMinimal: DogRecommendation = {
    breed: "Test Breed",
    description: "Minimal breed data"
};

export const mockMatchedAttributes: MatchedAttribute[] = [
    {
        category: "size",
        label: "Size",
        breedValue: "Large (25-36kg)",
        userValue: "Large",
        matched: true
    },
    {
        category: "energy",
        label: "Energy Level",
        breedValue: "energetic",
        userValue: "high",
        matched: true
    }
];



