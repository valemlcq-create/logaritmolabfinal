import { ERROR_MAP } from '@/src/data/errors/catalog';
import {
  ConceptMasteryStatus,
  LearningAttempt,
  LearningRoute,
  ProgressRecord,
  StudentProfile,
} from '@/src/types';

export function createDefaultProfile(name = 'Estudiante 5.º Comunicación'): StudentProfile {
  return {
    id: 'student-local',
    name,
    diagnosticCompleted: false,
    diagnosticScore: 0,
    missingPrerequisites: [],
    initialProfileSummary:
      'Aún no completaste el diagnóstico inicial (Módulo 0). Realízalo para adaptar tu ruta.',
    visitedModules: ['m0'],
    completedActivities: [],
    completedExercises: [],
    totalCorrect: 0,
    totalIncorrect: 0,
    errorHistory: {},
    averageDifficulty: 2,
    totalHintsUsed: 0,
    totalTimeSec: 0,
    conceptProgress: {},
    activeRecoveryRoutes: [],
    attempts: [],
    metacognitionLogs: [],
    selfAssessments: [],
  };
}

function computeStatus(score: number, attempts: number, errors: Record<string, number>): ConceptMasteryStatus {
  if (attempts === 0) return 'no_iniciado';
  const totalErrors = Object.values(errors).reduce((a, b) => a + b, 0);
  if (score >= 80 && totalErrors <= 1) return 'dominado';
  if (totalErrors >= 2 || score < 55) return 'necesita_recuperacion';
  return 'en_proceso';
}

export function buildRecoveryRoute(
  conceptId: string,
  errorCode: string,
  reason: string
): LearningRoute {
  const err = ERROR_MAP[errorCode];
  return {
    id: `route-${conceptId}-${errorCode}-${Date.now()}`,
    targetConceptId: conceptId,
    reason,
    triggeredByErrorCode: errorCode,
    createdAt: new Date().toISOString(),
    steps: [
      {
        phase: 'aprendizaje',
        label: `Revisar núcleo conceptual (${err?.recoveryModuleId.toUpperCase() ?? 'M3'})`,
        moduleId: err?.recoveryModuleId ?? 'm3',
        completed: false,
      },
      {
        phase: 'error',
        label: `Analizar causa de ${errorCode}: ${err?.name ?? 'Error conceptual'}`,
        moduleId: err?.recoveryModuleId ?? 'm3',
        completed: false,
      },
      {
        phase: 'recuperacion',
        label: 'Resolver ejercicio equivalente guiado',
        moduleId: err?.recoveryModuleId ?? 'm3',
        completed: false,
      },
      {
        phase: 'transferencia',
        label: 'Aplicar en ejercicio de transferencia sin pistas',
        moduleId: 'm7',
        completed: false,
      },
    ],
  };
}

