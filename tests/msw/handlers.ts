import { http, HttpResponse } from 'msw';

// MSW handlers for API route mocking in tests
export const handlers = [
  // Dog Image API
  http.get('/api/dog-image', ({ request }) => {
    const url = new URL(request.url);
    const breedName = url.searchParams.get('breedName');

    if (breedName === 'Labrador' || breedName === 'Labrador Retriever') {
      return HttpResponse.json({
        success: true,
        url: 'https://example.com/labrador.jpg'
      });
    }

    return HttpResponse.json({
      success: false,
      error: 'Breed not found'
    }, { status: 404 });
  }),

  // Breed API
  http.post('/api/breed', async ({ request }) => {
    const body = await request.json() as { breedName: string };
    
    if (body.breedName === 'Labrador Retriever') {
      return HttpResponse.json({
        breed: {
          breed: 'Labrador Retriever',
          description: 'Friendly and outgoing breed',
          temperament: ['friendly', 'outgoing'],
          popularity: 1
        }
      });
    }

    return HttpResponse.json({
      error: 'Breed not found'
    }, { status: 404 });
  }),

  // BreedFetcher API
  http.get('/api/breedFetcher', () => {
    return HttpResponse.json({
      breeds: ['Labrador Retriever', 'Golden Retriever', 'German Shepherd'],
      count: 3
    });
  }),

  // AI Recommendations API
  http.post('/api/ai-recommendations', async ({ request }) => {
    const body = await request.json() as { questionnaireAnswers: any[] };
    
    if (body.questionnaireAnswers && body.questionnaireAnswers.length > 0) {
      return HttpResponse.json({
        recommendation: {
          breed: 'Labrador Retriever',
          matchScore: 95,
          description: 'Friendly and outgoing breed',
          temperament: ['friendly', 'outgoing'],
          popularity: 1
        }
      });
    }

    return HttpResponse.json({
      error: 'No matching dog breeds found'
    }, { status: 404 });
  }),
];





