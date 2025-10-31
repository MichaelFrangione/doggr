import '@testing-library/jest-dom';
import 'whatwg-fetch';
import React from 'react';
import { server } from './msw/server';
import { vi, beforeAll, afterEach, afterAll } from 'vitest';
import { cleanup } from '@testing-library/react';

// Start/stop MSW in Node (vitest)
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => {
    server.resetHandlers();
    cleanup();
});
afterAll(() => server.close());

// Mock next/navigation (router + pathname)
const mockRouter = {
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
};

const mockUsePathname = vi.fn(() => '/');

vi.mock('next/navigation', () => ({
    useRouter: () => mockRouter,
    usePathname: () => mockUsePathname(),
    useSearchParams: () => new URLSearchParams(),
}));

// Export mocks for use in tests
export { mockRouter, mockUsePathname };

// Mock next/image to plain <img />
vi.mock('next/image', () => ({
    default: (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return React.createElement('img', { ...props });
    },
}));