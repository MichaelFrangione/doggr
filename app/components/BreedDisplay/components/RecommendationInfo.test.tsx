import { describe, test, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../../tests/renderWithProviders';
import RecommendationInfo from './RecommendationInfo';
import { mockMatchedAttributes } from '../../../../tests/fixtures/breeds';

describe('RecommendationInfo', () => {
    test('should render matched attributes when provided', () => {
        renderWithProviders(<RecommendationInfo matchedAttributes={mockMatchedAttributes} />);

        expect(screen.getByText('Why this breed would be perfect for you')).toBeInTheDocument();
        expect(screen.getByText(/Size:/)).toBeInTheDocument();
        expect(screen.getByText(/Energy Level:/)).toBeInTheDocument();
    });

    test('should not render when matchedAttributes is empty', () => {
        renderWithProviders(<RecommendationInfo matchedAttributes={[]} />);

        expect(screen.queryByText('Why this breed would be perfect for you')).not.toBeInTheDocument();
    });

    test('should not render when matchedAttributes is undefined', () => {
        renderWithProviders(<RecommendationInfo />);

        expect(screen.queryByText('Why this breed would be perfect for you')).not.toBeInTheDocument();
    });

    test('should show checkmark for matched attributes', () => {
        renderWithProviders(<RecommendationInfo matchedAttributes={mockMatchedAttributes} />);

        const checkmarks = screen.getAllByText('✓');
        expect(checkmarks.length).toBeGreaterThan(0);
    });

    test('should display breed values correctly', () => {
        renderWithProviders(<RecommendationInfo matchedAttributes={mockMatchedAttributes} />);

        expect(screen.getByText('Large (25-36kg)')).toBeInTheDocument();
        expect(screen.getByText('energetic')).toBeInTheDocument();
    });
});

