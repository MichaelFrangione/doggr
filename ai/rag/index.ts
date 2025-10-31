/**
 * Centralized Upstash Vector Index instance
 * This ensures we use a single instance across all RAG operations
 */
import { Index as UpstashIndex } from '@upstash/vector';

export const index = new UpstashIndex();

