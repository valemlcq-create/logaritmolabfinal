import { ERROR_MAP } from '@/src/data/errors/catalog';
import { Exercise, Feedback } from '@/src/types';
import {
  normalizeIntervalString,
  parseMathNumber,
  parseSetValues,
} from '@/src/utils/mathFormat';

export interface SubmissionPayload {
  answer: string;
  domainInput?: string;
  justificationInput?: string;
}

function checkDomainExpression(domainInput: string, exercise: Exercise): boolean {
  const norm = normalizeIntervalString(domainInput);
  if (!norm) return false;

  const expected = exercise.validationRules.expectedDomain
    ? normalizeIntervalString(exercise.validationRules.expectedDomain)
    : '';

  if (expected && norm === expected) return true;

  // Flexible domain recognition for common representations
  if (exercise.id === 'ex-m5-2') {
    return (
      norm.includes('>-3') ||
      norm.includes('(-3;+inf)') ||
      norm.includes('(-3;inf)')
    );
  }
  if (exercise.id === 'ex-m6-1') {
    return norm.includes('z>0') || norm.includes('3^x>0') || norm === 'r';
  }
  if (exercise.id === 'ex-m6-2') {
    return (
      norm.includes('x>1') ||
      norm.includes('(1;+inf)') ||
      norm.includes('(1;inf)')
    );
  }
  if (exercise.id === 'ex-m6-3') {
    return (
      (norm.includes('!=0') || norm.includes('≠0')) &&
      (norm.includes('>-6') || norm.includes('(-6;0)u(0;+inf)'))
    );
  }
  if (exercise.id === 'ex-m6-4') {
    return norm.includes('x>0') || norm.includes('(0;+inf)') || norm.includes('(0;inf)');
  }
  if (exercise.id === 'ex-m6-5') {
    return (
      (norm.includes('x>0') && (norm.includes('!=1') || norm.includes('≠1'))) ||
      norm.includes('(0;1)u(1;+inf)')
    );
  }
  if (exercise.id === 'ex-m6-6') {
    return norm.includes('x>1') || norm.includes('(1;+inf)') || norm.includes('(1;inf)');
  }
  if (exercise.id === 'ex-m6-7') {
    return norm.includes('x>3') || norm.includes('(3;+inf)') || norm.includes('(3;inf)');
  }

  return norm.length >= 3;
}

function checkJustificationQuality(text: string): boolean {
  const clean = text.trim();
  // Require substantive mathematical explanation (at least 12 chars and 2 words)
  const words = clean.split(/\s+/).filter(Boolean);
  return clean.length >= 12 && words.length >= 3;
}

