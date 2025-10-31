import { describe, test, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../../tests/renderWithProviders';
import ResultsView from './ResultsView';
import { mockBreed } from '../../../../tests/fixtures/breeds';

// Mock Lottie to avoid canvas dependency
vi.mock('@/app/components/lottieImage', () => ({
    default: () => <div data-testid="lottie" />,
}));

// Mock DogImage component
vi.mock('@/app/components/BreedDisplay/components/DogImage', () => ({
    default: ({ breed }: { breed: string; }) => <div data-testid="dog-image">{breed}</div>,
}));

// Mock BreedDetails
vi.mock('@/app/components/BreedDisplay/components/BreedDetails', () => ({
    default: () => <div data-testid="breed-details">Breed Details</div>,
}));

// Mock RecommendationInfo
vi.mock('@/app/components/BreedDisplay/components/RecommendationInfo', () => ({
    default: () => <div data-testid="recommendation-info">Recommendation Info</div>,
}));

describe('ResultsView', () => {
    test('should render BreedDisplay with recommendation', () => {
        renderWithProviders(<ResultsView recommendation={mockBreed} />);

        // Labrador Retriever appears multiple times (heading and DogImage mock)
        expect(screen.getAllByText('Labrador Retriever').length).toBeGreaterThan(0);
        expect(screen.getByText('Friendly and outgoing breed')).toBeInTheDocument();
    });

    test('should pass showRecommendationHeader prop correctly', () => {
        renderWithProviders(<ResultsView recommendation={mockBreed} />);

        expect(screen.getByText('Your Perfect Match')).toBeInTheDocument();
    });

    test('should call onReset when Start Over clicked', async () => {
        const onReset = vi.fn();

        renderWithProviders(<ResultsView recommendation={mockBreed} onReset={onReset} />);

        const startOverButton = screen.getByRole('button', { name: 'Start Over' });
        const user = userEvent.setup();
        await user.click(startOverButton);

        expect(onReset).toHaveBeenCalledTimes(1);
    });

    test('should handle recommendation without matchScore', () => {
        const breedWithoutScore = {
            ...mockBreed,
            matchScore: undefined
        };

        renderWithProviders(<ResultsView recommendation={breedWithoutScore} />);

        // Labrador Retriever appears multiple times (heading and DogImage mock)
        expect(screen.getAllByText('Labrador Retriever').length).toBeGreaterThan(0);
    });
});

