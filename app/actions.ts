'use server';

import { headers } from 'next/headers';

export interface QuestionaireAnswer {
    question: {
        id: string;
        text: string;
    };
    answer: {
        id: string;
        text: string;
    };
}

export async function findMatchingDogs(questionnaireAnswers: QuestionaireAnswer[]) {
    try {
        // Get the base URL from headers for proper URL construction
        const headersList = await headers();
        const host = headersList.get('host');
        const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (host ? `${protocol}://${host}` : 'http://localhost:3000');

        const endpoint = '/api/ai-recommendations';

        // Call the AI recommendations API endpoint
        const response = await fetch(`${baseUrl}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ questionnaireAnswers }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
            console.error('API error:', errorData);
            return { error: errorData.error || 'Failed to get recommendations' };
        }

        const { recommendation } = await response.json();

        // Return the recommendation
        if (recommendation) {
            return { recommendation };
        }

        return { error: 'Invalid response format from API' };
    } catch (error) {
        console.error('Error finding matching dogs:', error);
        return { error: 'Failed to find matching dogs' };
    }
}