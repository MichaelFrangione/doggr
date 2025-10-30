import '@testing-library/jest-dom';
import 'whatwg-fetch';
import React from 'react';
import { server } from './msw/server';
import { vi, beforeAll, afterEach, afterAll } from 'vitest';

// Start/stop MSW in Node (vitest)
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// Mock next/navigation (router + pathname)
vi.mock('next/navigation', () => {
    const router = {
        push: vi.fn(),
        replace: vi.fn(),
        prefetch: vi.fn(),
        back: vi.fn(),
        forward: vi.fn(),
        refresh: vi.fn(),
    };
    return {
        useRouter: () => router,
        usePathname: () => '/',
        useSearchParams: () => new URLSearchParams(),
    };
});

// Mock next/image to plain <img />
vi.mock('next/image', () => ({
    default: (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return React.createElement('img', { ...props });
    },
}));

