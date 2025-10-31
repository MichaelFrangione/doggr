import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../../tests/renderWithProviders';
import DogImage from './DogImage';

// Mock Lottie to avoid canvas dependency
vi.mock('@/app/components/lottieImage', () => ({
    default: ({ animationData }: { animationData: any; }) => (
        <div data-testid="lottie" data-animation={JSON.stringify(animationData)} />
    ),
}));

// Mock JSON imports
vi.mock('@/app/assets/long_dog.json', () => ({ default: {} }));
vi.mock('@/app/assets/smiling_dog.json', () => ({ default: {} }));

// Mock next/image
vi.mock('next/image', () => ({
    default: (props: any) => <img {...props} />,
}));

// Mock fetchDogImage
const mockFetchDogImage = vi.fn();
vi.mock('../utils/fetchDogImage', () => ({
    fetchDogImage: async (breedName: string) => await mockFetchDogImage(breedName),
}));

describe('DogImage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    test('should show loading state initially', () => {
        mockFetchDogImage.mockImplementation(() => new Promise(() => { })); // Never resolves

        renderWithProviders(<DogImage breed="Labrador" />);

        expect(screen.getByText('Fetching breed image...')).toBeInTheDocument();
        expect(screen.getByTestId('lottie')).toBeInTheDocument();
    });

    test('should display image when fetch succeeds', async () => {
        const mockUrl = 'https://example.com/dog.jpg';
        mockFetchDogImage.mockResolvedValue({ success: true, url: mockUrl });

        renderWithProviders(<DogImage breed="Labrador" />);

        await waitFor(() => {
            const img = screen.getByAltText('Labrador image');
            expect(img).toBeInTheDocument();
            expect(img).toHaveAttribute('src', mockUrl);
        });
    });

    test('should show error fallback with animation when fetch fails', async () => {
        mockFetchDogImage.mockResolvedValue({ success: false, error: 'Breed not found' });

        renderWithProviders(<DogImage breed="Unknown Breed" />);

        await waitFor(() => {
            expect(screen.getByText("Sorry, I can't find an image for this breed")).toBeInTheDocument();
            expect(screen.getByTestId('lottie')).toBeInTheDocument();
        });
    });

    test('should update when breed prop changes', async () => {
        const mockUrl1 = 'https://example.com/labrador.jpg';
        const mockUrl2 = 'https://example.com/golden.jpg';

        mockFetchDogImage
            .mockResolvedValueOnce({ success: true, url: mockUrl1 })
            .mockResolvedValueOnce({ success: true, url: mockUrl2 });

        const { rerender } = renderWithProviders(<DogImage breed="Labrador" />);

        await waitFor(() => {
            expect(screen.getByAltText('Labrador image')).toBeInTheDocument();
        });

        rerender(<DogImage breed="Golden Retriever" />);

        await waitFor(() => {
            expect(screen.getByAltText('Golden Retriever image')).toBeInTheDocument();
            expect(mockFetchDogImage).toHaveBeenCalledTimes(2);
        });
    });

    test('should call fetchDogImage with correct breed name', () => {
        mockFetchDogImage.mockImplementation(() => new Promise(() => { }));

        renderWithProviders(<DogImage breed="Labrador Retriever" />);

        expect(mockFetchDogImage).toHaveBeenCalledWith('Labrador Retriever');
    });
});

