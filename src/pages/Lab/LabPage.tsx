import { InteractiveLogGraphLab } from '@/src/components/visualizations/InteractiveLogGraphLab';
import { ScaleComparator } from '@/src/components/visualizations/ScaleComparator';
import { MultipleRepresentationsConverter } from '@/src/components/learning/MultipleRepresentationsConverter';

export function LabPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-8 sm:px-6">
      <header className="rounded-2xl border border-[#E3E1DA] bg-white p-6">
        <p className="text-xs font-medium text-[#2D4B73]">
          Representaciones múltiples y exploración autónoma
        </p>
        <h1 className="mt-1 font-display text-2xl font-bold text-[#1E293B] sm:text-3xl">
          Laboratorio gráfico y de escalas
        </h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-[#475569]">
          Experimenta libremente con la base <span className="font-math">b ∈ [−2; 5]</span>, verifica visualmente la simetría respecto de <span className="font-math">y = x</span>, traduce entre forma exponencial, logarítmica y verbal, y contrasta gráficos en escala lineal y semilogarítmica.
        </p>
      </header>

      <InteractiveLogGraphLab />
      <MultipleRepresentationsConverter />
      <ScaleComparator />
    </div>
  );
}
