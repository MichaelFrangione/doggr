import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['tests/setup.tsx'],
        css: true,
        include: [
            'app/**/*.test.{ts,tsx}',
            'tests/**/*.test.{ts,tsx}'
        ],
        exclude: [
            '**/node_modules/**',
            '**/.next/**',
            '**/coverage/**',
            '**/dist/**',
            '**/build/**'
        ],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'html', 'lcov'],
            reportsDirectory: 'coverage',
        },
        root: '.',
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './'),
        },
    },
});


