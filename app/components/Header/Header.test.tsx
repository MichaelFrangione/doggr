import { screen } from '@testing-library/react';
import { renderWithProviders } from '../../../tests/renderWithProviders';
import Header from './Header';
import { expect, describe, test, vi } from 'vitest';
import * as nav from 'next/navigation';
import userEvent from '@testing-library/user-event';
import styles from './Header.module.css';

describe('Header', () => {
    test('renders brand and navigation links', () => {
        renderWithProviders(<Header />);

        expect(screen.getByAltText('Doggr')).toBeInTheDocument();
        expect(screen.getByRole('heading', { name: 'Doggr' })).toBeInTheDocument();

        expect(screen.getByRole('link', { name: /Questionaire/i })).toHaveAttribute(
            'href',
            '/questionaire'
        );
        expect(screen.getByRole('link', { name: /Breeds/i })).toHaveAttribute(
            'href',
            '/breeds'
        );
    });

    test('applies active class to current route link', async () => {
        // Override pathname for this test
        vi.spyOn(nav, 'usePathname').mockReturnValue('/breeds');

        renderWithProviders(<Header />);

        const breedsLink = screen.getByRole('link', { name: /Breeds/i });
        const qLink = screen.getByRole('link', { name: /Questionaire/i });

        expect(breedsLink.className).toContain(styles.active);
        expect(qLink.className).not.toContain(styles.active);
    });

    test('clicking brand navigates home', async () => {
        const user = userEvent.setup();
        const router: any = nav.useRouter();

        renderWithProviders(<Header />);

        await user.click(screen.getByRole('heading', { name: 'Doggr' }));
        expect(router.push).toHaveBeenCalledWith('/');
    });
});


