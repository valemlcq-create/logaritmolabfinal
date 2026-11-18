/**
 * Lógica compartida de los endpoints de IA.
 *
 * La usan:
 *  - netlify/functions/*.mts  → en producción (Netlify Functions)
 *  - server.ts                → en desarrollo local (npm run dev)
 *
 * Todas las funciones devuelven { status, body } para que cada entorno
 * arme su propia respuesta HTTP.
 */
import { GoogleGenAI, Type } from '@google/genai';

export interface ApiResult {
  status: number;
  body: Record<string, unknown>;
}

/** Modelo por defecto. Se puede cambiar con la variable de entorno GEMINI_MODEL. */
const DEFAULT_MODEL = 'gemini-2.5-flash';

/** Netlify corta las funciones síncronas a los ~10 s: respondemos antes con un fallback. */
const REQUEST_TIMEOUT_MS = 9000;

const LIMITS = {
  question: 2000,
  systemInstruction: 12000,
  historyItems: 8,
  historyItem: 2000,
  topic: 120,
};

function getApiKey(): string | null {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key || key === 'MY_GEMINI_API_KEY') return null;
  return key;
}

function getModel(): string {
  return process.env.GEMINI_MODEL?.trim() || DEFAULT_MODEL;
}

function getClient(): GoogleGenAI | null {
  const apiKey = getApiKey();
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: { timeout: REQUEST_TIMEOUT_MS },
  });
}

/** En los modelos 2.5 Flash desactivamos el "thinking" para responder rápido. */
function speedConfig(model: string): Record<string, unknown> {
  return model.startsWith('gemini-2.5-flash') ? { thinkingConfig: { thinkingBudget: 0 } } : {};
}

function clip(value: unknown, max: number): string {
  return typeof value === 'string' ? value.slice(0, max) : '';
}

function errorMessage(err: unknown, fallback: string): string {
  return err instanceof Error && err.message ? err.message : fallback;
}

export function validateCandidateOnServer(candidate: {
  statement?: string;
  base?: number;
  argument?: number;
  expectedNumericAnswer?: number;
}): { valid: boolean; reason?: string } {
  if (!candidate || typeof candidate.statement !== 'string' || candidate.statement.trim().length < 8) {
    return { valid: false, reason: 'Enunciado inválido.' };
  }
  const b = Number(candidate.base);
  const a = Number(candidate.argument);
  const c = Number(candidate.expectedNumericAnswer);
  if (!Number.isFinite(b) || b <= 0 || b === 1) {
    return { valid: false, reason: 'La base no cumple b > 0 y b ≠ 1.' };
  }
  if (!Number.isFinite(a) || a <= 0) {
    return { valid: false, reason: 'El argumento no cumple a > 0.' };
  }
  if (!Number.isFinite(c)) {
    return { valid: false, reason: 'El exponente esperado no es un número real finito.' };
  }
  const check = Math.pow(b, c);
  if (Math.abs(check - a) > 0.02 * Math.max(1, a)) {
    return { valid: false, reason: 'Inconsistencia entre b^c y a.' };
  }
  return { valid: true };
}

export function handleHealth(): ApiResult {
  return { status: 200, body: { ok: true, aiAvailable: Boolean(getApiKey()), model: getModel() } };
}

export async function handleTutor(reqBody: unknown): Promise<ApiResult> {
  const ai = getClient();
  if (!ai) {
    return {
      status: 503,
      body: {
        fallbackRecommended: true,
        error: 'Servicio de tutoría en línea no configurado; operando en modo autónomo local.',
      },
    };
  }

  const body = (reqBody ?? {}) as Record<string, unknown>;
  const question = clip(body.question, LIMITS.question).trim();
  if (!question) {
    return { status: 400, body: { error: 'Se requiere una consulta válida.' } };
  }

  const systemInstruction =
    clip(body.systemInstruction, LIMITS.systemInstruction).trim() ||
    'Eres un tutor de matemática sobre logaritmos. No des la solución directa; guía con pistas.';

  const historyLines = Array.isArray(body.history)
    ? body.history
        .slice(-LIMITS.historyItems)
        .filter((m): m is { role: string; content: string } =>
          Boolean(m) && typeof (m as { content?: unknown }).content === 'string'
        )
        .map(
          (m) =>
            `${m.role === 'user' ? 'Estudiante/Usuario' : 'Tutor'}: ${m.content.slice(0, LIMITS.historyItem)}`
        )
        .join('\n')
    : '';

  const prompt = historyLines
    ? `Contexto previo de la conversación:\n${historyLines}\n\nNueva consulta:\n${question}`
    : question;

  const model = getModel();
  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: { systemInstruction, ...speedConfig(model) },
    });
    return { status: 200, body: { text: response.text ?? '' } };
  } catch (err) {
    return {
      status: 502,
      body: { fallbackRecommended: true, error: errorMessage(err, 'Error al consultar el tutor.') },
    };
  }
}

export async function handleGenerateExercise(reqBody: unknown): Promise<ApiResult> {
  const ai = getClient();
  if (!ai) {
    return {
      status: 503,
      body: {
        fallbackRecommended: true,
        error: 'Generación asistida no disponible; usa el banco curado local.',
      },
    };
  }

  const body = (reqBody ?? {}) as Record<string, unknown>;
  const topic = clip(body.topic, LIMITS.topic).trim() || 'definición de logaritmo';
  const model = getModel();

  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Genera un ejercicio breve y exacto sobre "${topic}" para 5.º año de secundaria (Argentina), en el que b^expectedNumericAnswer = argument exactamente (por ejemplo, exponentes enteros o fracciones simples como 1/2, 3/2, -2).`,
      config: {
        ...speedConfig(model),
        systemInstruction:
          'Genera únicamente ejercicios matemáticamente válidos en ℝ con b > 0, b ≠ 1 y a > 0. Usa coma decimal en el enunciado si hay decimales.',
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            statement: { type: Type.STRING },
            base: { type: Type.NUMBER },
            argument: { type: Type.NUMBER },
            expectedNumericAnswer: { type: Type.NUMBER },
            domainCondition: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: [
            'statement',
            'base',
            'argument',
            'expectedNumericAnswer',
            'domainCondition',
            'explanation',
          ],
        },
      },
    });

    let candidate: unknown;
    try {
      candidate = JSON.parse((response.text ?? '{}').trim());
    } catch {
      return {
        status: 422,
        body: { error: 'La IA devolvió un JSON inválido.', fallbackRecommended: true },
      };
    }

    const validation = validateCandidateOnServer(candidate as Parameters<typeof validateCandidateOnServer>[0]);
    if (!validation.valid) {
      return {
        status: 422,
        body: {
          error: `Validación matemática rechazada: ${validation.reason}`,
          fallbackRecommended: true,
        },
      };
    }
    return { status: 200, body: { candidate, validated: true } };
  } catch (err) {
    return {
      status: 502,
      body: { error: errorMessage(err, 'Error generando ejercicio.'), fallbackRecommended: true },
    };
  }
}
