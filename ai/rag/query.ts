import { index } from './index';

export const queryDogBreeds = async ({
    query,
    topK = 5,
    filter
}: {
    query: string;
    topK?: number;
    filter?: string;
}) => {

    try {
        const queryParams: any = {
            data: query,
            topK,
            includeMetadata: true,
            includeData: true,
        };

        if (filter) {
            queryParams.filter = filter;
        }

        const results = await index.query(queryParams);

        return results;
    } catch (error) {
        console.error('Upstash query error:', error);
        throw error;
    }
};