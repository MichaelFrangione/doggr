import { z } from "zod";
import { tool } from 'ai';
import { queryDogBreeds } from "../../rag/query";
import type { DogMetadata } from "../../rag/types";
import { buildFilterTiers } from "./utils";

// AI SDK tool for searching dog breeds in Upstash vector database
export const dogBreedSearchTool = tool({
    description: `Search for dog breeds using vector similarity search with metadata filters. This tool queries an Upstash vector database containing dog breed information including breed name, description, temperament, size, energy level, grooming needs, and other characteristics. Use this tool to find dog breeds based on specific search criteria and metadata filters.`,
    inputSchema: z.object({
        searchQuery: z.string().describe("Semantic search query describing what you're looking for in a dog breed"),
        temperamentTags: z.array(z.string()).optional().describe("Array of temperament tags to filter by (e.g., 'friendly', 'protective', 'calm')"),
        energyMinValue: z.number().optional().describe("Minimum energy level (0-1 scale, e.g., 0.6 for active dogs, 0.8 for very energetic)"),
        energyMaxValue: z.number().optional().describe("Maximum energy level (0-1 scale, e.g., 0.4 for low energy, 0.6 for moderate)"),
        sheddingMaxValue: z.number().optional().describe("Maximum shedding value (0-1 scale, lower is better, typically 0.4 for allergies)"),
        groomingMaxValue: z.number().optional().describe("Maximum grooming value (0-1 scale, lower is better, typically 0.4)"),
        weightMinKg: z.number().optional().describe("Minimum weight in kg (e.g., 4.5 for small dogs, 22 for large)"),
        weightMaxKg: z.number().optional().describe("Maximum weight in kg (e.g., 11.5 for small dogs, 44 for large)"),
        minTrainabilityValue: z.number().optional().describe("Minimum trainability (0-1 scale, typically 0.6 for easier training)"),
        topK: z.number().optional().describe("Number of top results to return. Default is 1."),
    }).describe("Search criteria including semantic query and optional metadata filters"),

    execute: async ({
        searchQuery,
        temperamentTags,
        energyMinValue,
        energyMaxValue,
        sheddingMaxValue,
        groomingMaxValue,
        weightMinKg,
        weightMaxKg,
        minTrainabilityValue,
        topK = 1
    }: {
        searchQuery: string;
        temperamentTags?: string[];
        energyMinValue?: number;
        energyMaxValue?: number;
        sheddingMaxValue?: number;
        groomingMaxValue?: number;
        weightMinKg?: number;
        weightMaxKg?: number;
        minTrainabilityValue?: number;
        topK?: number;
    }) => {
        console.log('=== TOOL EXECUTE CALLED ===');

        try {
            const filterTiers = buildFilterTiers({
                temperamentTags,
                energyMinValue,
                energyMaxValue,
                sheddingMaxValue,
                groomingMaxValue,
                weightMinKg,
                weightMaxKg,
                minTrainabilityValue,
            });


            // Query the Upstash vector database with optional filter
            let results;
            for (const filter of filterTiers) {
                console.log('Trying filter tier:', filter || 'none');
                console.log('Search query:', searchQuery);
                results = await queryDogBreeds({
                    query: searchQuery,
                    topK: topK,
                    filter,
                });

                if (results && results.length > 0) {
                    console.log(`Found ${results.length} results with filter tier`);
                    break;
                }

                console.log('Vector DB results count:', results?.length || 0);
            }

            // Handle empty results
            if (!results || results.length === 0) {
                console.log('No results from vector DB');
                return {
                    breeds: [],
                    message: "No matching dog breeds found in the database."
                };
            }

            // Format the results - extract metadata from vector search results
            // Limit to top 1 result in case of multiple results
            const formattedBreeds = results.slice(0, 1).map((result: any) => {
                const metadata = result.metadata as DogMetadata;
                return {
                    breed: metadata.breed,
                    description: metadata.description,
                    temperament: Array.isArray((metadata as any).temperament)
                        ? ((metadata as any).temperament as string[]).join(', ')
                        : (metadata as any).temperament,
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
                    popularity: metadata.popularity,
                    // Include similarity score if available from vector search
                    score: result.score,
                };
            });

            console.log('Tool returning breeds:', formattedBreeds.length);
            console.log('=== TOOL EXECUTE END ===');
            return {
                breeds: formattedBreeds,
                count: formattedBreeds.length,
            };
        } catch (error) {
            console.error('Dog breed search error:', error);
            return {
                breeds: [],
                error: 'Unable to search dog breeds at this time',
                message: 'Sorry, I encountered an error while searching for dog breeds. Please try again later.'
            };
        }
    },
});
