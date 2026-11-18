import { CONCEPTS } from '@/src/data/disciplinary/cerebro';
import { ERROR_MAP } from '@/src/data/errors/catalog';
import { buildTutorSystemInstruction } from '@/src/prompts/tutorPrompts';
import {
  GeneratedExerciseCandidate,
  validateGeneratedExercise,
} from '@/src/services/validation/mathValidator';
import { StudentProfile, TutorMode } from '@/src/types';

export interface TutorReply {
  text: string;
  isFallback: boolean;
  errorMessage?: string;
}

function buildAutonomousFallbackReply(
  question: string,
  mode: TutorMode,
  profile: StudentProfile
): string {
  const q = question.toLowerCase();

  if (mode === 'docente') {
    const topErrors = Object.entries(profile.errorHistory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([code, count]) => `${code} (${ERROR_MAP[code]?.name ?? code}: ${count})`)
      .join('; ');

    return [
      `Resumen docente del perfil actual (${profile.name}):`,
      `• Diagnóstico: ${profile.diagnosticCompleted ? `${profile.diagnosticScore}%` : 'Pendiente'}.`,
      `• Desempeño acumulado: ${profile.totalCorrect} aciertos validados y ${profile.totalIncorrect} intentos con corrección pendiente.`,
      `• Errores predominantes: ${topErrors || 'ninguno registrado aún'}.`,
      `• Recomendación del Cerebro: ${profile.activeRecoveryRoutes.length > 0 ? profile.activeRecoveryRoutes.map((r) => r.reason).join(' | ') : 'Continuar la progresión modular exigiendo declaración explícita de dominio y justificación.'}`,
    ].join('\n');
  }

  if (q.includes('dominio') || q.includes('exist') || q.includes('negativ') || q.includes('base 1')) {
    return [
      'En ℝ, log_b(a) existe y es único si y solo si b > 0, b ≠ 1 y a > 0.',
      '• Si el argumento a ≤ 0: ninguna potencia b^x (con b > 0) puede dar 0 o negativo.',
      '• Si la base b = 1: 1^x = 1 es constante (fallan existencia y unicidad).',
      '• Si la base b < 0: [Corrección del Cerebro] b^x solo existe en ciertos racionales con denominador impar y no forma intervalos continuos.',
      'Recuerda que el logaritmo (resultado) sí puede ser negativo, por ejemplo log_2(1/8) = −3. ¿Qué condición cumple el argumento de tu ejercicio?',
    ].join('\n');
  }

  if (q.includes('extraña') || q.includes('perder') || q.includes('ecuaci')) {
    return [
      'Para resolver ecuaciones logarítmicas sigue siempre los 4 pasos:',
      '1. Determinar el dominio en la ecuación ORIGINAL (todos los argumentos > 0 y base > 0, ≠ 1).',
      '2. Transformar usando definición, propiedades o inyectividad (recuerda log(x²) = 2·log|x|).',
      '3. Resolver la ecuación algebraica.',
      '4. Verificar en la ecuación original y descartar soluciones extrañas provenientes del «dominio agregado» al condensar.',
      '¿Cuál es la condición de dominio de tu ecuación antes de aplicar propiedades?',
    ].join('\n');
  }

  if (q.includes('propiedad') || q.includes('suma') || q.includes('producto') || q.includes('cambio')) {
    return [
      'Cada propiedad de los logaritmos traduce una propiedad de la potenciación:',
      '• P1 (b^m·b^n = b^(m+n)) → L1: log_b(x·y) = log_b x + log_b y.',
      '• P2 (cociente) → L2: log_b(x/y) = log_b x − log_b y.',
      '• P3 (potencia) → L3: log_b(x^k) = k·log_b x.',
      'Atención: NO existe regla para log(x + y). Puedes comprobarlo con log(10 + 10) ≈ 1,301 ≠ log 10 + log 10 = 2. ¿Qué propiedad de potencia respalda el paso que quieres hacer?',
    ].join('\n');
  }

  const conceptRef = CONCEPTS[3]; // Definición por defecto
  return [
    `Recordemos la regla fundamental del Cerebro (${conceptRef.formalFormula}):`,
    'El logaritmo en base b de un número a es el exponente al que hay que elevar b para obtener a.',
    'Antes de calcular, respóndete en voz alta: ¿cuál es la base, cuál es el argumento y qué exponente estás buscando?',
    'Si me muestras tu primer paso o la expresión que estás trabajando, lo revisamos juntos sin saltear el control del dominio.',
  ].join('\n');
}


/** fetch con límite de tiempo: si el servidor tarda, se pasa al modo autónomo local. */
async function fetchWithTimeout(url: string, init: RequestInit, ms = 15000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** Lee JSON solo si la respuesta realmente es JSON (evita confundir un index.html con datos). */
async function readJsonSafe(res: Response): Promise<any> {
  const type = res.headers.get('content-type') ?? '';
  if (!type.includes('application/json')) return null;
  return res.json().catch(() => null);
}

export async function askTutor(params: {
  question: string;
  mode: TutorMode;
  profile: StudentProfile;
  history: { role: 'user' | 'assistant'; content: string }[];
}): Promise<TutorReply> {
  const systemInstruction = buildTutorSystemInstruction(params.mode, params.profile);

  try {
    const res = await fetchWithTimeout('/api/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question: params.question,
        mode: params.mode,
        systemInstruction,
        history: params.history.slice(-8),
      }),
    });

    if (!res.ok) {
      const errData = (await readJsonSafe(res)) ?? {};
      if (res.status === 503 || errData?.fallbackRecommended) {
        return {
          text: buildAutonomousFallbackReply(params.question, params.mode, params.profile),
          isFallback: true,
        };
      }
      return {
        text: buildAutonomousFallbackReply(params.question, params.mode, params.profile),
        isFallback: true,
        errorMessage: errData?.error || 'El servicio de tutoría en línea no respondió; se activó el modo autónomo local.',
      };
    }

    const data = await readJsonSafe(res);
    if (!data?.text) {
      return {
        text: buildAutonomousFallbackReply(params.question, params.mode, params.profile),
        isFallback: true,
      };
    }

    return { text: data.text, isFallback: false };
  } catch {
    return {
      text: buildAutonomousFallbackReply(params.question, params.mode, params.profile),
      isFallback: true,
    };
  }
}

export async function requestValidatedPracticeExercise(topic: string): Promise<{
  candidate?: GeneratedExerciseCandidate;
  validated: boolean;
  source: 'ai_validated' | 'local_fallback';
  note: string;
}> {
  try {
    const res = await fetchWithTimeout('/api/exercises/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic }),
    });
    if (!res.ok) {
      return {
        validated: false,
        source: 'local_fallback',
        note: 'Modo autónomo: usando banco curado y validado localmente.',
      };
    }
    const data = await readJsonSafe(res);
    if (!data?.candidate) {
      return {
        validated: false,
        source: 'local_fallback',
        note: 'No se pudo generar candidato remoto; se mantiene el banco validado.',
      };
    }
    const check = validateGeneratedExercise(data.candidate as GeneratedExerciseCandidate);
    if (!check.valid) {
      return {
        validated: false,
        source: 'local_fallback',
        note: `El motor de verificación rechazó una propuesta no válida (${check.reason}).`,
      };
    }
    return {
      candidate: data.candidate,
      validated: true,
      source: 'ai_validated',
      note: 'Generado y verificado matemáticamente (b > 0, b ≠ 1, a > 0 y b^c = a).',
    };
  } catch {
    return {
      validated: false,
      source: 'local_fallback',
      note: 'Sin conexión con servidor de IA; banco curado disponible offline.',
    };
  }
}
