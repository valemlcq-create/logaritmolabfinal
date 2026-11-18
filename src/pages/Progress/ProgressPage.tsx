import { useState } from 'react';
import { CONCEPTS, CURATION_NOTES_PENDING_VALIDATION } from '@/src/data/disciplinary/cerebro';
import { ERROR_MAP } from '@/src/data/errors/catalog';
import {
  buildSimulatedProfile,
  getAdaptiveRecommendation,
} from '@/src/services/adaptive/adaptiveEngine';
import { StudentProfile } from '@/src/types';
import { RotateCcw } from 'lucide-react';

interface ProgressPageProps {
  profile: StudentProfile;
  onReplaceProfile: (next: StudentProfile) => void;
  onResetProfile: () => void;
  onJumpToModule: (moduleId: string) => void;
}

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  dominado: { text: 'Dominado', color: 'text-[#2D7A5E]' },
  en_proceso: { text: 'En proceso', color: 'text-[#2D4B73]' },
  necesita_recuperacion: { text: 'Necesita recuperación', color: 'text-[#C0564B]' },
  no_iniciado: { text: 'No iniciado', color: 'text-[#64748B]' },
};

export function ProgressPage({
  profile,
  onReplaceProfile,
  onResetProfile,
  onJumpToModule,
}: ProgressPageProps) {
  const [viewMode, setViewMode] = useState<'estudiante' | 'docente'>('estudiante');
  const rec = getAdaptiveRecommendation(profile);

  const errorEntries = Object.entries(profile.errorHistory).sort(
    (a, b) => b[1] - a[1]
  );

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      {/* Header & Workspace Switcher */}
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E3E1DA] bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium text-[#526071]">
            {profile.name} {profile.profileLabel ? `· ${profile.profileLabel}` : ''}
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-[#1E293B]">
            Seguimiento adaptativo y perfil del estudiante
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-[#FAF9F6] p-1 border border-[#E3E1DA]">
            <button
              type="button"
              onClick={() => setViewMode('estudiante')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                viewMode === 'estudiante'
                  ? 'bg-white text-[#1E293B] shadow-sm'
                  : 'text-[#64748B]'
              }`}
            >
              Vista Estudiante
            </button>
            <button
              type="button"
              onClick={() => setViewMode('docente')}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                viewMode === 'docente'
                  ? 'bg-white text-[#1E293B] shadow-sm'
                  : 'text-[#64748B]'
              }`}
            >
              Modo Docente
            </button>
          </div>
          <button
            type="button"
            onClick={onResetProfile}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[#D4D1C7] bg-white px-3 py-2 text-xs font-medium text-[#334155] hover:bg-[#FAF9F6]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reiniciar
          </button>
        </div>
      </div>

      {/* KPI Metrics Strip */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="rounded-xl border border-[#E3E1DA] bg-white p-4">
          <p className="text-xs text-[#64748B]">Diagnóstico inicial</p>
          <p className="mt-1 font-math text-2xl font-semibold tabular-nums text-[#1E293B]">
            {profile.diagnosticCompleted ? `${profile.diagnosticScore}%` : 'Pendiente'}
          </p>
        </div>
        <div className="rounded-xl border border-[#E3E1DA] bg-white p-4">
          <p className="text-xs text-[#64748B]">Aciertos validados</p>
          <p className="mt-1 font-math text-2xl font-semibold tabular-nums text-[#2D7A5E]">
            {profile.totalCorrect}
          </p>
        </div>
        <div className="rounded-xl border border-[#E3E1DA] bg-white p-4">
          <p className="text-xs text-[#64748B]">Intentos con error / incompletos</p>
          <p className="mt-1 font-math text-2xl font-semibold tabular-nums text-[#C0564B]">
            {profile.totalIncorrect}
          </p>
        </div>
        <div className="rounded-xl border border-[#E3E1DA] bg-white p-4">
          <p className="text-xs text-[#64748B]">Pistas consultadas</p>
          <p className="mt-1 font-math text-2xl font-semibold tabular-nums text-[#2D4B73]">
            {profile.totalHintsUsed}
          </p>
        </div>
      </div>

      {/* Adaptive Recommendation */}
      <div className="flex flex-col gap-3 rounded-xl border border-[#DCE8F5] bg-[#EEF5FA] p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold text-[#2D4B73]">Diagnóstico adaptativo actual</p>
          <p className="mt-1 text-base font-semibold text-[#1E293B]">{rec.headline}</p>
          <p className="mt-1 text-xs text-[#334155]">{rec.detail}</p>
        </div>
        <button
          type="button"
          onClick={() => onJumpToModule(rec.targetModuleId)}
          className="self-start rounded-lg bg-[#2D4B73] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1E3A5F] whitespace-nowrap shrink-0 sm:self-center"
        >
          {rec.actionLabel}
        </button>
      </div>

      {/* Teacher Mode: Profile Simulator A-F (Sec. 50) */}
      {viewMode === 'docente' && (
        <section className="rounded-2xl border border-[#DFD8F0] bg-[#F4F1FA] p-5 sm:p-6 space-y-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-[#1E293B]">
              Modo Docente · Simulador de perfiles (Fase 8: Perfiles A–F)
            </h2>
            <p className="mt-1 text-xs text-[#475569]">
              Carga cualquiera de los 6 perfiles de prueba para comprobar cómo responde el sistema adaptativo ante cada patrón de aprendizaje o error.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['A', 'B', 'C', 'D', 'E', 'F'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onReplaceProfile(buildSimulatedProfile(p))}
                className="rounded-lg border border-[#C6BBE3] bg-white px-3 py-2 text-xs font-semibold text-[#334155] hover:bg-[#EAE4F7]"
              >
                Cargar Perfil {p}
              </button>
            ))}
          </div>
          <div className="rounded-xl border border-[#DFD8F0] bg-white p-4 text-xs text-[#334155]">
            <strong>Resumen del perfil cargado:</strong> {profile.initialProfileSummary}
          </div>
        </section>
      )}

      {/* Active Recovery Routes */}
      {profile.activeRecoveryRoutes.length > 0 && (
        <section className="rounded-2xl border border-[#F0DFC1] bg-[#FDF6EB] p-5 sm:p-6 space-y-3">
          <h2 className="font-display text-lg font-semibold text-[#7C4D0B]">
            Rutas de recuperación específicas activas
          </h2>
          {profile.activeRecoveryRoutes.map((route) => (
            <div key={route.id} className="rounded-xl border border-[#E3D1AE] bg-white p-4 space-y-2">
              <p className="text-sm font-semibold text-[#1E293B]">{route.reason}</p>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                {route.steps.map((st, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => onJumpToModule(st.moduleId)}
                    className="rounded-lg border border-[#E3E1DA] bg-[#FAF9F6] p-2.5 text-left text-xs hover:border-[#2D4B73]"
                  >
                    <p className="font-semibold text-[#2D4B73]">{st.phase.toUpperCase()}</p>
                    <p className="mt-0.5 text-[#334155]">{st.label}</p>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {/* Concept Mastery Table */}
      <section className="rounded-2xl border border-[#E3E1DA] bg-white p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-[#1E293B]">
          Dominio conceptual por núcleo del Cerebro
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs tabular-nums">
            <thead className="border-b border-[#E3E1DA] text-[#526071]">
              <tr>
                <th className="py-2 pr-3 font-semibold">Núcleo</th>
                <th className="py-2 pr-3 font-semibold">Concepto</th>
                <th className="py-2 pr-3 font-semibold">Estado</th>
                <th className="py-2 pr-3 font-semibold">Nivel</th>
                <th className="py-2 font-semibold">Intentos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EFECE4]">
              {CONCEPTS.map((c) => {
                const recConcept = profile.conceptProgress[c.id];
                const statusKey = recConcept?.status ?? 'no_iniciado';
                const statusInfo = STATUS_LABEL[statusKey];
                return (
                  <tr key={c.id}>
                    <td className="py-2.5 pr-3 font-math text-[#526071]">N{c.nucleusNumber}</td>
                    <td className="py-2.5 pr-3 font-medium text-[#1E293B]">{c.title}</td>
                    <td className={`py-2.5 pr-3 font-semibold ${statusInfo.color}`}>
                      {statusInfo.text}
                    </td>
                    <td className="py-2.5 pr-3 font-math">{recConcept?.masteryScore ?? 0}%</td>
                    <td className="py-2.5 font-math">{recConcept?.attemptsCount ?? 0}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Error Diagnostic Breakdown */}
      <section className="rounded-2xl border border-[#E3E1DA] bg-white p-5 sm:p-6">
        <h2 className="font-display text-lg font-semibold text-[#1E293B]">
          Historial de errores conceptuales detectados
        </h2>
        {errorEntries.length === 0 ? (
          <p className="mt-2 text-xs text-[#64748B]">
            Sin errores registrados hasta el momento.
          </p>
        ) : (
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {errorEntries.map(([code, count]) => {
              const err = ERROR_MAP[code];
              return (
                <div key={code} className="rounded-xl border border-[#E8C5BF] bg-[#FDF3F1] p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-[#C0564B]">
                    <span>{code} · {err?.name ?? 'Error'}</span>
                    <span className="font-math tabular-nums">{count} vez/veces</span>
                  </div>
                  {err && (
                    <p className="mt-1.5 text-xs leading-relaxed text-[#334155]">
                      {err.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Teacher Curation / Pending Validation Notes */}
      {viewMode === 'docente' && (
        <section className="rounded-2xl border border-[#E3E1DA] bg-[#FAF9F6] p-5 sm:p-6">
          <h2 className="font-display text-base font-semibold text-[#1E293B]">
            Registro de curaduría · Elementos marcados como [Pendiente de validación] en el Cerebro
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-xs text-[#475569]">
            {CURATION_NOTES_PENDING_VALIDATION.map((n, i) => (
              <li key={i}>{n}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
