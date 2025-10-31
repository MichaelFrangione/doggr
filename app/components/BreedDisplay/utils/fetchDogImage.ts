interface BreedSearchResponse {
    id: number;
    name: string;
    reference_image_id?: string;
    image?: {
        id: string;
        url: string;
    };
}

export type FetchDogImageResult =
    | { success: true; url: string; }
    | { success: false; error: string; };

/**
 * Fetch a dog image for a specific breed from The Dog API
 * @param breedName - The breed name to search for
 * @returns Result object with success status and either URL or error message
 */
export async function fetchDogImage(breedName: string): Promise<FetchDogImageResult> {

    const API_KEY = process.env.THE_DOG_API_KEY;

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
            return { success: false, error: 'Failed to fetch breed data' };
        }

        const breedData: BreedSearchResponse[] = await searchResponse.json();

        if (!breedData || breedData.length === 0) {
            return { success: false, error: 'Breed not found' };
        }

        const breed = breedData[0];

        // Try to get image URL from the breed data directly
        if (breed.image?.url) {
            return { success: true, url: breed.image.url };
        }

        // If no image URL found, return error
        console.error('No image found for breed:', breedName);
        return { success: false, error: 'No image available for this breed' };
    } catch (error) {
        console.error('Error fetching dog image:', error);
        return { success: false, error: 'Network error occurred' };
    }
}




