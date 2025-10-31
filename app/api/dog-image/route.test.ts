// @vitest-environment node
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { GET } from './route';
import { NextRequest } from 'next/server';

// Store original fetch
const originalFetch = global.fetch;

// Mock fetch
const mockFetch = vi.fn();

describe('Dog Image API Route', () => {
    beforeEach(() => {
        // Replace global fetch with our mock before each test
        global.fetch = mockFetch as any;
        vi.clearAllMocks();
        // Set API key in env
        process.env.THE_DOG_API_KEY = 'test-api-key';
    });

    afterEach(() => {
        // Restore original fetch after each test to avoid affecting other tests
        global.fetch = originalFetch;
    });

    test('should return image URL when breed found', async () => {
        const mockBreedData = [{
            id: 1,
            name: 'Labrador',
            image: {
                id: 'test-id',
                url: 'https://example.com/labrador.jpg'
            }
        }];

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockBreedData
        });

        const request = new NextRequest('http://localhost:3000/api/dog-image?breedName=Labrador');
        const response = await GET(request);
        const data = await response.json();

        expect(data.success).toBe(true);
        expect(data.url).toBe('https://example.com/labrador.jpg');
        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('api.thedogapi.com'),
            expect.objectContaining({
                headers: expect.objectContaining({
                    'x-api-key': 'test-api-key'
                })
            })
        );
    });

    test('should handle missing breed name parameter', async () => {
        const request = new NextRequest('http://localhost:3000/api/dog-image');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toBe('Breed name is required');
    });

    test('should return 404 when breed not found', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => []
        });

        const request = new NextRequest('http://localhost:3000/api/dog-image?breedName=UnknownBreed');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.success).toBe(false);
        expect(data.error).toBe('Breed not found');
    });

    test('should handle API key missing from env', async () => {
        delete process.env.THE_DOG_API_KEY;

        const request = new NextRequest('http://localhost:3000/api/dog-image?breedName=Labrador');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.success).toBe(false);
        expect(data.error).toBe('API key not configured');
    });

    test('should handle external API failures', async () => {
        process.env.THE_DOG_API_KEY = 'test-api-key';

        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500
        });

        const request = new NextRequest('http://localhost:3000/api/dog-image?breedName=Labrador');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.success).toBe(false);
        expect(data.error).toBe('Failed to fetch breed data');
    });

    test('should return error when breed has no image', async () => {
        const mockBreedData = [{
            id: 1,
            name: 'Labrador',
            image: null
        }];

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockBreedData
        });

        const request = new NextRequest('http://localhost:3000/api/dog-image?breedName=Labrador');
        const response = await GET(request);
        const data = await response.json();

        expect(response.status).toBe(404);
        expect(data.success).toBe(false);
        expect(data.error).toBe('No image available for this breed');
    });

    test('should validate API key is used in request header', async () => {
        const mockBreedData = [{
            id: 1,
            name: 'Labrador',
            image: { id: 'test-id', url: 'https://example.com/labrador.jpg' }
        }];

        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => mockBreedData
        });

        const request = new NextRequest('http://localhost:3000/api/dog-image?breedName=Labrador');
        await GET(request);

        expect(mockFetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                headers: expect.objectContaining({
                    'x-api-key': 'test-api-key'
                })
            })
        );
    });
});

