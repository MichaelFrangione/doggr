import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchDogImage } from './fetchDogImage';

// Store original fetch
const originalFetch = global.fetch;

// Mock fetch
const mockFetch = vi.fn();

describe('fetchDogImage', () => {
    beforeEach(() => {
        // Replace global fetch with our mock before each test
        global.fetch = mockFetch as any;
        vi.clearAllMocks();
    });

    afterEach(() => {
        // Restore original fetch after each test to avoid affecting other tests
        global.fetch = originalFetch;
    });

    test('should return success with URL when API succeeds', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                success: true,
                url: 'https://example.com/labrador.jpg'
            })
        });

        const result = await fetchDogImage('Labrador');

        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.url).toBe('https://example.com/labrador.jpg');
        }
        expect(mockFetch).toHaveBeenCalledWith('/api/dog-image?breedName=Labrador');
    });

    test('should return error when API fails', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: false,
            json: async () => ({
                success: false,
                error: 'Breed not found'
            })
        });

        const result = await fetchDogImage('NotFoundBreed');

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toBe('Breed not found');
        }
    });

    test('should handle network errors', async () => {
        mockFetch.mockRejectedValueOnce(new Error('Network error'));

        const result = await fetchDogImage('Labrador');

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toBe('Network error occurred');
        }
    });

    test('should encode breed name correctly in URL', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                success: true,
                url: 'https://example.com/test.jpg'
            })
        });

        await fetchDogImage('Labrador Retriever');

        expect(mockFetch).toHaveBeenCalledWith('/api/dog-image?breedName=Labrador%20Retriever');
    });

    test('should handle API returning success: false', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                success: false,
                error: 'API error'
            })
        });

        const result = await fetchDogImage('TestBreed');

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toBe('API error');
        }
    });

    test('should handle invalid response format', async () => {
        mockFetch.mockResolvedValueOnce({
            ok: true,
            json: async () => ({
                invalid: 'response'
            })
        });

        const result = await fetchDogImage('TestBreed');

        expect(result.success).toBe(false);
        if (!result.success) {
            expect(result.error).toBe('Failed to fetch dog image');
        }
    });
});