export function validateExerciseAttempt(
  exercise: Exercise,
  payload: SubmissionPayload
): Feedback {
  const rawAnswer = payload.answer.trim();
  const domainRaw = (payload.domainInput ?? '').trim();
  const justRaw = (payload.justificationInput ?? '').trim();

  const rules = exercise.validationRules;
  const detectedErrorCodes: string[] = [];
  let diagnosticDetail = '';

  // 1. Check result correctness
  let isResultCorrect = false;
  if (rules.kind === 'numeric') {
    const submittedNum = parseMathNumber(rawAnswer);
    const tol = rules.numericTolerance ?? 0.001;
    if (submittedNum !== null) {
      isResultCorrect = rules.expectedValues.some((exp) => {
        const expNum = parseMathNumber(exp);
        return expNum !== null && Math.abs(submittedNum - expNum) <= tol;
      });
    }
  } else if (rules.kind === 'choice') {
    isResultCorrect = rules.expectedValues.includes(rawAnswer);
  } else if (rules.kind === 'interval') {
    const normSub = normalizeIntervalString(rawAnswer);
    const candidates = [
      ...rules.expectedValues,
      ...(rules.acceptedEquivalents ?? []),
    ].map(normalizeIntervalString);
    isResultCorrect = candidates.includes(normSub);
  } else if (rules.kind === 'set') {
    const subSet = parseSetValues(rawAnswer).sort((a, b) => a - b);
    const expSet = rules.expectedValues
      .map((v) => parseMathNumber(v))
      .filter((v): v is number => v !== null)
      .sort((a, b) => a - b);
    if (subSet.length === expSet.length && expSet.length > 0) {
      isResultCorrect = subSet.every((v, i) => Math.abs(v - expSet[i]) <= 0.005);
    }
  }

  // 2. Run error detectors on answer
  for (const det of rules.errorDetectors) {
    if (det.matchType === 'exact_value' || det.matchType === 'unflipped_inequality' || det.matchType === 'missing_domain_intersection') {
      const normSub = normalizeIntervalString(rawAnswer);
      const match = det.triggerValues.some((t) => {
        if (rules.kind === 'numeric') {
          const tn = parseMathNumber(t);
          const sn = parseMathNumber(rawAnswer);
          return tn !== null && sn !== null && Math.abs(tn - sn) <= 0.005;
        }
        return normalizeIntervalString(t) === normSub || t === rawAnswer;
      });
      if (match) {
        if (!detectedErrorCodes.includes(det.errorCode)) {
          detectedErrorCodes.push(det.errorCode);
        }
        diagnosticDetail = det.diagnosticNote;
      }
    } else if (det.matchType === 'includes_extraneous') {
      const subNums = parseSetValues(rawAnswer);
      const hasExt = det.triggerValues.some((t) => {
        const tn = parseMathNumber(t);
        return tn !== null && subNums.some((s) => Math.abs(s - tn) <= 0.005);
      });
      if (hasExt) {
        if (!detectedErrorCodes.includes(det.errorCode)) {
          detectedErrorCodes.push(det.errorCode);
        }
        diagnosticDetail = det.diagnosticNote;
      }
    } else if (det.matchType === 'missing_negative_solution') {
      const subNums = parseSetValues(rawAnswer);
      const onlyThree =
        subNums.length === 1 && Math.abs(subNums[0] - 3) <= 0.005;
      if (onlyThree) {
        if (!detectedErrorCodes.includes(det.errorCode)) {
          detectedErrorCodes.push(det.errorCode);
        }
        diagnosticDetail = det.diagnosticNote;
      }
    }
  }

  // Fallback error mapping if result wrong and no specific detector fired
  if (!isResultCorrect && detectedErrorCodes.length === 0 && exercise.commonErrors.length > 0) {
    detectedErrorCodes.push(exercise.commonErrors[0]);
  }

  // 3. Domain control gate (transversal behavior, Sec. 38)
  const isDomainValid = !exercise.requiresDomainStep
    ? true
    : checkDomainExpression(domainRaw, exercise);

  if (exercise.requiresDomainStep && !isDomainValid) {
    if (!detectedErrorCodes.includes('ERR-G')) {
      detectedErrorCodes.push('ERR-G');
    }
  }

  // 4. Justification gate (Sec. 23: never accept numeric result alone if justification required)
  const isJustificationValid = !exercise.requiresJustification
    ? true
    : checkJustificationQuality(justRaw);

  const isProcedureValid = isDomainValid && !detectedErrorCodes.includes('ERR-I') && !detectedErrorCodes.includes('ERR-J');
  const isValid = isResultCorrect && isDomainValid && isJustificationValid;

  const primaryErr = detectedErrorCodes[0] ? ERROR_MAP[detectedErrorCodes[0]] : undefined;

  // Build 6-part Smart Feedback (Sec. 15 of Prompt Maestro)
  if (isValid) {
    return {
      isValid: true,
      isResultCorrect: true,
      isDomainValid: true,
      isProcedureValid: true,
      isJustificationValid: true,
      summaryWhatYouDid: `Respondiste ${rawAnswer}${exercise.requiresDomainStep ? ` declarando el dominio (${domainRaw})` : ''}${exercise.requiresJustification ? ' y fundamentaste tu procedimiento' : ''}.`,
      whatIsRight: 'Tanto el resultado como el control de condiciones de validez y tu explicación son coherentes.',
      whereProblemAppears: 'Sin errores detectados.',
      whyItHappens: `Verificaste correctamente la equivalencia y las restricciones de ${exercise.solution.domainCondition ?? 'existencia'}.`,
      whatToReview: `Comprueba la verificación final: ${exercise.solution.verificationCheck}`,
      retryPrompt: 'Puedes avanzar al siguiente desafío o explorar otra representación.',
      detectedErrorCodes: [],
      suggestedHintLevel: 0,
    };
  }

  if (isResultCorrect && (!isDomainValid || !isJustificationValid)) {
    const missingParts: string[] = [];
    if (!isDomainValid) missingParts.push('declarar correctamente el dominio original antes de transformar');
    if (!isJustificationValid) missingParts.push('explicar con palabras por qué tu transformación o solución es válida');

    return {
      isValid: false,
      isResultCorrect: true,
      isDomainValid,
      isProcedureValid: isDomainValid,
      isJustificationValid,
      summaryWhatYouDid: `Indicaste el resultado ${rawAnswer}, pero falta completar: ${missingParts.join(' y ')}.`,
      whatIsRight: 'Tu valor numérico o conjunto solución coincide con el esperado.',
      whereProblemAppears: !isDomainValid
        ? 'Falta el paso previo obligatorio de control del dominio.'
        : 'La justificación escrita es demasiado breve o incompleta.',
      whyItHappens:
        'Un resultado numérico correcto sin controlar el dominio ni justificar el procedimiento no garantiza validez matemática.',
      whatToReview: !isDomainValid
        ? `Escribe la condición de dominio esperada (p. ej. ${exercise.solution.domainCondition ?? 'argumento > 0'}).`
        : exercise.justificationPrompt ?? 'Explica qué propiedad o condición justifica tu respuesta.',
      retryPrompt: 'Completa el campo pendiente y vuelve a validar.',
      detectedErrorCodes: !isDomainValid ? ['ERR-G'] : [],
      suggestedHintLevel: 2,
    };
  }

  return {
    isValid: false,
    isResultCorrect: false,
    isDomainValid,
    isProcedureValid,
    isJustificationValid,
    summaryWhatYouDid: `Ingresaste «${rawAnswer || '(vacío)'}»${domainRaw ? ` con dominio «${domainRaw}»` : ''}.`,
    whatIsRight: isDomainValid && exercise.requiresDomainStep
      ? 'El control inicial del dominio va bien encaminado.'
      : 'Intentaste abordar el problema; revisemos paso a paso dónde se desvió la transformación.',
    whereProblemAppears:
      diagnosticDetail ||
      primaryErr?.identification ||
      'La respuesta ingresada no coincide con la equivalencia o el conjunto solución en ℝ.',
    whyItHappens:
      primaryErr?.explanation ||
      'Es probable que se haya aplicado una regla sin respetar la definición b^c = a o las condiciones de existencia.',
    whatToReview:
      primaryErr?.hintPrompt ||
      exercise.hints[0]?.content ||
      'Vuelve a traducir la expresión logarítmica a forma exponencial.',
    retryPrompt: 'Usa la Pista 1 (pregunta orientadora) si necesitas ayuda e inténtalo nuevamente.',
    detectedErrorCodes,
    suggestedHintLevel: 1,
  };
}