export function applyAttemptToProfile(
  profile: StudentProfile,
  attempt: LearningAttempt,
  difficulty: number
): StudentProfile {
  const prevConcept: ProgressRecord = profile.conceptProgress[attempt.conceptId] ?? {
    conceptId: attempt.conceptId,
    status: 'no_iniciado',
    masteryScore: 0,
    attemptsCount: 0,
    correctCount: 0,
    errorFrequencyByCode: {},
    lastUpdated: attempt.timestamp,
  };

  const newErrorFreq = { ...prevConcept.errorFrequencyByCode };
  const newGlobalErrorHistory = { ...profile.errorHistory };
  for (const code of attempt.detectedErrorCodes) {
    newErrorFreq[code] = (newErrorFreq[code] ?? 0) + 1;
    newGlobalErrorHistory[code] = (newGlobalErrorHistory[code] ?? 0) + 1;
  }

  const attemptsCount = prevConcept.attemptsCount + 1;
  const isFullSuccess =
    attempt.isResultCorrect && attempt.isDomainValid && attempt.isJustificationValid;
  const correctCount = prevConcept.correctCount + (isFullSuccess ? 1 : 0);

  // Score penalizes domain/justification omissions even if numeric result matches
  let delta = 0;
  if (isFullSuccess) {
    delta = attempt.hintsUsed.length === 0 ? 35 : 22;
  } else if (attempt.isResultCorrect) {
    delta = 8; // Correct number but missing domain/justification
  } else {
    delta = -10;
  }
  const masteryScore = Math.max(0, Math.min(100, prevConcept.masteryScore + delta));
  const status = computeStatus(masteryScore, attemptsCount, newErrorFreq);

  const updatedConcept: ProgressRecord = {
    conceptId: attempt.conceptId,
    status,
    masteryScore,
    attemptsCount,
    correctCount,
    errorFrequencyByCode: newErrorFreq,
    lastUpdated: attempt.timestamp,
  };

  // Trigger specific recovery route without simply dropping global difficulty
  let activeRoutes = [...profile.activeRecoveryRoutes];
  for (const code of attempt.detectedErrorCodes) {
    const count = newGlobalErrorHistory[code] ?? 0;
    const alreadyActive = activeRoutes.some(
      (r) => r.triggeredByErrorCode === code
    );
    if ((count >= 2 || code === 'ERR-I' || code === 'ERR-PRE') && !alreadyActive) {
      const err = ERROR_MAP[code];
      activeRoutes.push(
        buildRecoveryRoute(
          err?.recoveryConceptId ?? attempt.conceptId,
          code,
          `Se detectaron dificultades recurrentes asociadas a ${code} (${err?.name ?? ''}).`
        )
      );
    }
  }

  const completedExercises =
    isFullSuccess && !profile.completedExercises.includes(attempt.exerciseId)
      ? [...profile.completedExercises, attempt.exerciseId]
      : profile.completedExercises;

  const totalAttempts = profile.totalCorrect + profile.totalIncorrect + 1;
  const averageDifficulty = Number(
    (
      (profile.averageDifficulty * (totalAttempts - 1) + difficulty) /
      totalAttempts
    ).toFixed(2)
  );

  return {
    ...profile,
    completedExercises,
    totalCorrect: profile.totalCorrect + (isFullSuccess ? 1 : 0),
    totalIncorrect: profile.totalIncorrect + (isFullSuccess ? 0 : 1),
    errorHistory: newGlobalErrorHistory,
    averageDifficulty,
    totalHintsUsed: profile.totalHintsUsed + attempt.hintsUsed.length,
    totalTimeSec: profile.totalTimeSec + attempt.durationSec,
    conceptProgress: {
      ...profile.conceptProgress,
      [attempt.conceptId]: updatedConcept,
    },
    activeRecoveryRoutes: activeRoutes,
    attempts: [attempt, ...profile.attempts].slice(0, 80),
  };
}

export function getAdaptiveRecommendation(profile: StudentProfile): {
  headline: string;
  actionLabel: string;
  targetModuleId: string;
  detail: string;
} {
  if (!profile.diagnosticCompleted) {
    return {
      headline: 'Completa el diagnóstico inicial (Módulo 0)',
      actionLabel: 'Ir al Diagnóstico',
      targetModuleId: 'm0',
      detail: 'Evaluaremos potencias, radicales y crecimiento para armar tu ruta personalizada.',
    };
  }

  const domainErrors =
    (profile.errorHistory['ERR-C'] ?? 0) +
    (profile.errorHistory['ERR-G'] ?? 0) +
    (profile.errorHistory['ERR-I'] ?? 0) +
    (profile.errorHistory['ERR-L'] ?? 0);

  if (domainErrors >= 2) {
    return {
      headline: 'Ruta activa: control del dominio y soluciones extrañas',
      actionLabel: 'Reforzar en Módulo 3 / 6',
      targetModuleId: 'm3',
      detail:
        'Comprendes las transformaciones, pero omites verificar el dominio original antes y después de resolver.',
    };
  }

  if ((profile.errorHistory['ERR-PRE'] ?? 0) >= 1) {
    return {
      headline: 'Recuperación de prerrequisitos: potenciación y radicales',
      actionLabel: 'Reforzar Módulo 0',
      targetModuleId: 'm0',
      detail:
        'Consolidar exponentes negativos y fraccionarios es indispensable antes de propiedades logarítmicas.',
    };
  }

  if ((profile.errorHistory['ERR-F'] ?? 0) >= 1) {
    return {
      headline: 'Atención a la ilusión de linealidad (Módulo 4)',
      actionLabel: 'Ir al Módulo 4',
      targetModuleId: 'm4',
      detail:
        'Contrasta log(x + y) ≠ log x + log y y conecta L1–L3 con P1–P3.',
    };
  }

  if ((profile.errorHistory['ERR-M'] ?? 0) >= 1) {
    return {
      headline: 'Transferencia a escalas y modelos reales (Módulo 7)',
      actionLabel: 'Ir al Módulo 7',
      targetModuleId: 'm7',
      detail:
        'Explora el comparador de escala lineal vs. semilogarítmica y los decibeles.',
    };
  }

  const nextUnvisited = ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7', 'm8'].find(
    (m) => !profile.visitedModules.includes(m)
  );
  if (nextUnvisited) {
    return {
      headline: `Continúa tu secuencia en el Módulo ${nextUnvisited.slice(1)}`,
      actionLabel: `Abrir Módulo ${nextUnvisited.slice(1)}`,
      targetModuleId: nextUnvisited,
      detail: 'Tu base conceptual es sólida; avanza al siguiente núcleo del recorrido.',
    };
  }

  return {
    headline: 'Listo para el Desafío Integrador Final (Módulo 8)',
    actionLabel: 'Ir al Módulo 8',
    targetModuleId: 'm8',
    detail: 'Integra definición, gráficos, dominio y comunicación matemática.',
  };
}

