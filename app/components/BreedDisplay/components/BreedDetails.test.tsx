import { describe, test, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../tests/renderWithProviders';
import BreedDetails from './BreedDetails';

// Mock Lottie to avoid canvas dependency
vi.mock('@/app/components/lottieImage', () => ({
    default: () => <div data-testid="lottie" />,
}));

describe('BreedDetails', () => {
    test('should render all breed attributes correctly', () => {
        const props = {
            size: {
                height: { min: 55, max: 62 },
                weight: { min: 25, max: 36 }
            },
            energy: {
                level: 'energetic',
                value: 0.8
            },
            grooming: {
                frequency: 'weekly brushing',
                value: '0.3',
                shedding: 'regularly'
            },
            trainability: {
                level: 'eager to please',
                value: 0.9
            },
            lifeExpectancy: { min: 10, max: 12 },
            group: 'Sporting Group',
            temperament: ['friendly', 'outgoing', 'gentle'],
            popularity: 1
        };

        renderWithProviders(<BreedDetails {...props} />);

        expect(screen.getByText(/Size:/)).toBeInTheDocument();
        expect(screen.getByText(/Energy Level:/)).toBeInTheDocument();
        expect(screen.getByText(/Grooming:/)).toBeInTheDocument();
        expect(screen.getByText(/Trainability:/)).toBeInTheDocument();
        expect(screen.getByText(/Life Expectancy:/)).toBeInTheDocument();
        expect(screen.getByText(/Group:/)).toBeInTheDocument();
        expect(screen.getByText(/Popularity:/)).toBeInTheDocument();
        expect(screen.getByText(/Temperament:/)).toBeInTheDocument();
    });

    test('should format size correctly (converts kg to lbs, rounds numbers)', () => {
        const props = {
            size: {
                height: { min: 55.7, max: 62.3 },
                weight: { min: 25.5, max: 36.2 }
            }
        };

        renderWithProviders(<BreedDetails {...props} />);

        expect(screen.getByText(/Height 55.7-62.3cm/)).toBeInTheDocument();
        expect(screen.getByText(/Weight/)).toBeInTheDocument();
    });

    test('should format life expectancy correctly', () => {
        const props = {
            lifeExpectancy: { min: 10.5, max: 12.7 }
        };

        renderWithProviders(<BreedDetails {...props} />);

        expect(screen.getByText(/10.5-12.7 years/)).toBeInTheDocument();
    });

    test('should show popularity bucket correctly', () => {
        const { rerender } = renderWithProviders(<BreedDetails popularity={1} />);
        expect(screen.getByText(/Very popular/i)).toBeInTheDocument();

        rerender(<BreedDetails popularity={75} />);
        expect(screen.getByText(/^Popular$/i)).toBeInTheDocument();

        rerender(<BreedDetails popularity={125} />);
        expect(screen.getByText(/Average/i)).toBeInTheDocument();

        rerender(<BreedDetails popularity={200} />);
        expect(screen.getByText(/Niche/i)).toBeInTheDocument();
    });

    test('should format temperament array as comma-separated string', () => {
        const props = {
            temperament: ['friendly', 'outgoing', 'gentle']
        };

        renderWithProviders(<BreedDetails {...props} />);

        expect(screen.getByText(/friendly/)).toBeInTheDocument();
        expect(screen.getByText(/outgoing/)).toBeInTheDocument();
        expect(screen.getByText(/gentle/)).toBeInTheDocument();
    });

    test('should handle missing optional fields gracefully', () => {
        renderWithProviders(<BreedDetails />);

        expect(screen.getByText('Breed Details')).toBeInTheDocument();

        expect(screen.queryByText(/Size:/)).not.toBeInTheDocument();
        expect(screen.queryByText(/Energy Level:/)).not.toBeInTheDocument();
    });

    test('should not render popularity when undefined', () => {
        renderWithProviders(<BreedDetails size={{ height: { min: 50, max: 60 }, weight: { min: 20, max: 30 } }} />);

        expect(screen.queryByText(/Popularity:/)).not.toBeInTheDocument();
    });
});

