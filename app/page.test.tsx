import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../tests/renderWithProviders';
import Home from './page';
import { vi } from 'vitest';
import { mockRouter } from '../tests/setup';

// Mock Lottie component to avoid canvas dependency in jsdom
vi.mock('./components/lottieImage', () => ({
    default: () => <div data-testid="lottie" />,
}));

describe('Home page', () => {
    test('renders hero copy and CTA', () => {
        renderWithProviders(<Home />);

        expect(screen.getByRole('heading', { name: 'Welcome to Doggr' })).toBeDefined();
        expect(screen.getByRole('heading', { name: 'Find the perfect dog for you' })).toBeDefined();
        expect(
            screen.getByText(/Doggr is a tool that helps you find the perfect dog/i)
        ).toBeDefined();
        expect(
            screen.getByRole('button', { name: /Take Questionnaire/i })
        ).toBeInTheDocument();
    });

    test('CTA navigates to questionnaire', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Home />);

        const cta = screen.getByRole('button', { name: /Take Questionnaire/i });
        await user.click(cta);

        expect(mockRouter.push).toHaveBeenCalledWith('/questionaire');
    });
});