/**
 * 6 Test Profiles (Fase 8, Sec. 50 of Prompt Maestro) for Teacher Mode simulation.
 */
export function buildSimulatedProfile(kind: 'A' | 'B' | 'C' | 'D' | 'E' | 'F'): StudentProfile {
  const base = createDefaultProfile(`Simulación Perfil ${kind}`);
  base.diagnosticCompleted = true;
  base.profileLabel = `Perfil ${kind}`;
  const now = new Date().toISOString();

  switch (kind) {
    case 'A':
      return {
        ...base,
        diagnosticScore: 100,
        initialProfileSummary: 'Perfil A: Buenos prerrequisitos. Habilitado para progresión completa y transferencia.',
        visitedModules: ['m0', 'm1', 'm2', 'm3'],
        completedExercises: ['ex-m0-1', 'ex-m0-2', 'ex-m0-3', 'ex-m1-1', 'ex-m2-1'],
        totalCorrect: 5,
        conceptProgress: {
          'c-fundamentos': { conceptId: 'c-fundamentos', status: 'dominado', masteryScore: 95, attemptsCount: 2, correctCount: 2, errorFrequencyByCode: {}, lastUpdated: now },
          'c-definicion': { conceptId: 'c-definicion', status: 'dominado', masteryScore: 90, attemptsCount: 2, correctCount: 2, errorFrequencyByCode: {}, lastUpdated: now },
        },
      };
    case 'B':
      return {
        ...base,
        diagnosticScore: 33,
        missingPrerequisites: ['pre-exp-ext', 'pre-pot-props'],
        initialProfileSummary: 'Perfil B: Presenta dificultades con potenciación y exponentes negativos/fraccionarios.',
        errorHistory: { 'ERR-PRE': 3 },
        totalCorrect: 1,
        totalIncorrect: 3,
        conceptProgress: {
          'c-fundamentos': { conceptId: 'c-fundamentos', status: 'necesita_recuperacion', masteryScore: 30, attemptsCount: 3, correctCount: 0, errorFrequencyByCode: { 'ERR-PRE': 3 }, lastUpdated: now },
        },
        activeRecoveryRoutes: [
          buildRecoveryRoute('c-fundamentos', 'ERR-PRE', 'Dificultades en exponente negativo y fraccionario detectadas en el diagnóstico.'),
        ],
      };
    case 'C':
      return {
        ...base,
        diagnosticScore: 90,
        initialProfileSummary: 'Perfil C: Comprende la definición de logaritmo, pero falla en propiedades (ilusión de linealidad).',
        visitedModules: ['m0', 'm1', 'm2', 'm3', 'm4'],
        completedExercises: ['ex-m0-1', 'ex-m2-1', 'ex-m2-3'],
        errorHistory: { 'ERR-F': 3 },
        totalCorrect: 4,
        totalIncorrect: 3,
        conceptProgress: {
          'c-definicion': { conceptId: 'c-definicion', status: 'dominado', masteryScore: 90, attemptsCount: 2, correctCount: 2, errorFrequencyByCode: {}, lastUpdated: now },
          'c-propiedades': { conceptId: 'c-propiedades', status: 'necesita_recuperacion', masteryScore: 40, attemptsCount: 3, correctCount: 0, errorFrequencyByCode: { 'ERR-F': 3 }, lastUpdated: now },
        },
        activeRecoveryRoutes: [
          buildRecoveryRoute('c-propiedades', 'ERR-F', 'Aplica log(x + y) = log x + log y por ilusión de linealidad.'),
        ],
      };
    case 'D':
      return {
        ...base,
        diagnosticScore: 85,
        initialProfileSummary: 'Perfil D: Resuelve procedimientos numéricos, pero omite justificar por qué su procedimiento es válido.',
        visitedModules: ['m0', 'm1', 'm2', 'm3', 'm4', 'm6'],
        totalCorrect: 2,
        totalIncorrect: 3,
        conceptProgress: {
          'c-definicion': { conceptId: 'c-definicion', status: 'en_proceso', masteryScore: 62, attemptsCount: 3, correctCount: 1, errorFrequencyByCode: {}, lastUpdated: now },
          'c-ecuaciones': { conceptId: 'c-ecuaciones', status: 'en_proceso', masteryScore: 55, attemptsCount: 2, correctCount: 1, errorFrequencyByCode: {}, lastUpdated: now },
        },
      };
    case 'E':
      return {
        ...base,
        diagnosticScore: 85,
        initialProfileSummary: 'Perfil E: Comete errores sistemáticos de dominio (acepta soluciones extrañas y omite b > 0, b ≠ 1).',
        visitedModules: ['m0', 'm1', 'm2', 'm3', 'm4', 'm6'],
        errorHistory: { 'ERR-G': 2, 'ERR-I': 2, 'ERR-C': 1 },
        totalCorrect: 3,
        totalIncorrect: 5,
        conceptProgress: {
          'c-definicion': { conceptId: 'c-definicion', status: 'dominado', masteryScore: 88, attemptsCount: 2, correctCount: 2, errorFrequencyByCode: {}, lastUpdated: now },
          'c-existencia': { conceptId: 'c-existencia', status: 'necesita_recuperacion', masteryScore: 35, attemptsCount: 3, correctCount: 0, errorFrequencyByCode: { 'ERR-C': 1, 'ERR-G': 2 }, lastUpdated: now },
          'c-ecuaciones': { conceptId: 'c-ecuaciones', status: 'necesita_recuperacion', masteryScore: 42, attemptsCount: 3, correctCount: 0, errorFrequencyByCode: { 'ERR-I': 2 }, lastUpdated: now },
        },
        activeRecoveryRoutes: [
          buildRecoveryRoute('c-ecuaciones', 'ERR-I', 'El estudiante comprende la definición, pero presenta dificultades para controlar el dominio y descartar soluciones extrañas.'),
        ],
      };
    case 'F':
      return {
        ...base,
        diagnosticScore: 95,
        initialProfileSummary: 'Perfil F: Responde correctamente en álgebra simbólica, pero presenta dificultades de transferencia a escalas y contextos.',
        visitedModules: ['m0', 'm1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'],
        completedExercises: ['ex-m0-1', 'ex-m2-1', 'ex-m4-1', 'ex-m6-1', 'ex-m6-2'],
        errorHistory: { 'ERR-M': 3 },
        totalCorrect: 6,
        totalIncorrect: 3,
        conceptProgress: {
          'c-ecuaciones': { conceptId: 'c-ecuaciones', status: 'dominado', masteryScore: 92, attemptsCount: 3, correctCount: 3, errorFrequencyByCode: {}, lastUpdated: now },
          'c-aplicaciones': { conceptId: 'c-aplicaciones', status: 'necesita_recuperacion', masteryScore: 38, attemptsCount: 3, correctCount: 0, errorFrequencyByCode: { 'ERR-M': 3 }, lastUpdated: now },
        },
        activeRecoveryRoutes: [
          buildRecoveryRoute('c-aplicaciones', 'ERR-M', 'Interpreta escalas logarítmicas y decibeles con lógica lineal.'),
        ],
      };
  }
}
