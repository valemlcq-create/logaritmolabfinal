import { FUNDAMENTAL_EQUIVALENCE } from '@/src/data/disciplinary/cerebro';
import { LEARNING_MODULES } from '@/src/data/modules/modules';
import { getAdaptiveRecommendation } from '@/src/services/adaptive/adaptiveEngine';
import { AppRoute, StudentProfile } from '@/src/types';
import { ArrowRight, Compass, LineChart, ShieldCheck } from 'lucide-react';

interface HomePageProps {
  profile: StudentProfile;
  onNavigate: (route: AppRoute, moduleId?: string) => void;
}

export function HomePage({ profile, onNavigate }: HomePageProps) {
  const rec = getAdaptiveRecommendation(profile);

  return (
    <div className="mx-auto max-w-6xl space-y-10 px-4 py-8 sm:px-6 sm:py-10">
      {/* Hero Split */}
      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
        <div className="flex flex-col justify-between rounded-2xl border border-[#E3E1DA] bg-white p-6 sm:p-8 lg:col-span-7">
          <div>
            <p className="text-xs font-medium text-[#526071]">
              5.º año de secundaria · Orientación en Comunicación
            </p>
            <h1 className="mt-2 max-w-2xl font-display text-3xl font-bold tracking-tight text-[#1E293B] sm:text-4xl [text-wrap:balance]">
              Logaritmos: comprender, explorar y aplicar
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#475569]">
              Un sistema de aprendizaje autónomo diseñado para pasar de «no sé qué significa un logaritmo» a explicar, representar gráficamente, controlar el dominio, detectar errores y justificar cada procedimiento.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() =>
                onNavigate(
                  profile.diagnosticCompleted ? 'modules' : 'diagnostic',
                  profile.diagnosticCompleted ? rec.targetModuleId : undefined
                )
              }
              className="inline-flex items-center gap-2 rounded-lg bg-[#2D4B73] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1E3A5F] whitespace-nowrap"
            >
              {profile.diagnosticCompleted ? rec.actionLabel : 'Comenzar Diagnóstico (Módulo 0)'}
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => onNavigate('lab')}
              className="rounded-lg border border-[#D4D1C7] bg-[#FAF9F6] px-5 py-3 text-sm font-semibold text-[#334155] transition-colors hover:bg-[#EFECE4] whitespace-nowrap"
            >
              Explorar Laboratorio Gráfico
            </button>
          </div>
        </div>

        {/* Centerpiece: Regla Matemática Fundamental */}
        <div className="flex flex-col justify-between rounded-2xl border border-[#DCE8F5] bg-[#EEF5FA] p-6 sm:p-8 lg:col-span-5">
          <div>
            <p className="text-xs font-semibold text-[#2D4B73]">
              Principio estructurador del sistema
            </p>
            <div className="mt-3 rounded-xl border border-[#C9DCF0] bg-white p-4 text-center">
              <p className="font-math text-xl font-semibold text-[#1E293B]">
                {FUNDAMENTAL_EQUIVALENCE.formula}
              </p>
              <p className="mt-1 font-math text-xs text-[#526071]">
                {FUNDAMENTAL_EQUIVALENCE.conditions}
              </p>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-[#1E3A5F]">
              {FUNDAMENTAL_EQUIVALENCE.verbal}
            </p>
          </div>

          <div className="mt-6 space-y-2 border-t border-[#D2E2F2] pt-4 text-xs text-[#334155]">
            <p>
              <strong>1.</strong> La potenciación calcula el resultado; el logaritmo recupera el exponente.
            </p>
            <p>
              <strong>2.</strong> Las propiedades L1–L5 traducen reglas de la potenciación.
            </p>
            <p>
              <strong>3.</strong> El dominio controla siempre cada transformación algebraica.
            </p>
          </div>
        </div>
      </section>

      {/* Three Transversal Ideas */}
      <section aria-labelledby="ideas-title">
        <h2 id="ideas-title" className="font-display text-2xl font-semibold text-[#1E293B]">
          Tres ideas que atraviesan todo el recorrido
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-5 md:grid-cols-3">
          {FUNDAMENTAL_EQUIVALENCE.transversalIdeas.map((idea, index) => {
            const icons = [Compass, LineChart, ShieldCheck];
            const Icon = icons[index % icons.length];
            const surface =
              index === 0
                ? 'bg-[#EFF7F2] border-[#D4ECE1]'
                : index === 1
                ? 'bg-[#F4F1FA] border-[#DFD8F0]'
                : 'bg-[#FDF6EB] border-[#F0DFC1]';
            return (
              <div key={idea.id} className={`rounded-xl border p-5 ${surface}`}>
                <Icon className="h-5 w-5 text-[#2D4B73]" />
                <h3 className="mt-3 font-display text-lg font-semibold text-[#1E293B]">
                  {idea.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[#334155]">
                  {idea.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 9-Module Map */}
      <section aria-labelledby="ruta-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="ruta-title" className="font-display text-2xl font-semibold text-[#1E293B]">
              Secuencia pedagógica (Módulos 0 al 8)
            </h2>
            <p className="mt-1 text-sm text-[#526071]">
              Cada módulo respeta las dependencias conceptuales del corpus disciplinar.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('progress')}
            className="text-sm font-semibold text-[#2D4B73] hover:underline"
          >
            Ver seguimiento detallado y Modo Docente
          </button>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LEARNING_MODULES.map((mod) => {
            const visited = profile.visitedModules.includes(mod.id);
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() =>
                  onNavigate(mod.id === 'm0' ? 'diagnostic' : 'modules', mod.id)
                }
                className="flex flex-col justify-between rounded-xl border border-[#E3E1DA] bg-white p-5 text-left transition-colors hover:border-[#2D4B73] hover:bg-[#FAF9F6]"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 text-xs text-[#64748B]">
                    <span>Núcleos {mod.targetNuclei.join(', ')}</span>
                    <span className={visited ? 'font-semibold text-[#2D7A5E]' : ''}>
                      {visited ? 'Visitado' : `~${mod.estimatedMinutes} min`}
                    </span>
                  </div>
                  <h3 className="mt-2 font-display text-base font-semibold text-[#1E293B]">
                    {mod.title}
                  </h3>
                  <p className="mt-1 text-xs font-medium text-[#2D4B73]">{mod.subtitle}</p>
                  <p className="mt-2 text-xs leading-relaxed text-[#475569]">
                    {mod.objective}
                  </p>
                </div>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[#2D4B73]">
                  Explorar módulo <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}
