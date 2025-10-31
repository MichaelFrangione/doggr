import { index } from './index';

export const fetchBreedById = async (breedName: string) => {
    try {
        const result = await index.fetch([breedName], {
            includeMetadata: true,
            includeData: true,
        });
        return result[0];
    } catch (error) {
        console.error('Upstash fetch error:', error);
        throw error;
    }
};






