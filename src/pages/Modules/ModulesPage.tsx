import { useEffect, useState } from 'react';
import { ASSESSMENTS } from '@/src/data/assessments/assessments';
import { CONCEPTS } from '@/src/data/disciplinary/cerebro';
import { EXERCISE_BANK } from '@/src/data/exercises/bank';
import { LEARNING_MODULES } from '@/src/data/modules/modules';
import { ProvenanceTagText } from '@/src/components/layout/ProvenanceTagText';
import { BisectionVideoExplorer } from '@/src/components/learning/BisectionVideoExplorer';
import { DomainConditionsExplorer } from '@/src/components/learning/DomainConditionsExplorer';
import { MultipleRepresentationsConverter } from '@/src/components/learning/MultipleRepresentationsConverter';
import { PropertiesAndFallaciesLab } from '@/src/components/learning/PropertiesAndFallaciesLab';
import { InteractiveLogGraphLab } from '@/src/components/visualizations/InteractiveLogGraphLab';
import { ScaleComparator } from '@/src/components/visualizations/ScaleComparator';
import { ExerciseRunner } from '@/src/components/exercises/ExerciseRunner';
import { MetacognitionPanel } from '@/src/components/feedback/MetacognitionPanel';
import {
  Exercise,
  LearningAttempt,
  MetacognitionEntry,
  SelfAssessmentEntry,
  StudentProfile,
} from '@/src/types';
import { CheckCircle2, ArrowRight } from 'lucide-react';

interface ModulesPageProps {
  activeModuleId: string;
  onSelectModule: (moduleId: string) => void;
  profile: StudentProfile;
  onAttemptRecorded: (attempt: LearningAttempt, exercise: Exercise) => void;
  onSaveMetacognition: (entry: MetacognitionEntry) => void;
  onSaveSelfAssessment: (entry: SelfAssessmentEntry) => void;
}

