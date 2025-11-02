# Doggr

An AI-powered dog breed matching platform that helps users find their perfect canine companion through questionnaire-based recommendations,a breed browsing, and an interactive chat assistant named Hiro.

## Project Overview

Doggr is a Next.js application that combines AI with semantic search to help people discover matching dog breeds. The platform offers three distinct ways to find the perfect match:

- **Questionnaire** - Answer questions about your lifestyle and preferences to get AI-powered breed recommendations
- **Breed Browser** - Explore dog breeds with detailed information and characteristics
- **AI Chat Assistant (Hiro)** - Interact with an enthusiastic Shiba Inu AI assistant for breed information and recommendations

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript
- **AI/ML**: OpenAI GPT-4o, Upstash Vector (RAG)
- **UI Components**: Radix UI Themes
- **Testing**: Vitest, React Testing Library, MSW
- **Styling**: CSS Modules

## Background & Purpose

### Solution Approach

Doggr employs a two-stage matching system:

1. **AI-Powered Filter Generation** - OpenAI GPT-4o analyzes questionnaire responses and converts natural language preferences into structured search parameters and filters
2. **Semantic Vector Search** - Upstash Vector database performs similarity search on breed embeddings combined with metadata filtering
3. **Progressive Relaxation** - A filter tier system ensures users always receive relevant results, even with stricter preferences

## Technical Architecture & Considerations

### RAG Implementation

The application uses Retrieval Augmented Generation (RAG) to provide accurate breed information:

- **Vector Database**: Upstash Vector stores 200+ breed embeddings with rich metadata
- **Ingestion Pipeline**: `ai/rag/ingest.ts` processes CSV data into vector embeddings with structured metadata including temperament, size, energy level, grooming needs, and popularity rankings
- **Hybrid Search**: Combines semantic similarity search with structured metadata filtering for precise results

### AI Integration

**Structured Output Generation**: OpenAI GPT-4o with Zod schemas generates type-safe filter parameters from questionnaire answers. The AI converts human-readable preferences (e.g., "less than 30 minutes exercise") into numeric filters (e.g., `energyMaxValue: 0.4`) using explicit conversion rules.

**AI Chat Tool Calling**: The ai assistant, uses function calling to search breeds and fetch details:
- `dogBreedSearchTool`: Vector search with metadata filters
- `breedFetcherTool`: Retrieve specific breed information

### Filter Tier System

To handle the zero-results problem with strict user preferences, Doggr implements a 5-tier progressive relaxation strategy:

```typescript
Tier 1: All filters applied
Tier 2: Skip temperament tags (too restrictive)
Tier 3: Only numeric filters (energy, shedding, grooming, weight)
Tier 4: Only essential filters (weight, trainability)
Tier 5: Pure semantic search (no filters)
```

Additionally, a popularity-first approach prioritizes well-known breeds:
- **Caps**: 50 → 100 → 150 → any
- Ensures quality results surface first while maintaining breadth

### Testing Strategy

Comprehensive test coverage with environment-specific configurations:

- **Vitest**: Fast, Vite-powered test runner
- **jsdom**: DOM environment for UI component tests
- **MSW**: Mock Service Worker for API route testing
- **Environment Isolation**: API tests run in Node.js, UI tests in jsdom

## 🔧 Challenges Overcome

### 1. Taxonomy-Based Search Balance

**Challenge**: Finding the right balance between structured taxonomy filtering and AI-powered semantic search.

**Solution**: Hybrid approach where AI generates structured filters from natural language, and metadata filtering constrains vector search results. This provides the flexibility of semantic search with the precision of structured queries.

### 2. Zero Results Problem

**Challenge**: Strict user preferences (e.g., "small, hypoallergenic, high energy for apartment") often returned no matches from the vector database.

**Solution**: Built a 5-tier filter relaxation system that progressively removes constraints until results are found. Popularity caps ensure quality breeds surface first at each tier. This guarantees users always receive recommendations while maintaining relevance.

### 3. Questionnaire-to-Breed Matching

**Challenge**: Questionnaire uses human terms ("lazy," "lap dog," "protective"), while breed data uses numeric values (energy: 0.3, trainability: 0.7).

**Solution**: AI-powered conversion with explicit rules in the prompt:
- "Less than 30 minutes exercise" → `energyMaxValue: 0.4`
- "Has allergies" → `sheddingMaxValue: 0.4, groomingMaxValue: 0.4`
- "Independent personality" → `temperamentTags: ['independent', 'reserved', 'alert']`

The `buildMatchedAttributes()` function creates human-readable explanations showing why each breed matched specific user preferences.

### 4. Reusable Component Design

**Challenge**: Breed information needs to display in multiple contexts (questionnaire results, breed browser) without duplicating code.

**Solution**: Modular `BreedDisplay` component with optional props adapts to each context:
- Separate static display from async operations
- Extract match explanations into separate component

