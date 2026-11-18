// GET /api/health  →  /.netlify/functions/health  (ver netlify.toml)
import { handleHealth } from '../lib/ai.ts';
import { toResponse } from '../lib/http.ts';

export default async (): Promise<Response> => toResponse(handleHealth());
