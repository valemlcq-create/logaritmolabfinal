import { AppRoute, StudentProfile } from '@/src/types';
import { getAdaptiveRecommendation } from '@/src/services/adaptive/adaptiveEngine';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface TopNavBarProps {
  currentRoute: AppRoute;
  onNavigate: (route: AppRoute, moduleId?: string) => void;
  profile: StudentProfile;
  activeModuleTitle?: string;
}

const NAV_ITEMS: { id: AppRoute; label: string }[] = [
  { id: 'home', label: 'Inicio' },
  { id: 'diagnostic', label: 'Diagnóstico' },
  { id: 'modules', label: 'Módulos' },
  { id: 'lab', label: 'Laboratorio' },
  { id: 'progress', label: 'Progreso' },
];

export function TopNavBar({
  currentRoute,
  onNavigate,
  profile,
  activeModuleTitle,
}: TopNavBarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalExercises = 16;
  const progressPct = Math.min(
    100,
    Math.round((profile.completedExercises.length / totalExercises) * 100)
  );
  const rec = getAdaptiveRecommendation(profile);

  const routeLabel: Record<AppRoute, string> = {
    home: 'Inicio',
    diagnostic: 'Módulo 0 · Diagnóstico',
    modules: activeModuleTitle || 'Secuencia de Módulos',
    exercises: 'Práctica',
    lab: 'Laboratorio Gráfico y Escalas',
    assessment: 'Evaluación',
    progress: 'Seguimiento y Modo Docente',
    tutor: 'Tutor Especializado',
  };

  return (
    <div className="border-b border-[#E3E1DA] bg-white">
      {/* Strict 3-zone Top Bar Contract */}
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-8 px-4 py-3.5 sm:px-6">
        {/* Zone 1: Single-line brand wordmark */}
        <button
          type="button"
          onClick={() => {
            onNavigate('home');
            setMobileOpen(false);
          }}
          className="font-display text-lg font-bold tracking-tight text-[#1E293B] whitespace-nowrap shrink-0"
        >
          Logaritmos
        </button>

        {/* Zone 2: 5 concise single-line text links */}
        <nav
          aria-label="Navegación principal"
          className="hidden md:flex items-center gap-6 text-sm font-medium text-[#475569]"
        >
          {NAV_ITEMS.map((item) => {
            const active = currentRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                className={`border-b-2 py-1 transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'border-[#2D4B73] font-semibold text-[#1E293B]'
                    : 'border-transparent hover:border-[#CBD5E1] hover:text-[#1E293B]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary CTA + mobile menu toggle */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              onNavigate('tutor');
              setMobileOpen(false);
            }}
            className="rounded-lg bg-[#2D4B73] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1E3A5F] whitespace-nowrap shrink-0"
          >
            Tutor IA
          </button>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Abrir menú"
            className="rounded-lg border border-[#E3E1DA] p-2 text-[#334155] md:hidden"
          >
            {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Drawer */}
      {mobileOpen && (
        <nav className="border-t border-[#E3E1DA] bg-[#FAF9F6] px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1.5">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  onNavigate(item.id);
                  setMobileOpen(false);
                }}
                className={`rounded-lg px-3 py-2.5 text-left text-sm font-medium ${
                  currentRoute === item.id
                    ? 'bg-[#EEF5FA] font-semibold text-[#2D4B73]'
                    : 'text-[#334155]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      )}

      {/* Non-sticky orientation context bar (Sec. 31: student always knows where they are & progress) */}
      <div className="border-t border-[#EFECE4] bg-[#FAF9F6]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 text-xs text-[#526071] sm:px-6">
          <div className="flex flex-wrap items-center gap-2">
            <span>
              Estás en: <strong className="text-[#1E293B]">{routeLabel[currentRoute]}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Avance: <strong className="font-math tabular-nums text-[#2D4B73]">{progressPct}%</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              onNavigate(
                rec.targetModuleId === 'm0' && !profile.diagnosticCompleted ? 'diagnostic' : 'modules',
                rec.targetModuleId
              )
            }
            className="text-left font-medium text-[#2D4B73] hover:underline"
          >
            Siguiente paso sugerido: {rec.headline}
          </button>
        </div>
      </div>
    </div>
  );
}