/**
 * Deterministic validation gate for AI-generated exercises (Sec. 20-21):
 * Separates generation -> validation -> presentation.
 */
export interface GeneratedExerciseCandidate {
  statement: string;
  base: number;
  argument: number;
  expectedNumericAnswer: number;
  domainCondition: string;
  explanation: string;
}

export function validateGeneratedExercise(
  candidate: GeneratedExerciseCandidate
): { valid: boolean; reason?: string } {
  if (!candidate.statement || candidate.statement.trim().length < 10) {
    return { valid: false, reason: 'Enunciado insuficiente.' };
  }
  if (!Number.isFinite(candidate.base) || candidate.base <= 0 || candidate.base === 1) {
    return { valid: false, reason: 'Base inválida: debe cumplir b > 0 y b ≠ 1.' };
  }
  if (!Number.isFinite(candidate.argument) || candidate.argument <= 0) {
    return { valid: false, reason: 'Argumento inválido: debe cumplir a > 0.' };
  }
  if (!Number.isFinite(candidate.expectedNumericAnswer)) {
    return { valid: false, reason: 'Respuesta numérica no finita.' };
  }
  const recomputed = Math.pow(candidate.base, candidate.expectedNumericAnswer);
  if (Math.abs(recomputed - candidate.argument) > 0.02 * Math.max(1, candidate.argument)) {
    return {
      valid: false,
      reason: `Contradicción matemática: ${candidate.base}^${candidate.expectedNumericAnswer} = ${recomputed} ≠ ${candidate.argument}.`,
    };
  }
  return { valid: true };
}
