import { NextResponse } from "next/server";
import { index } from "../../../ai/rag/index";

/**
 * Fetch a list of all breed names from Upstash Vector Database
 * 
 * Since Upstash Vector doesn't support listing all items directly,
 * we query with a generic term and extract unique breed names from results.
 * This approach fetches a large topK to get as many breeds as possible.
 */
export async function GET() {
    try {
        // Query with a generic term to get all breeds
        // Using a large topK to fetch many results
        const results = await index.query({
            data: "dog breed",
            topK: 300, // Large number to fetch many breeds
        });

        if (!results || results.length === 0) {
            return NextResponse.json(
                { breeds: [], error: "No breeds found" },
                { status: 404 }
            );
        }

        // Extract unique breed names from the result IDs
        const breedNames = Array.from(
            new Set(
                results.map((result: any) => result.id).filter((id: string | undefined) => id !== undefined)
            )
        ).sort();

        return NextResponse.json({
            breeds: breedNames,
            count: breedNames.length
        });
    } catch (error) {
        console.error('Error fetching breed names:', error);
        return NextResponse.json(
            { error: "Failed to fetch breed names" },
            { status: 500 }
        );
    }
}

