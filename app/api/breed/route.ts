import { NextResponse } from "next/server";
import { breedFetcherTool } from "../../../ai/tools/breedFetcher";

export async function POST(req: Request) {
    try {
        const { breedName }: { breedName: string; } = await req.json();

        if (!breedName) {
            return NextResponse.json(
                { error: "Breed name is required" },
                { status: 400 }
            );
        }

        // Call the breed fetcher tool directly
        if (!breedFetcherTool.execute) {
            return NextResponse.json(
                { error: "Tool execution not available" },
                { status: 500 }
            );
        }
        const result = await breedFetcherTool.execute({ breedName }, { toolCallId: '', messages: [] });

        // Parse the tool output
        const toolOutputString = typeof result === 'string' ? result : JSON.stringify(result);
        const breedData = JSON.parse(toolOutputString);

        if (breedData.error) {
            return NextResponse.json(
                { error: breedData.error, message: breedData.message },
                { status: 404 }
            );
        }

        return NextResponse.json({ breed: breedData });
    } catch (error) {
        console.error('Error in breed API:', error);
        return NextResponse.json(
            { error: "Failed to fetch breed information" },
            { status: 500 }
        );
    }
}




