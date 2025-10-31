import { z } from "zod";
import { tool } from 'ai';
import { fetchBreedById } from "../../rag/fetchBreed";
import type { DogMetadata } from "../../rag/types";

// AI SDK tool for fetching a specific dog breed by name from Upstash vector database
export const breedFetcherTool = tool({
    description: `Fetch detailed information about a specific dog breed by name from the database. Returns complete breed metadata including description, temperament, size, energy level, grooming needs, and other characteristics.`,
    inputSchema: z.object({
        breedName: z.string().describe("The exact name of the dog breed to fetch information for."),
    }),

    execute: async ({ breedName }: { breedName: string; }) => {
        console.log('=== BREED FETCHER TOOL EXECUTE CALLED ===');
        console.log('Fetching breed:', breedName);

        try {
            // Fetch the breed by ID from Upstash vector database
            const result = await fetchBreedById(breedName);

            // Handle empty results
            if (!result || !result.metadata) {
                console.log('No breed found for:', breedName);
                return {
                    breed: null,
                    error: "Breed not found",
                    message: `No information available for ${breedName}.`
                };
            }

            // Format the result - extract metadata
            const metadata = result.metadata as DogMetadata;
            const formattedBreed = {
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
                    value: metadata.groomingFrequencyValue,
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

            console.log('Breed fetched successfully:', metadata.breed);
            console.log('=== BREED FETCHER TOOL END ===');
            return formattedBreed;
        } catch (error) {
            console.error('Breed fetch error:', error);
            return {
                breed: null,
                error: 'Unable to fetch breed information',
                message: `Sorry, I encountered an error while fetching information for ${breedName}. Please try again later.`
            };
        }
    },
});




