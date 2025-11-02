import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import { z } from "zod";
import { QuestionaireAnswer } from "@/app/actions";
import { queryDogBreeds } from "../../../ai/rag/query";
import { buildFilterTiers, buildMatchedAttributes } from "../../../ai/tools/dogSearch/utils";
import type { DogMetadata } from "../../../ai/rag/types";
import type { DogRecommendation } from "@/app/components/BreedDisplay/types";

const filterParametersSchema = z.object({
    searchQuery: z.string().describe("A rich semantic search query combining living situation, activity preferences, family needs, and personality. Example: 'apartment friendly small dog low energy gentle temperament good with children'"),
    temperamentTags: z.array(z.string()).describe("Array of temperament tags extracted from personality preferences (e.g., 'friendly', 'protective', 'calm', 'independent')"),
    energyMinValue: z.number().optional().describe("Minimum energy level on 0-1 scale (e.g., 0.6 for active dogs, 0.8 for very energetic dogs)"),
    energyMaxValue: z.number().optional().describe("Maximum energy level on 0-1 scale (e.g., 0.4 for low energy, 0.6 for moderate)"),
    sheddingMaxValue: z.number().optional().describe("Maximum shedding value on 0-1 scale (lower is better for allergies, typically 0.4)"),
    groomingMaxValue: z.number().optional().describe("Maximum grooming value on 0-1 scale (lower is better, typically 0.4)"),
    weightMinKg: z.number().optional().describe("Minimum weight in kg (e.g., 4.5 for small dogs, 22 for large)"),
    weightMaxKg: z.number().optional().describe("Maximum weight in kg (e.g., 11.5 for small dogs, 44 for large)"),
    minTrainabilityValue: z.number().optional().describe("Minimum trainability on 0-1 scale (typically 0.6 for easier training)"),
    popularityMaxRank: z.number().optional().describe("Maximum popularity rank (1=most popular). Lower is more popular. Default tiered caps are 50/100/150/any"),
});

type FilterParameters = z.infer<typeof filterParametersSchema>;

const filterGenerationPrompt = `You are a dog breed search expert. Analyze the user's questionnaire answers and generate precise filter parameters.

CRITICAL CONVERSION RULES:

WEIGHT (convert to kg):
- Extra small (0-10lbs) → weightMaxKg: 4.5
- Small (11-25lbs) → weightMinKg: 4.5, weightMaxKg: 11.5  
- Medium (26-50lbs) → weightMinKg: 11.5, weightMaxKg: 22
- Large (51-100lbs) → weightMinKg: 22, weightMaxKg: 44
- Extra Large (101+ lbs) → weightMinKg: 44

ENERGY (0-1 scale):
- Less than 30 min → energyMaxValue: 0.4
- 30-60 min → energyMaxValue: 0.6
- 1-2 hours → energyMinValue: 0.6
- 2+ hours → energyMinValue: 0.8

TRAINABILITY:
- No experience → minTrainabilityValue: 0.6

ALLERGIES:
- Has allergies → sheddingMaxValue: 0.4, groomingMaxValue: 0.4

TEMPERAMENT TAGS:
- Independent → 'independent', 'reserved', 'alert'
- Lap dog → 'friendly', 'affectionate', 'devoted'
- Lazy → 'calm', 'gentle', 'mellow'
- Protective → 'alert', 'territorial', 'watchful'

Generate a comprehensive searchQuery combining keywords from living situation, size, energy, family needs, and personality. Be conservative with filters to ensure results.`;

