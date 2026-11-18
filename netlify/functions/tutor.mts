// POST /api/tutor  →  /.netlify/functions/tutor  (ver netlify.toml)
import { handleTutor } from '../lib/ai.ts';
import { methodNotAllowed, readJson, toResponse } from '../lib/http.ts';

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return methodNotAllowed('POST');
  return toResponse(await handleTutor(await readJson(req)));
};
