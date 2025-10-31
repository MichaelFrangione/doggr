export type FetchDogImageResult =
    | { success: true; url: string; }
    | { success: false; error: string; };

/**
 * Fetch a dog image for a specific breed via our API route
 * This calls a server-side API route that securely handles the API key
 * @param breedName - The breed name to search for
 * @returns Result object with success status and either URL or error message
 */
export async function fetchDogImage(breedName: string): Promise<FetchDogImageResult> {
    try {
        const response = await fetch(
            `/api/dog-image?breedName=${encodeURIComponent(breedName)}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            return {
                success: false,
                error: data.error || 'Failed to fetch dog image'
            };
        }

        return { success: true, url: data.url };
    } catch (error) {
        console.error('Error fetching dog image:', error);
        return { success: false, error: 'Network error occurred' };
    }
}