export async function POST(req: Request) {
    try {
        const { questionnaireAnswers }: { questionnaireAnswers: QuestionaireAnswer[]; } = await req.json();

        const structuredQuestionnaireAnswers = JSON.stringify(questionnaireAnswers, null, 2);

        console.log('=== AI RECOMMENDATIONS START ===');

        // Generate filter parameters using AI with structured output
        const result = await generateObject({
            model: openai("gpt-4o"),
            schema: filterParametersSchema,
            prompt: `Analyze these questionnaire answers and generate filter parameters:\n\n${structuredQuestionnaireAnswers}\n\n${filterGenerationPrompt}`
        });

        console.log('AI filter generation completed');

        // Extract filter parameters from structured result
        const filterInputs: FilterParameters = result.object;
        console.log('Filter inputs:', filterInputs);

        // Build tiered filters using existing utility
        const filterTiers = buildFilterTiers(filterInputs);
        console.log('Built', filterTiers.length, 'filter tiers');

        // Perform popularity-first tiered search
        interface BreedSearchResult {
            metadata: DogMetadata;
            score: number;
        }

        let bestResult: BreedSearchResult | null = null;
        let usedTier = 0;
        let usedCap: number | undefined = undefined;

        const caps: Array<number | undefined> = [50, 100, 150, undefined];
        for (const cap of caps) {
            const tiersForCap = buildFilterTiers({ ...filterInputs, popularityMaxRank: cap });
            for (let i = 0; i < tiersForCap.length; i++) {
                const filter = tiersForCap[i];
                console.log(`Trying popularity cap ${cap ?? 'any'} tier ${i + 1}/${tiersForCap.length}:`, filter || 'no filter');

                const results = await queryDogBreeds({
                    query: filterInputs.searchQuery,
                    topK: 8,
                    filter: filter,
                });

                if (results && results.length > 0) {
                    // Pick lowest popularity (most popular). Tie-break by highest score
                    const candidate = results.reduce((acc: BreedSearchResult | null, cur) => {
                        const typedCur = cur as unknown as BreedSearchResult;
                        const accRaw = acc?.metadata?.popularity;
                        const curRaw = typedCur?.metadata?.popularity;
                        const accPop = typeof accRaw === 'number' && accRaw > 0 ? accRaw : Number.MAX_SAFE_INTEGER;
                        const curPop = typeof curRaw === 'number' && curRaw > 0 ? curRaw : Number.MAX_SAFE_INTEGER;
                        if (curPop < accPop) return typedCur;
                        if (curPop === accPop) return (typedCur.score ?? 0) > (acc?.score ?? 0) ? typedCur : acc;
                        return acc;
                    }, null);

                    bestResult = candidate;
                    usedTier = i + 1;
                    usedCap = cap;
                    break;
                }
            }
            if (bestResult) break;
        }

        if (!bestResult) {
            console.log('No results from any tier');
            return Response.json(
                { error: "No matching dog breeds found" },
                { status: 404 }
            );
        }

        // Format the selected result
        const metadata = bestResult.metadata;
        const similarityScore = bestResult.score || 0;

        const breedData = {
            breed: metadata.breed,
            description: metadata.description,
            temperament: Array.isArray(metadata.temperament)
                ? metadata.temperament
                : (metadata.temperament ? [metadata.temperament] : []),
            popularity: metadata.popularity,
            size: {
                height: { min: metadata.minHeight, max: metadata.maxHeight },
                weight: { min: metadata.minWeight, max: metadata.maxWeight },
            },
            lifeExpectancy: { min: metadata.minExpectancy, max: metadata.maxExpectancy },
            group: metadata.group,
            grooming: {
                frequency: metadata.groomingFrequencyCategory,
                value: String(metadata.groomingFrequencyValue),
                shedding: metadata.sheddingCategory,
            },
            energy: {
                level: metadata.energyLevelCategory,
                value: metadata.energyLevelValue,
            },
            trainability: {
                level: metadata.trainabilityCategory,
                value: metadata.trainabilityValue,
            },
            demeanor: {
                type: metadata.demeanorCategory,
                value: metadata.demeanorValue,
            },
        };

        const matchScore = Math.round(Math.max(0, Math.min(100, (similarityScore || 0) * 100)));

        const matchedAttributes = buildMatchedAttributes(
            filterInputs,
            {
                temperament: metadata.temperament,
                energyLevelValue: metadata.energyLevelValue,
                energyLevelCategory: metadata.energyLevelCategory,
                trainabilityValue: metadata.trainabilityValue,
                trainabilityCategory: metadata.trainabilityCategory,
                minWeight: metadata.minWeight,
                maxWeight: metadata.maxWeight,
                sheddingValue: metadata.sheddingValue,
                sheddingCategory: metadata.sheddingCategory,
                groomingFrequencyValue: metadata.groomingFrequencyValue,
                groomingFrequencyCategory: metadata.groomingFrequencyCategory,
            },
            {
                energy: { level: breedData.energy?.level, value: breedData.energy?.value },
                trainability: { level: breedData.trainability?.level, value: breedData.trainability?.value },
            }
        );

        const recommendation: DogRecommendation = {
            breed: breedData.breed,
            matchScore,
            why: `${breedData.breed} matches your preferences: ${Array.isArray(breedData.temperament) ? breedData.temperament.join(', ') : 'good temperament'}, ${breedData.energy?.level || 'moderate energy'}, ${breedData.size?.height ? `${breedData.size.height.min}-${breedData.size.height.max}cm` : 'appropriate size'}.`,
            description: breedData.description,
            temperament: breedData.temperament,
            popularity: breedData.popularity,
            size: breedData.size,
            lifeExpectancy: breedData.lifeExpectancy,
            group: breedData.group,
            grooming: breedData.grooming,
            energy: breedData.energy,
            trainability: breedData.trainability,
            demeanor: breedData.demeanor,
            matchedAttributes: matchedAttributes,
        };

        console.log('=== AI RECOMMENDATIONS END ===');
        console.log('Recommended breed:', recommendation.breed, 'with score:', recommendation.matchScore);

        return Response.json({ recommendation });
    } catch (error) {
        console.error('Error in AI recommendations API:', error);
        return Response.json(
            { error: "Failed to generate recommendations" },
            { status: 500 }
        );
    }
}

