import { useEffect, useRef, useState } from 'react';
import { CheckCircle2, HelpCircle, RotateCcw, AlertTriangle, ArrowRight } from 'lucide-react';
import { ERROR_MAP } from '@/src/data/errors/catalog';
import { EXERCISE_MAP } from '@/src/data/exercises/bank';
import { validateExerciseAttempt } from '@/src/services/validation/mathValidator';
import { Exercise, Feedback, LearningAttempt } from '@/src/types';
import { ProvenanceTagText } from '@/src/components/layout/ProvenanceTagText';

interface ExerciseRunnerProps {
  exercise: Exercise;
  onAttemptRecorded: (attempt: LearningAttempt, exercise: Exercise) => void;
  onJumpToModule?: (moduleId: string) => void;
  onSelectExercise?: (exerciseId: string) => void;
}

export function ExerciseRunner({
  exercise,
  onAttemptRecorded,
  onJumpToModule,
  onSelectExercise,
}: ExerciseRunnerProps) {
  const [answer, setAnswer] = useState('');
  const [domainInput, setDomainInput] = useState('');
  const [justificationInput, setJustificationInput] = useState('');
  const [unlockedHintLevel, setUnlockedHintLevel] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState<number[]>([]);
  const [attemptCount, setAttemptCount] = useState<number>(0);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    setAnswer('');
    setDomainInput('');
    setJustificationInput('');
    setUnlockedHintLevel(0);
    setHintsUsed([]);
    setAttemptCount(0);
    setFeedback(null);
    startTimeRef.current = Date.now();
  }, [exercise.id]);

  const handleRevealNextHint = () => {
    if (unlockedHintLevel >= 5) return;
    const next = unlockedHintLevel + 1;
    setUnlockedHintLevel(next);
    if (!hintsUsed.includes(next)) {
      setHintsUsed((prev) => [...prev, next]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = validateExerciseAttempt(exercise, {
      answer,
      domainInput,
      justificationInput,
    });
    const nextAttemptNumber = attemptCount + 1;
    setAttemptCount(nextAttemptNumber);
    setFeedback(res);

    const durationSec = Math.max(
      1,
      Math.round((Date.now() - startTimeRef.current) / 1000)
    );

    const attempt: LearningAttempt = {
      id: `att-${exercise.id}-${Date.now()}`,
      exerciseId: exercise.id,
      moduleId: exercise.moduleId,
      conceptId: exercise.conceptId,
      timestamp: new Date().toISOString(),
      submittedAnswer: answer,
      submittedDomain: domainInput || undefined,
      submittedJustification: justificationInput || undefined,
      isResultCorrect: res.isResultCorrect,
      isDomainValid: res.isDomainValid,
      isJustificationValid: res.isJustificationValid,
      detectedErrorCodes: res.detectedErrorCodes,
      hintsUsed,
      attemptNumber: nextAttemptNumber,
      durationSec,
    };

    onAttemptRecorded(attempt, exercise);
  };

  const reconstructionEx = exercise.reconstructionExerciseId
    ? EXERCISE_MAP[exercise.reconstructionExerciseId]
    : undefined;

  return (
    <div className="rounded-xl border border-[#E3E1DA] bg-white p-5 sm:p-6">
      {/* Unboxed metadata header (Zero-pill discipline) */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-[#526071]">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-[#2D4B73]">{exercise.cognitiveLabel}</span>
          <span aria-hidden="true">·</span>
          <span>Dificultad {exercise.difficulty}/5</span>
          <span aria-hidden="true">·</span>
          <span>Representación {exercise.representation}</span>
        </div>
        <ProvenanceTagText provenance={exercise.provenance} />
      </div>

      <h4 className="font-display text-lg font-semibold leading-snug text-[#1E293B]">
        {exercise.statement}
      </h4>

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        {/* Step 1: Mandatory Domain Gate */}
        {exercise.requiresDomainStep && (
          <div className="rounded-xl border border-[#F0DFC1] bg-[#FDF6EB] p-4">
            <label
              htmlFor={`domain-${exercise.id}`}
              className="block text-sm font-semibold text-[#7C4D0B]"
            >
              Paso 1 obligatorio · Determinar dominio de validez original
            </label>
            <p className="mt-0.5 text-xs text-[#8A5A19]">
              Antes de transformar o despejar, declara las condiciones de existencia (ej: x &gt; 1, (1; +inf), x != 0 y x &gt; -6, o z &gt; 0).
            </p>
            <input
              id={`domain-${exercise.id}`}
              type="text"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              placeholder="Ej: x > 1  o  (1; +inf)"
              className="mt-2 w-full rounded-lg border border-[#E3D1AE] bg-white px-3.5 py-2.5 font-math text-sm text-[#1E293B]"
            />
          </div>
        )}

        {/* Step 2/3: Answer Input (Choice or Free Response) */}
        <div>
          <label
            htmlFor={`answer-${exercise.id}`}
            className="block text-sm font-semibold text-[#1E293B]"
          >
            {exercise.requiresDomainStep
              ? 'Paso 2–4 · Transforma, resuelve y verifica tu respuesta final'
              : 'Tu respuesta'}
          </label>

          {exercise.options ? (
            <div className="mt-2 space-y-2" role="radiogroup" aria-label="Opciones de respuesta">
              {exercise.options.map((opt) => {
                const selected = answer === opt.value;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAnswer(opt.value)}
                    className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left text-sm transition-colors ${
                      selected
                        ? 'border-[#2D4B73] bg-[#EEF5FA] font-medium text-[#1E3A5F]'
                        : 'border-[#E3E1DA] bg-[#FAF9F6] text-[#334155] hover:bg-[#EFECE4]'
                    }`}
                  >
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <input
              id={`answer-${exercise.id}`}
              type="text"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder={exercise.inputPlaceholder ?? 'Ingresa tu respuesta'}
              className="mt-2 w-full rounded-lg border border-[#D4D1C7] bg-[#FAF9F6] px-3.5 py-2.5 font-math text-sm text-[#1E293B]"
            />
          )}
        </div>

        {/* Justification Gate */}
        {exercise.requiresJustification && (
          <div>
            <label
              htmlFor={`just-${exercise.id}`}
              className="block text-sm font-semibold text-[#1E293B]"
            >
              Justificación conceptual (obligatoria)
            </label>
            <p className="mt-0.5 text-xs text-[#526071]">
              {exercise.justificationPrompt ??
                'Explica con tus palabras por qué tu transformación es válida y cómo verificaste la solución.'}
            </p>
            <textarea
              id={`just-${exercise.id}`}
              rows={2}
              value={justificationInput}
              onChange={(e) => setJustificationInput(e.target.value)}
              placeholder="Escribe tu argumento matemático..."
              className="mt-2 w-full rounded-lg border border-[#D4D1C7] bg-[#FAF9F6] px-3.5 py-2 text-sm text-[#1E293B]"
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            type="submit"
            disabled={!answer.trim()}
            className="rounded-lg bg-[#2D4B73] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1E3A5F] disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
          >
            Verificar procedimiento
          </button>

          <button
            type="button"
            onClick={handleRevealNextHint}
            disabled={unlockedHintLevel >= 5}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D4D1C7] bg-[#FAF9F6] px-4 py-2.5 text-sm font-medium text-[#334155] transition-colors hover:bg-[#EFECE4] disabled:opacity-50 whitespace-nowrap"
          >
            <HelpCircle className="h-4 w-4 text-[#2D4B73]" />
            {unlockedHintLevel === 0
              ? 'Pedir Pista 1'
              : unlockedHintLevel < 5
              ? `Siguiente pista (${unlockedHintLevel + 1}/5)`
              : 'Todas las pistas abiertas'}
          </button>

          {feedback && (
            <button
              type="button"
              onClick={() => {
                setAnswer('');
                setDomainInput('');
                setJustificationInput('');
                setFeedback(null);
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#E3E1DA] bg-white px-3.5 py-2.5 text-xs font-medium text-[#526071] hover:bg-[#FAF9F6] whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Limpiar intento
            </button>
          )}
        </div>
      </form>

      {/* 5-Level Progressive Hint Ladder */}
      {unlockedHintLevel > 0 && (
        <div className="mt-5 space-y-2.5 rounded-xl border border-[#E3E1DA] bg-[#FAF9F6] p-4">
          <p className="text-xs font-semibold text-[#2D4B73]">
            Sistema de pistas progresivas (nivel {unlockedHintLevel} de 5)
          </p>
          {exercise.hints
            .filter((h) => h.level <= unlockedHintLevel)
            .map((hint) => (
              <div
                key={hint.level}
                className="rounded-lg border border-[#E3E1DA] bg-white p-3 text-sm text-[#334155]"
              >
                <p className="text-xs font-semibold text-[#1E293B]">{hint.label}</p>
                <p className="mt-1 leading-relaxed">{hint.content}</p>
              </div>
            ))}

          {unlockedHintLevel === 5 && (
            <div className="rounded-lg border border-[#DCE8F5] bg-[#EEF5FA] p-3 text-xs text-[#1E3A5F]">
              <p className="font-semibold">
                Actividad de reconstrucción obligatoria:
              </p>
              <p className="mt-1">
                «Ahora intenta resolver un ejercicio equivalente sin mirar la solución.»
              </p>
              {reconstructionEx && onSelectExercise && (
                <button
                  type="button"
                  onClick={() => onSelectExercise(reconstructionEx.id)}
                  className="mt-2 inline-flex items-center gap-1 font-semibold text-[#2D4B73] underline hover:text-[#1E3A5F]"
                >
                  Ir al ejercicio equivalente: {reconstructionEx.statement.slice(0, 58)}...
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* 6-Part Smart Feedback Panel */}
      {feedback && (
        <div
          className={`mt-5 rounded-xl border p-5 ${
            feedback.isValid
              ? 'border-[#B9DEC9] bg-[#EFF7F2]'
              : 'border-[#E8C5BF] bg-[#FDF3F1]'
          }`}
          aria-live="polite"
        >
          <div className="flex items-start gap-2.5">
            {feedback.isValid ? (
              <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#2D7A5E]" />
            ) : (
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-[#C0564B]" />
            )}
            <div className="space-y-2 text-sm text-[#1E293B]">
              <p className="font-semibold">
                {feedback.isValid
                  ? 'Validación completa aprobada'
                  : feedback.isResultCorrect
                  ? 'Resultado numérico correcto, pero procedimiento incompleto'
                  : 'Diagnóstico del intento: revisemos el procedimiento'}
              </p>

              <dl className="grid grid-cols-1 gap-2 pt-1 text-xs leading-relaxed sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-[#475569]">1. ¿Qué hiciste?</dt>
                  <dd className="text-[#1E293B]">{feedback.summaryWhatYouDid}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#475569]">2. ¿Qué está bien?</dt>
                  <dd className="text-[#1E293B]">{feedback.whatIsRight}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#475569]">3. ¿Dónde aparece el problema?</dt>
                  <dd className="text-[#1E293B]">{feedback.whereProblemAppears}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#475569]">4. ¿Por qué ocurre?</dt>
                  <dd className="text-[#1E293B]">{feedback.whyItHappens}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#475569]">5. ¿Qué deberías revisar?</dt>
                  <dd className="text-[#1E293B]">{feedback.whatToReview}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#475569]">6. Próximo paso</dt>
                  <dd className="text-[#1E293B]">{feedback.retryPrompt}</dd>
                </div>
              </dl>

              {/* Step-by-step full solution shown ONLY once validated */}
              {feedback.isValid && (
                <div className="mt-3 rounded-lg border border-[#B9DEC9] bg-white p-3.5">
                  <p className="text-xs font-semibold text-[#2D7A5E]">
                    Desarrollo verificado (criterio: {exercise.evaluationCriterion})
                  </p>
                  <ol className="mt-2 space-y-1.5 text-xs text-[#334155]">
                    {exercise.solution.steps.map((st, idx) => (
                      <li key={idx}>
                        <span className="font-semibold">{st.label}:</span>{' '}
                        <span className="font-math text-[#1E293B]">{st.expression}</span>{' '}
                        <span className="text-[#64748B]">({st.justification})</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Recovery link when an error pattern is detected */}
              {!feedback.isValid &&
                feedback.detectedErrorCodes.length > 0 &&
                onJumpToModule && (
                  <div className="pt-2">
                    {feedback.detectedErrorCodes.map((code) => {
                      const err = ERROR_MAP[code];
                      if (!err) return null;
                      return (
                        <div
                          key={code}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[#E8C5BF] bg-white px-3 py-2 text-xs"
                        >
                          <span>
                            <strong className="text-[#C0564B]">{err.code}</strong> · {err.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => onJumpToModule(err.recoveryModuleId)}
                            className="font-semibold text-[#2D4B73] underline hover:text-[#1E3A5F]"
                          >
                            Ir a ruta de recuperación ({err.recoveryModuleId.toUpperCase()})
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
