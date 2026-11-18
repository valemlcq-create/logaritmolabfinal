import { useState } from 'react';
import { EXERCISE_BANK } from '@/src/data/exercises/bank';
import { PREREQUISITES } from '@/src/data/disciplinary/cerebro';
import { ExerciseRunner } from '@/src/components/exercises/ExerciseRunner';
import { Exercise, LearningAttempt, StudentProfile } from '@/src/types';
import { CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';

interface DiagnosticPageProps {
  profile: StudentProfile;
  onAttemptRecorded: (attempt: LearningAttempt, exercise: Exercise) => void;
  onCompleteDiagnostic: (score: number, missingPrereqs: string[], summary: string) => void;
  onJumpToModule: (moduleId: string) => void;
}

export function DiagnosticPage({
  profile,
  onAttemptRecorded,
  onCompleteDiagnostic,
  onJumpToModule,
}: DiagnosticPageProps) {
  const diagExercises = EXERCISE_BANK.filter((e) => e.moduleId === 'm0');
  const [activeIdx, setActiveIdx] = useState(0);
  const [resultsByEx, setResultsByEx] = useState<Record<string, boolean>>({});

  const currentExercise = diagExercises[activeIdx];

  const handleRecord = (attempt: LearningAttempt, ex: Exercise) => {
    onAttemptRecorded(attempt, ex);
    const passed = attempt.isResultCorrect && attempt.isDomainValid && attempt.isJustificationValid;
    setResultsByEx((prev) => ({ ...prev, [ex.id]: passed }));
  };

  const handleFinalizeDiagnostic = () => {
    const passedCount = diagExercises.filter(
      (ex) => resultsByEx[ex.id] || profile.completedExercises.includes(ex.id)
    ).length;
    const score = Math.round((passedCount / diagExercises.length) * 100);
    const missing: string[] = [];

    if (!(resultsByEx['ex-m0-1'] || profile.completedExercises.includes('ex-m0-1'))) {
      missing.push('pre-exp-ext');
    }
    if (!(resultsByEx['ex-m0-2'] || profile.completedExercises.includes('ex-m0-2'))) {
      missing.push('pre-pot-props');
    }
    if (!(resultsByEx['ex-m0-3'] || profile.completedExercises.includes('ex-m0-3'))) {
      missing.push('pre-crecimiento');
    }

    const summary =
      missing.length === 0
        ? 'Prerrequisitos consolidados en potenciación, radicación y crecimiento multiplicativo. Listo para avanzar al Módulo 1.'
        : `Se detectaron ${missing.length} prerrequisito(s) a reforzar antes o en paralelo al Módulo 1 (${missing
            .map((id) => PREREQUISITES.find((p) => p.id === id)?.label ?? id)
            .join('; ')}).`;

    onCompleteDiagnostic(score, missing, summary);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <div className="rounded-2xl border border-[#E3E1DA] bg-white p-6">
        <p className="text-xs font-medium text-[#2D4B73]">
          Módulo 0 · Evaluación diagnóstica inicial
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-[#1E293B] sm:text-3xl">
          Diagnóstico de prerrequisitos
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#475569]">
          Antes de introducir el logaritmo, comprobemos cómo operas con exponentes nulo, negativo y fraccionario, jerarquía de signos y modelos de crecimiento. No es una prueba punitiva: sirve para armar tu ruta de aprendizaje.
        </p>

        {/* Stepper across the 3 diagnostic tasks */}
        <div className="mt-5 flex flex-wrap gap-2">
          {diagExercises.map((ex, i) => {
            const done = resultsByEx[ex.id] || profile.completedExercises.includes(ex.id);
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => setActiveIdx(i)}
                className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors ${
                  activeIdx === i
                    ? 'border-[#2D4B73] bg-[#2D4B73] text-white'
                    : done
                    ? 'border-[#B9DEC9] bg-[#EFF7F2] text-[#2D7A5E]'
                    : 'border-[#E3E1DA] bg-[#FAF9F6] text-[#334155]'
                }`}
              >
                {done && <CheckCircle2 className="h-3.5 w-3.5" />}
                Actividad {i + 1} de {diagExercises.length}
              </button>
            );
          })}
        </div>
      </div>

      {/* Prerequisite quick reference */}
      <div className="rounded-xl border border-[#DCE8F5] bg-[#EEF5FA] p-4 text-xs leading-relaxed text-[#1E3A5F]">
        <strong>Recordatorio clave del Módulo 0:</strong> Cada extensión del exponente conserva{' '}
        <span className="font-math">b^m · b^n = b^(m+n)</span>. Por eso{' '}
        <span className="font-math">2^(−3) = 1/8</span> (invierte la base, no vuelve negativo el número),{' '}
        <span className="font-math">16^(3/4) = (⁴√16)^3 = 8</span>, y{' '}
        <span className="font-math">−2^4 = −16</span> mientras <span className="font-math">(−2)^4 = 16</span>.
      </div>

      {currentExercise && (
        <ExerciseRunner
          exercise={currentExercise}
          onAttemptRecorded={handleRecord}
          onJumpToModule={onJumpToModule}
          onSelectExercise={(id) => {
            const idx = diagExercises.findIndex((e) => e.id === id);
            if (idx >= 0) setActiveIdx(idx);
          }}
        />
      )}

      {/* Diagnostic Closure */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E3E1DA] bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold text-[#1E293B]">
            {profile.diagnosticCompleted
              ? `Perfil inicial construido (${profile.diagnosticScore}%)`
              : '¿Completaste las 3 actividades diagnósticas?'}
          </h2>
          <p className="mt-1 text-xs text-[#526071]">
            {profile.diagnosticCompleted
              ? profile.initialProfileSummary
              : 'Genera tu perfil inicial para desbloquear recomendaciones adaptadas.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            type="button"
            onClick={handleFinalizeDiagnostic}
            className="rounded-lg bg-[#2D7A5E] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#23614A] whitespace-nowrap"
          >
            {profile.diagnosticCompleted ? 'Actualizar perfil diagnóstico' : 'Construir mi perfil inicial'}
          </button>
          {profile.diagnosticCompleted && (
            <button
              type="button"
              onClick={() => onJumpToModule(profile.missingPrerequisites.length > 0 ? 'm0' : 'm1')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2D4B73] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1E3A5F] whitespace-nowrap"
            >
              {profile.missingPrerequisites.length > 0
                ? 'Revisar refuerzo de potencias'
                : 'Continuar al Módulo 1'}
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {profile.diagnosticCompleted && profile.missingPrerequisites.length > 0 && (
        <div className="rounded-xl border border-[#F0DFC1] bg-[#FDF6EB] p-4 text-xs text-[#7C4D0B]">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p className="font-semibold">Prerrequisitos sugeridos para recuperar:</p>
              <ul className="mt-1 list-disc pl-4 space-y-1">
                {profile.missingPrerequisites.map((pid) => {
                  const p = PREREQUISITES.find((item) => item.id === pid);
                  return (
                    <li key={pid}>
                      <strong>{p?.label}:</strong> {p?.description}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
