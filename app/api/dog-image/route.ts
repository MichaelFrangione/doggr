import { NextResponse } from "next/server";

interface BreedSearchResponse {
    id: number;
    name: string;
    reference_image_id?: string;
    image?: {
        id: string;
        url: string;
    };
}

/**
 * API route to fetch a dog image for a specific breed from The Dog API
 * This keeps the API key secure on the server side
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const breedName = searchParams.get('breedName');

    if (!breedName) {
        return NextResponse.json(
            { success: false, error: 'Breed name is required' },
            { status: 400 }
        );
    }

    const API_KEY = process.env.THE_DOG_API_KEY;
    if (!API_KEY) {
        return NextResponse.json(
            { success: false, error: 'API key not configured' },
            { status: 500 }
        );
    }

    try {
        const searchResponse = await fetch(
            `https://api.thedogapi.com/v1/breeds/search?q=${encodeURIComponent(breedName.toLowerCase())}`,
            {
                headers: {
                    'x-api-key': API_KEY,
                },
            }
        );

        if (!searchResponse.ok) {
            return NextResponse.json(
                { success: false, error: 'Failed to fetch breed data' },
                { status: searchResponse.status }
            );
        }

        const breedData: BreedSearchResponse[] = await searchResponse.json();

        if (!breedData || breedData.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Breed not found' },
                { status: 404 }
            );
        }

        const breed = breedData[0];

        // Try to get image URL from the breed data directly
        if (breed.image?.url) {
            return NextResponse.json({ success: true, url: breed.image.url });
        }

        // If no image URL found, return error
        return NextResponse.json(
            { success: false, error: 'No image available for this breed' },
            { status: 404 }
        );
    } catch (error) {
        console.error('Error fetching dog image:', error);
        return NextResponse.json(
            { success: false, error: 'Network error occurred' },
            { status: 500 }
        );
    }
}
