import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from '../tests/renderWithProviders';
import Home from './page';
import { vi } from 'vitest';
import * as nav from 'next/navigation';

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
            screen.getByRole('button', { name: /Find your perfect match now/i })
        ).toBeInTheDocument();
    });

    test('CTA navigates to questionnaire', async () => {
        const user = userEvent.setup();
        renderWithProviders(<Home />);

        const cta = screen.getByRole('button', { name: /Find your perfect match now/i });
        await user.click(cta);

        // Router is mocked in tests/setup.ts; assert push called with expected path
        // Grab the mocked useRouter instance and assert push was called
        const mockRouter: any = nav.useRouter();
        expect(mockRouter.push).toHaveBeenCalledWith('/questionaire');
    });
});


