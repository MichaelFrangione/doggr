// @vitest-environment node
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { GET } from './route';
import { NextRequest } from 'next/server';

// Mock the Upstash index
vi.mock('../../../ai/rag/index', () => ({
    index: {
        query: vi.fn()
    }
}));

import { index } from '../../../ai/rag/index';

describe('BreedFetcher API Route', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should return list of all breed names', async () => {
        const mockResults = [
            { id: 'Labrador Retriever' },
            { id: 'Golden Retriever' },
            { id: 'German Shepherd' },
            { id: 'Labrador Retriever' } // Duplicate to test Set deduplication
        ];

        (index.query as any).mockResolvedValueOnce(mockResults);

        const request = new NextRequest('http://localhost:3000/api/breedFetcher');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.breeds).toEqual(['German Shepherd', 'Golden Retriever', 'Labrador Retriever']);
        expect(data.count).toBe(3);
        expect(data.breeds.length).toBe(3); // Duplicates removed
    });

    test('should handle empty results', async () => {
        (index.query as any).mockResolvedValueOnce([]);

        const request = new NextRequest('http://localhost:3000/api/breedFetcher');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.breeds).toEqual([]);
        expect(data.error).toBe('No breeds found');
    });

    test('should handle Upstash errors', async () => {
        (index.query as any).mockRejectedValueOnce(new Error('Upstash error'));

        const request = new NextRequest('http://localhost:3000/api/breedFetcher');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Failed to fetch breed names');
    });

    test('should filter out undefined IDs', async () => {
        const mockResults = [
            { id: 'Labrador Retriever' },
            { id: undefined },
            { id: 'Golden Retriever' }
        ];

        (index.query as any).mockResolvedValueOnce(mockResults);

        const request = new NextRequest('http://localhost:3000/api/breedFetcher');
        const response = await GET(request);
        const data = await response.json();

        expect(data.breeds).toEqual(['Golden Retriever', 'Labrador Retriever']);
        expect(data.breeds.length).toBe(2);
        // Ensure no undefined values
        expect(data.breeds.every((id: any) => id !== undefined)).toBe(true);
    });

    test('should sort breed names alphabetically', async () => {
        const mockResults = [
            { id: 'Zebra Dog' },
            { id: 'Alpha Dog' },
            { id: 'Beta Dog' }
        ];

        (index.query as any).mockResolvedValueOnce(mockResults);

        const request = new NextRequest('http://localhost:3000/api/breedFetcher');
        const response = await GET(request);
        const data = await response.json();

        expect(data.breeds).toEqual(['Alpha Dog', 'Beta Dog', 'Zebra Dog']);
    });
});

