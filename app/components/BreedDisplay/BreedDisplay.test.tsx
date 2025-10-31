import { describe, test, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../../../tests/renderWithProviders';
import BreedDisplay from './BreedDisplay';
import { mockBreed, mockBreedMinimal } from '../../../tests/fixtures/breeds';

// Mock Lottie to avoid canvas dependency
vi.mock('@/app/components/lottieImage', () => ({
    default: () => <div data-testid="lottie" />,
}));

// Mock DogImage component
vi.mock('@/app/components/BreedDisplay/components/DogImage', () => ({
    default: ({ breed }: { breed: string }) => <div data-testid="dog-image">{breed}</div>,
}));

describe('BreedDisplay', () => {
    test('should render breed name and description', () => {
        renderWithProviders(<BreedDisplay breed={mockBreed} />);

        // Breed name appears multiple times (heading and DogImage mock)
        expect(screen.getAllByText('Labrador Retriever').length).toBeGreaterThan(0);
        expect(screen.getByText('Friendly and outgoing breed')).toBeInTheDocument();
    });

    test('should display match score when present', () => {
        renderWithProviders(<BreedDisplay breed={mockBreed} />);

        expect(screen.getByText('Match Score: 95%')).toBeInTheDocument();
    });

    test('should not display match score when not present', () => {
        renderWithProviders(<BreedDisplay breed={mockBreedMinimal} />);

        expect(screen.queryByText(/Match Score:/)).not.toBeInTheDocument();
    });

    test('should show recommendation header when showRecommendationHeader is true', () => {
        renderWithProviders(<BreedDisplay breed={mockBreed} showRecommendationHeader={true} />);

        expect(screen.getByText('Your Perfect Match')).toBeInTheDocument();
    });

    test('should not show recommendation header when showRecommendationHeader is false', () => {
        renderWithProviders(<BreedDisplay breed={mockBreed} showRecommendationHeader={false} />);

        expect(screen.queryByText('Your Perfect Match')).not.toBeInTheDocument();
    });

    test('should render BreedDetails with all props', () => {
        renderWithProviders(<BreedDisplay breed={mockBreed} />);

        expect(screen.getByText('Breed Details')).toBeInTheDocument();
        // These labels can appear in multiple contexts (e.g., BreedDetails and RecommendationInfo)
        expect(screen.getAllByText(/Size:/).length).toBeGreaterThan(0);
        expect(screen.getAllByText(/Energy Level:/).length).toBeGreaterThan(0);
    });

    test('should show RecommendationInfo when matchScore > 0', () => {
        renderWithProviders(<BreedDisplay breed={mockBreed} />);

        expect(screen.getByText('Why this breed would be perfect for you')).toBeInTheDocument();
    });

    test('should show RecommendationInfo when matchedAttributes exist', () => {
        const breedWithAttributes = {
            ...mockBreedMinimal,
            matchScore: 0, // Needs matchScore to be defined (can be 0)
            matchedAttributes: [
                {
                    category: 'test',
                    label: 'Test Attribute',
                    breedValue: 'test value',
                    userValue: 'test user',
                    matched: true
                }
            ]
        };

        renderWithProviders(<BreedDisplay breed={breedWithAttributes} />);

        expect(screen.getByText('Why this breed would be perfect for you')).toBeInTheDocument();
    });

    test('should not show RecommendationInfo when no matchScore and no matchedAttributes', () => {
        renderWithProviders(<BreedDisplay breed={mockBreedMinimal} />);

        expect(screen.queryByText('Why this breed would be perfect for you')).not.toBeInTheDocument();
    });

    test('should call onReset callback when Start Over button is clicked', async () => {
        const onReset = vi.fn();

        renderWithProviders(<BreedDisplay breed={mockBreed} onReset={onReset} />);

        const startOverButton = screen.getByRole('button', { name: 'Start Over' });
        const user = userEvent.setup();
        await user.click(startOverButton);

        expect(onReset).toHaveBeenCalledTimes(1);
    });

    test('should not show Start Over button when onReset is not provided', () => {
        renderWithProviders(<BreedDisplay breed={mockBreed} />);

        expect(screen.queryByRole('button', { name: 'Start Over' })).not.toBeInTheDocument();
    });

    test('should handle missing optional fields gracefully', () => {
        renderWithProviders(<BreedDisplay breed={mockBreedMinimal} />);

        // Test Breed appears multiple times (heading and DogImage mock)
        expect(screen.getAllByText('Test Breed').length).toBeGreaterThan(0);
        expect(screen.getByText('Minimal breed data')).toBeInTheDocument();
    });

    test('should render DogImage with breed name', () => {
        renderWithProviders(<BreedDisplay breed={mockBreed} />);

        expect(screen.getByTestId('dog-image')).toBeInTheDocument();
        expect(screen.getByTestId('dog-image')).toHaveTextContent('Labrador Retriever');
    });
});