### 5. Secondary Image API Integration

**Challenge**: Upstash Vector database contains breed metadata but no images.

**Solution**: Built `fetchDogImage` utility that queries [The Dog API](https://thedogapi.com/) on-demand:
- Error handling with fallback placeholders
- Async component pattern with loading states

### 6. Effective Vector Search Queries

**Challenge**: Generic queries ("friendly dog") don't match breed descriptions well in the vector database.

**Solution**: AI generates rich semantic queries by combining multiple factors from questionnaire answers:
```
"apartment friendly small dog low energy gentle temperament good with children"
```

The search combines semantic understanding with metadata filters for precision. Chat queries use natural language directly, with AI tools extracting structured filters when needed.

### 7. Markdown in AI Chat

**Challenge**: AI chat assistant needs to display structured, clickable breed information in a conversational format.

**Solution**: Custom `MarkdownMessage` component with styled markdown rendering:
- H2 headers automatically convert to clickable breed links (`/breeds/[breed]`)
- Structured format for consistent presentation
- Custom styling aligned with app theme

The AI system prompt instructs Hiro to use specific markdown formatting for breed information, ensuring consistent output.

### 8. Visual Design with Lottie Animations

**Challenge**: Creating an engaging, modern UI without heavy image assets that impact performance.

**Solution**: Integrated `lottie-react` for lightweight, scalable animations:
- Vector-based graphics that scale perfectly

## 🚀 Future Improvements

1. **Multiple Breed Recommendations** - Show top 3-5 matches with side-by-side comparison instead of single result
2. **Advanced Breed List** - Add filters (breed group, weight range, energy level), sorting options, debounced search, and alphabetical grouping
3. **Enhanced AI Chat** - Conversational questionnaire alternative, breed comparison tool, and user preference memory across sessions
4. **Breeder Integration** - Display AKC-certified breeders on breed detail pages with contact information and reviews. Hiro can assist in locating breeders by location.
5. **Improved Matching Algorithm** - Implement weighted scoring (must-haves vs. nice-to-haves), negative filtering (deal-breakers).
6. **Interactive Refinement** - Allow users to adjust match preferences after seeing results with real-time re-ranking

## 📋 Setup Instructions

### Prerequisites

- Node.js 20+ installed
- npm or yarn package manager
- OpenAI API key
- TheDogAPI key
- Upstash account with Vector database

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd doggr
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file in the root directory:
```env
OPENAI_API_KEY=your_openai_api_key
UPSTASH_VECTOR_REST_URL=your_upstash_vector_url
UPSTASH_VECTOR_REST_TOKEN=your_upstash_vector_token
THE_DOG_API_KEY=your_dog_api_key
```

4. Ingest breed data into Upstash Vector:
```bash
npm run ingest
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

### Running Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

### Building for Production

```bash
npm run build
npm start
```

## 📁 Project Structure

```
doggr/
├── app/                          # Next.js App Router
│   ├── actions.ts                # Server actions
│   ├── api/                      # API routes
│   │   ├── ai-recommendations/   # Questionnaire matching endpoint
│   │   ├── breed/                # Breed details endpoint
│   │   ├── breedFetcher/         # Breed list endpoint
│   │   ├── chat/                 # AI chat endpoint
│   │   └── dog-image/            # Image fetching endpoint
│   ├── ask/                      # AI chat page
│   ├── breeds/                   # Breed browser pages
│   ├── components/               # Shared React components
│   │   ├── BreedDisplay/         # Breed display components
│   │   ├── Header/               # Navigation header
│   │   ├── PeekingDog/           # Animated dog easter egg
│   │   └── loading.tsx           # Animated loading component
│   ├── questionaire/             # Questionnaire flow
│   │   ├── components/           # Survey, Results, Error views
│   │   └── utils.ts              # Processing utilities
│   └── page.tsx                  # Landing page
├── ai/                           # AI/RAG logic
│   ├── rag/                      # Vector database integration
│   │   ├── data/                 # CSV breed data
│   │   ├── index.ts              # Upstash Vector instance
│   │   ├── ingest.ts             # Data ingestion script
│   │   ├── query.ts              # Vector search functions
│   │   └── types.ts              # Type definitions
│   └── tools/                    # AI SDK tools
│       ├── breedFetcher/         # Breed list tool
│       ├── dogSearch/            # Search tool with utilities
│       └── ...
├── tests/                        # Test setup
│   ├── msw/                      # MSW handlers
│   └── setup.tsx                 # Vitest configuration
├── vitest.config.ts              # Vitest configuration
└── package.json                  # Dependencies
```

## 🤝 Contributing

This project was built as a technical demonstration showcasing:
- Modern full-stack development with Next.js and React
- AI/ML integration with OpenAI and vector search
- Complex problem-solving with progressive algorithms
- Clean, maintainable code architecture
- Comprehensive testing strategies

## 📄 License

Private proje