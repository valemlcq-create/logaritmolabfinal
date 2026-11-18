// POST /api/exercises/generate  →  /.netlify/functions/generate-exercise  (ver netlify.toml)
import { handleGenerateExercise } from '../lib/ai.ts';
import { methodNotAllowed, readJson, toResponse } from '../lib/http.ts';

export default async (req: Request): Promise<Response> => {
  if (req.method !== 'POST') return methodNotAllowed('POST');
  return toResponse(await handleGenerateExercise(await readJson(req)));
};
