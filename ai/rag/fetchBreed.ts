import { Index as UpstashIndex } from '@upstash/vector';

const index = new UpstashIndex();

export const fetchBreedById = async (breedName: string) => {
    try {
        const result = await index.fetch([breedName], {
            includeMetadata: true,
            includeData: true,
        });
        return result[0]; // Returns single result
    } catch (error) {
        console.error('Upstash fetch error:', error);
        throw error;
    }
};






