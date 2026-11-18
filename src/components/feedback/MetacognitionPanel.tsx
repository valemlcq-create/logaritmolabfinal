import { useState } from 'react';
import { MetacognitionEntry, SelfAssessmentEntry } from '@/src/types';
import { CheckCircle2 } from 'lucide-react';

interface MetacognitionPanelProps {
  moduleId: string;
  onSaveMetacognition: (entry: MetacognitionEntry) => void;
  onSaveSelfAssessment?: (entry: SelfAssessmentEntry) => void;
  includeSelfAssessment?: boolean;
}

export function MetacognitionPanel({
  moduleId,
  onSaveMetacognition,
  onSaveSelfAssessment,
  includeSelfAssessment = false,
}: MetacognitionPanelProps) {
  const [strategyUsed, setStrategyUsed] = useState('');
  const [whyStrategy, setWhyStrategy] = useState('');
  const [conditionChecked, setConditionChecked] = useState('');
  const [possibleError, setPossibleError] = useState('');
  const [verificationMethod, setVerificationMethod] = useState('');
  const [hardestPart, setHardestPart] = useState('');
  const [needToPractice, setNeedToPractice] = useState('');

  // Self assessment state
  const [comprehension, setComprehension] = useState(4);
  const [confidence, setConfidence] = useState(4);
  const [perceivedDifficulty, setPerceivedDifficulty] = useState(3);
  const [dominantStrategy, setDominantStrategy] = useState('Pasar a forma exponencial y verificar dominio');
  const [helpNeeded, setHelpNeeded] = useState('Pistas ocasionales');

  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveMetacognition({
      id: `meta-${Date.now()}`,
      moduleId,
      timestamp: new Date().toISOString(),
      strategyUsed,
      whyStrategy,
      conditionChecked,
      possibleError,
      verificationMethod,
      hardestPart,
      needToPractice,
    });
    if (includeSelfAssessment && onSaveSelfAssessment) {
      onSaveSelfAssessment({
        id: `self-${Date.now()}`,
        timestamp: new Date().toISOString(),
        comprehension,
        confidence,
        perceivedDifficulty,
        dominantStrategy,
        helpNeeded,
      });
    }
    setSaved(true);
  };

  return (
    <section className="rounded-xl border border-[#E3E1DA] bg-white p-5 sm:p-6">
      <h3 className="font-display text-lg font-semibold text-[#1E293B]">
        Reflexión metacognitiva y autoevaluación
      </h3>
      <p className="mt-1 text-xs text-[#526071]">
        Registrar cómo pensaste cada problema consolida tu autonomía matemática (Nivel 10).
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-[#334155]">
              1. ¿Qué estrategia utilizaste?
            </label>
            <input
              type="text"
              required
              value={strategyUsed}
              onChange={(e) => setStrategyUsed(e.target.value)}
              placeholder="Ej: Igualar bases / condensar / gráfica"
              className="mt-1 w-full rounded-lg border border-[#D4D1C7] bg-[#FAF9F6] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155]">
              2. ¿Por qué elegiste esa estrategia?
            </label>
            <input
              type="text"
              required
              value={whyStrategy}
              onChange={(e) => setWhyStrategy(e.target.value)}
              placeholder="Ej: Porque las bases eran distintas..."
              className="mt-1 w-full rounded-lg border border-[#D4D1C7] bg-[#FAF9F6] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155]">
              3. ¿Qué condición de dominio debías verificar?
            </label>
            <input
              type="text"
              required
              value={conditionChecked}
              onChange={(e) => setConditionChecked(e.target.value)}
              placeholder="Ej: b > 0, b ≠ 1, argumento > 0"
              className="mt-1 w-full rounded-lg border border-[#D4D1C7] bg-[#FAF9F6] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155]">
              4. ¿Qué error era posible cometer?
            </label>
            <input
              type="text"
              required
              value={possibleError}
              onChange={(e) => setPossibleError(e.target.value)}
              placeholder="Ej: Aceptar solución extraña / no invertir signo"
              className="mt-1 w-full rounded-lg border border-[#D4D1C7] bg-[#FAF9F6] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155]">
              5. ¿Cómo comprobaste tu respuesta?
            </label>
            <input
              type="text"
              required
              value={verificationMethod}
              onChange={(e) => setVerificationMethod(e.target.value)}
              placeholder="Ej: Sustituí en la ecuación original"
              className="mt-1 w-full rounded-lg border border-[#D4D1C7] bg-[#FAF9F6] px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#334155]">
              6. ¿Qué parte te resultó más difícil?
            </label>
            <input
              type="text"
              required
              value={hardestPart}
              onChange={(e) => setHardestPart(e.target.value)}
              placeholder="Ej: Plantear la intersección de intervalos"
              className="mt-1 w-full rounded-lg border border-[#D4D1C7] bg-[#FAF9F6] px-3 py-2 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#334155]">
            7. ¿Qué necesitas practicar más?
          </label>
          <input
            type="text"
            required
            value={needToPractice}
            onChange={(e) => setNeedToPractice(e.target.value)}
            placeholder="Ej: Diferenciar log(x²) = 2·log|x| de 2·log(x)"
            className="mt-1 w-full rounded-lg border border-[#D4D1C7] bg-[#FAF9F6] px-3 py-2 text-sm"
          />
        </div>

        {includeSelfAssessment && (
          <div className="rounded-xl border border-[#E3E1DA] bg-[#FAF9F6] p-4 space-y-3">
            <p className="text-xs font-semibold text-[#2D4B73]">
              Autoevaluación del aprendizaje (escala 1 a 5)
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <div className="flex justify-between text-xs">
                  <span>Comprensión</span>
                  <span className="font-math font-semibold">{comprehension}/5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={comprehension}
                  onChange={(e) => setComprehension(Number(e.target.value))}
                  className="mt-1 w-full accent-[#2D4B73]"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs">
                  <span>Seguridad</span>
                  <span className="font-math font-semibold">{confidence}/5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={confidence}
                  onChange={(e) => setConfidence(Number(e.target.value))}
                  className="mt-1 w-full accent-[#2D7A5E]"
                />
              </div>
              <div>
                <div className="flex justify-between text-xs">
                  <span>Dificultad percibida</span>
                  <span className="font-math font-semibold">{perceivedDifficulty}/5</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={perceivedDifficulty}
                  onChange={(e) => setPerceivedDifficulty(Number(e.target.value))}
                  className="mt-1 w-full accent-[#C0564B]"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="block text-xs text-[#475569]">Estrategia dominante</label>
                <input
                  type="text"
                  value={dominantStrategy}
                  onChange={(e) => setDominantStrategy(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#D4D1C7] bg-white px-3 py-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs text-[#475569]">Necesidad de ayuda</label>
                <select
                  value={helpNeeded}
                  onChange={(e) => setHelpNeeded(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-[#D4D1C7] bg-white px-3 py-1.5 text-xs"
                >
                  <option>Autónomo (sin ayuda)</option>
                  <option>Pistas ocasionales</option>
                  <option>Acompañamiento paso a paso en dominio</option>
                  <option>Refuerzo de prerrequisitos</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-lg bg-[#2D4B73] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E3A5F]"
          >
            Guardar reflexión en mi perfil
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#2D7A5E]">
              <CheckCircle2 className="h-4 w-4" /> Reflexión registrada
            </span>
          )}
        </div>
      </form>
    </section>
  );
}