export function ModulesPage({
  activeModuleId,
  onSelectModule,
  profile,
  onAttemptRecorded,
  onSaveMetacognition,
  onSaveSelfAssessment,
}: ModulesPageProps) {
  const activeModule =
    LEARNING_MODULES.find((m) => m.id === activeModuleId) ?? LEARNING_MODULES[1];

  const moduleConcepts = CONCEPTS.filter((c) =>
    activeModule.conceptIds.includes(c.id)
  );
  const moduleExercises = EXERCISE_BANK.filter(
    (e) => e.moduleId === activeModule.id
  );

  const [selectedExId, setSelectedExId] = useState<string>(
    moduleExercises[0]?.id ?? ''
  );

  useEffect(() => {
    const list = EXERCISE_BANK.filter((e) => e.moduleId === activeModule.id);
    setSelectedExId(list[0]?.id ?? '');
  }, [activeModule.id]);

  const currentExercise =
    moduleExercises.find((e) => e.id === selectedExId) ?? moduleExercises[0];

  const nextModule = LEARNING_MODULES.find(
    (m) => m.order === activeModule.order + 1
  );

  const integrativeAssessment = ASSESSMENTS.find((a) => a.type === 'integradora');

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      {/* Module Selector Stepper */}
      <div className="rounded-2xl border border-[#E3E1DA] bg-white p-4">
        <div className="mb-2 flex items-center justify-between text-xs text-[#526071]">
          <span className="font-semibold text-[#1E293B]">
            Recorrido por módulos (respetando dependencias conceptuales)
          </span>
          <span className="font-math tabular-nums">
            Módulo {activeModule.order} de 8
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {LEARNING_MODULES.map((mod) => {
            const isActive = mod.id === activeModule.id;
            const visited = profile.visitedModules.includes(mod.id);
            const hasRecovery = profile.activeRecoveryRoutes.some((r) =>
              mod.conceptIds.includes(r.targetConceptId)
            );
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => onSelectModule(mod.id)}
                className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'border-[#2D4B73] bg-[#2D4B73] text-white'
                    : hasRecovery
                    ? 'border-[#E8C5BF] bg-[#FDF3F1] text-[#C0564B]'
                    : visited
                    ? 'border-[#B9DEC9] bg-[#EFF7F2] text-[#2D7A5E]'
                    : 'border-[#E3E1DA] bg-[#FAF9F6] text-[#334155] hover:bg-[#EFECE4]'
                }`}
              >
                M{mod.order}: {mod.title.split('—')[1]?.trim() ?? mod.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Module Header */}
      <header className="rounded-2xl border border-[#DCE8F5] bg-[#EEF5FA] p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-[#2D4B73]">
          <span className="font-semibold">Núcleos del Cerebro: {activeModule.targetNuclei.join(', ')}</span>
          <span aria-hidden="true">·</span>
          <span>Tiempo estimado: {activeModule.estimatedMinutes} min</span>
        </div>
        <h1 className="mt-2 font-display text-2xl font-bold text-[#1E293B] sm:text-3xl">
          {activeModule.title}
        </h1>
        <p className="mt-1 text-sm font-medium text-[#2D4B73]">{activeModule.subtitle}</p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[#334155]">
          {activeModule.objective}
        </p>
        <p className="mt-3 rounded-lg border border-[#C9DCF0] bg-white px-4 py-2.5 text-xs text-[#1E3A5F]">
          <strong>Pregunta guía:</strong> {activeModule.keyQuestion}
        </p>
      </header>

      {/* Active Recovery Alert if applicable */}
      {profile.activeRecoveryRoutes
        .filter((r) => activeModule.conceptIds.includes(r.targetConceptId))
        .map((route) => (
          <div
            key={route.id}
            className="rounded-xl border border-[#F0DFC1] bg-[#FDF6EB] p-4 text-xs text-[#7C4D0B]"
          >
            <p className="font-semibold">Ruta de recuperación activa en este módulo</p>
            <p className="mt-1">{route.reason}</p>
          </div>
        ))}

      {/* Structured Disciplinary Concepts */}
      <section className="space-y-5" aria-label="Contenido disciplinar">
        {moduleConcepts.map((concept) => (
          <article
            key={concept.id}
            className="rounded-2xl border border-[#E3E1DA] bg-white p-5 sm:p-6 space-y-4"
          >
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="font-display text-xl font-semibold text-[#1E293B]">
                  {concept.title}
                </h2>
                <p className="mt-1 text-sm text-[#475569]">{concept.summary}</p>
              </div>
              <div className="sm:text-right shrink-0">
                <ProvenanceTagText provenance={concept.provenance} />
              </div>
            </div>

            {concept.provenanceNote && (
              <p className="text-xs leading-relaxed text-[#526071]">
                {concept.provenanceNote}
              </p>
            )}

            {concept.formalFormula && (
              <div className="rounded-xl border border-[#E3E1DA] bg-[#FAF9F6] px-4 py-3 font-math text-sm font-semibold text-[#1E293B]">
                {concept.formalFormula}
              </div>
            )}

            <ul className="list-disc space-y-2 pl-5 text-sm leading-relaxed text-[#334155]">
              {concept.explanation.map((line, i) => (
                <li key={i}>{line}</li>
              ))}
            </ul>

            {concept.examples.length > 0 && (
              <div className="overflow-x-auto rounded-xl border border-[#E3E1DA]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF9F6] text-[#475569]">
                    <tr>
                      <th className="px-3 py-2 font-semibold">Ejemplo</th>
                      <th className="px-3 py-2 font-semibold">Desarrollo</th>
                      <th className="px-3 py-2 font-semibold">Resultado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EFECE4] text-[#1E293B]">
                    {concept.examples.map((ex, i) => (
                      <tr key={i}>
                        <td className="px-3 py-2 font-math font-medium">{ex.expression}</td>
                        <td className="px-3 py-2 font-math text-[#475569]">{ex.development}</td>
                        <td className="px-3 py-2 font-math font-semibold text-[#2D7A5E]">{ex.result}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {concept.counterexamples && concept.counterexamples.length > 0 && (
              <div className="rounded-xl border border-[#E8C5BF] bg-[#FDF3F1] p-4 space-y-2">
                <p className="text-xs font-semibold text-[#C0564B]">
                  Contraejemplos y errores frecuentes a evitar
                </p>
                {concept.counterexamples.map((ce, i) => (
                  <div key={i} className="text-xs text-[#334155]">
                    <span className="font-math font-semibold text-[#C0564B]">
                      ✕ {ce.falseClaim}
                    </span>{' '}
                    — Contraejemplo:{' '}
                    <span className="font-math">{ce.counterexample}</span>.{' '}
                    <span className="text-[#1E293B]">{ce.correction}</span>
                  </div>
                ))}
              </div>
            )}
          </article>
        ))}
      </section>

      {/* Interactive Micro-Experience per Module */}
      {activeModule.id === 'm1' && <BisectionVideoExplorer />}
      {activeModule.id === 'm2' && <MultipleRepresentationsConverter />}
      {activeModule.id === 'm3' && <DomainConditionsExplorer />}
      {activeModule.id === 'm4' && <PropertiesAndFallaciesLab />}
      {activeModule.id === 'm5' && <InteractiveLogGraphLab />}

      {activeModule.id === 'm6' && (
        <section className="rounded-2xl border border-[#F0DFC1] bg-[#FDF6EB] p-5 sm:p-6">
          <h3 className="font-display text-lg font-semibold text-[#7C4D0B]">
            Secuencia obligatoria de resolución algebraica (Sección 11 y 38)
          </h3>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-4">
            {[
              { step: '1. Dominio', desc: 'Todos los argumentos > 0; base > 0 y ≠ 1.' },
              { step: '2. Transformar', desc: 'Definición, inyectividad, L1–L5 (log(x²)=2·log|x|).' },
              { step: '3. Resolver', desc: 'Ecuación o inecuación algebraica (invertir si 0<b<1).' },
              { step: '4. Verificar', desc: 'Descartar extrañas e intersecar con el dominio.' },
            ].map((item) => (
              <div key={item.step} className="rounded-xl border border-[#E3D1AE] bg-white p-3.5">
                <p className="text-xs font-bold text-[#7C4D0B]">{item.step}</p>
                <p className="mt-1 text-xs text-[#475569]">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeModule.id === 'm7' && (
        <div className="space-y-6">
          <ScaleComparator />
          <section className="rounded-2xl border border-[#E3E1DA] bg-white p-5 sm:p-6">
            <h3 className="font-display text-lg font-semibold text-[#1E293B]">
              Mapa de relaciones interdisciplinarias (Núcleo 12)
            </h3>
            <ProvenanceTagText
              provenance="COMPLEMENTO"
              note="Distingue el foco en Comunicación Social (fuente) de las ampliaciones interdisciplinarias."
            />
            <div className="mt-4 overflow-x-auto rounded-xl border border-[#E3E1DA]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F6] text-[#475569]">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Área</th>
                    <th className="px-3 py-2 font-semibold">Modelo</th>
                    <th className="px-3 py-2 font-semibold">Pregunta que responde el logaritmo</th>
                    <th className="px-3 py-2 font-semibold">Origen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE4] text-[#334155]">
                  <tr>
                    <td className="px-3 py-2 font-medium text-[#1E293B]">Comunicación y radio</td>
                    <td className="px-3 py-2 font-math">N₀·b^t · 10·log(I/I₀)</td>
                    <td className="px-3 py-2">Tiempo de alcance, duplicación y dB ganados</td>
                    <td className="px-3 py-2 text-[#2D4B73]">Fuente / Corrección</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-[#1E293B]">Química (pH)</td>
                    <td className="px-3 py-2 font-math">pH = −log[H⁺]</td>
                    <td className="px-3 py-2">Cuántas veces más ácida es una solución</td>
                    <td className="px-3 py-2 text-[#2D7A5E]">Corrección notación</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-[#1E293B]">Semivida y Carbono-14</td>
                    <td className="px-3 py-2 font-math">N₀·(1/2)^(t/T)</td>
                    <td className="px-3 py-2">Antigüedad de muestra o degradación (T ≈ 5.730 años)</td>
                    <td className="px-3 py-2 text-[#6B4E8A]">Complemento</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-[#1E293B]">Economía (interés)</td>
                    <td className="px-3 py-2 font-math">C₀·(1 + i)^n</td>
                    <td className="px-3 py-2">Períodos para duplicar capital (Regla del 70)</td>
                    <td className="px-3 py-2 text-[#6B4E8A]">Complemento</td>
                  </tr>
                  <tr>
                    <td className="px-3 py-2 font-medium text-[#1E293B]">Informática y música</td>
                    <td className="px-3 py-2 font-math">⌈log₂ N⌉ bits · 12·log₂(f₂/f₁)</td>
                    <td className="px-3 py-2">Bits/pasos de búsqueda y semitonos entre frecuencias</td>
                    <td className="px-3 py-2 text-[#6B4E8A]">Complemento</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
      )}

      {/* Curated Practice Exercises for Active Module */}
      {moduleExercises.length > 0 && (
        <section className="space-y-4" aria-label="Práctica guiada del módulo">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="font-display text-xl font-semibold text-[#1E293B]">
              Práctica y validación paso a paso
            </h2>
            <div className="flex flex-wrap gap-2">
              {moduleExercises.map((ex, i) => {
                const done = profile.completedExercises.includes(ex.id);
                const selected = currentExercise?.id === ex.id;
                return (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => setSelectedExId(ex.id)}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                      selected
                        ? 'border-[#2D4B73] bg-[#2D4B73] text-white'
                        : done
                        ? 'border-[#B9DEC9] bg-[#EFF7F2] text-[#2D7A5E]'
                        : 'border-[#E3E1DA] bg-white text-[#334155]'
                    }`}
                  >
                    {done && <CheckCircle2 className="h-3.5 w-3.5" />}
                    Ejercicio {i + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {currentExercise && (
            <ExerciseRunner
              exercise={currentExercise}
              onAttemptRecorded={onAttemptRecorded}
              onJumpToModule={onSelectModule}
              onSelectExercise={(exId) => {
                const target = EXERCISE_BANK.find((e) => e.id === exId);
                if (target) {
                  if (target.moduleId !== activeModule.id) {
                    onSelectModule(target.moduleId);
                  }
                  setSelectedExId(target.id);
                }
              }}
            />
          )}
        </section>
      )}

      {/* Module 8 Integrative Rubric + Metacognition */}
      {activeModule.id === 'm8' && integrativeAssessment && (
        <div className="space-y-6">
          <section className="rounded-2xl border border-[#DFD8F0] bg-[#F4F1FA] p-5 sm:p-6">
            <h3 className="font-display text-lg font-semibold text-[#1E293B]">
              Criterios de evaluación integradora (no solo el resultado final)
            </h3>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-[#334155]">
              {integrativeAssessment.rubricCriteria.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          </section>
          <MetacognitionPanel
            moduleId="m8"
            includeSelfAssessment={true}
            onSaveMetacognition={onSaveMetacognition}
            onSaveSelfAssessment={onSaveSelfAssessment}
          />
        </div>
      )}

      {/* Next Module CTA */}
      {nextModule && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onSelectModule(nextModule.id)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2D4B73] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1E3A5F]"
          >
            Avanzar a {nextModule.title}
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
