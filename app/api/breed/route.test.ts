// @vitest-environment node
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { POST } from './route';
import { NextRequest } from 'next/server';

// Mock breedFetcherTool - use hoisted to make mockExecute available
const { mockExecute } = vi.hoisted(() => {
    const mockExecute = vi.fn();
    return { mockExecute };
});

vi.mock('../../../ai/tools/breedFetcher', () => ({
    breedFetcherTool: {
        execute: mockExecute
    }
}));

describe('Breed API Route', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('should return breed data for valid breed name', async () => {
        const mockBreedData = {
            breed: 'Labrador Retriever',
            description: 'Friendly and outgoing breed',
            temperament: ['friendly', 'outgoing'],
            popularity: 1,
            size: {
                height: { min: 55, max: 62 },
                weight: { min: 25, max: 36 }
            }
        };

        mockExecute.mockResolvedValueOnce(mockBreedData);

        const request = new NextRequest('http://localhost:3000/api/breed', {
            method: 'POST',
            body: JSON.stringify({ breedName: 'Labrador Retriever' }),
            headers: { 'Content-Type': 'application/json' }
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.breed).toEqual(mockBreedData);
        expect(mockExecute).toHaveBeenCalledWith(
            { breedName: 'Labrador Retriever' },
            { toolCallId: '', messages: [] }
        );
    });

    test('should return 400 when breed name missing', async () => {
        const request = new NextRequest('http://localhost:3000/api/breed', {
            method: 'POST',
            body: JSON.stringify({}),
            headers: { 'Content-Type': 'application/json' }
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Breed name is required');
    });

    test('should return 404 when breed not found', async () => {
        mockExecute.mockResolvedValueOnce({
            breed: null,
            error: 'Breed not found',
            message: 'No information available for Unknown Breed'
        });

        const request = new NextRequest('http://localhost:3000/api/breed', {
            method: 'POST',
            body: JSON.stringify({ breedName: 'Unknown Breed' }),
            headers: { 'Content-Type': 'application/json' }
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.error).toBe('Breed not found');
        expect(data.message).toBe('No information available for Unknown Breed');
    });

    test('should handle breedFetcherTool errors', async () => {
        mockExecute.mockRejectedValueOnce(new Error('Tool execution failed'));

        const request = new NextRequest('http://localhost:3000/api/breed', {
            method: 'POST',
            body: JSON.stringify({ breedName: 'Test Breed' }),
            headers: { 'Content-Type': 'application/json' }
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Failed to fetch breed information');
    });

    test('should handle tool execution not available', async () => {
        const request = new NextRequest('http://localhost:3000/api/breed', {
            method: 'POST',
            body: JSON.stringify({ breedName: 'Test Breed' }),
            headers: { 'Content-Type': 'application/json' }
        });

        // Mock execute being undefined
        const originalExecute = mockExecute;
        mockExecute.mockImplementationOnce(() => {
            throw new Error('Tool execution not available');
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Failed to fetch breed information');
    });

    test('should validate response format matches DogRecommendation', async () => {
        const mockBreedData = {
            breed: 'Labrador Retriever',
            description: 'Test description',
            temperament: ['friendly'],
            popularity: 1
        };

        mockExecute.mockResolvedValueOnce(mockBreedData);

        const request = new NextRequest('http://localhost:3000/api/breed', {
            method: 'POST',
            body: JSON.stringify({ breedName: 'Labrador Retriever' }),
            headers: { 'Content-Type': 'application/json' }
        });

        const response = await POST(request);
        const data = await response.json();

        expect(data.breed).toHaveProperty('breed');
        expect(data.breed).toHaveProperty('description');
        expect(data.breed).toHaveProperty('temperament');
    });
});

