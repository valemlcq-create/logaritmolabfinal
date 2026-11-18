import { useState } from 'react';
import { formatAr } from '@/src/utils/mathFormat';
import { ProvenanceTagText } from '@/src/components/layout/ProvenanceTagText';

export function BisectionVideoExplorer() {
  const [t, setT] = useState<number>(5);

  const views = 100 * Math.pow(3, t);
  const powerOf3 = Math.pow(3, t);
  const target = 50000;
  const diff = views - target;

  return (
    <div className="rounded-xl border border-[#E3E1DA] bg-white p-5 sm:p-6 space-y-4">
      <div>
        <h4 className="font-display text-lg font-semibold text-[#1E293B]">
          Actividad de acotación: ¿cuándo alcanza 50.000 reproducciones?
        </h4>
        <ProvenanceTagText
          provenance="FUENTE"
          note="Modelo continuo V(t) = 100 · 3^t del documental estudiantil (Núcleo 2.2)."
        />
      </div>

      <p className="text-sm leading-relaxed text-[#334155]">
        En t = 5 h se alcanzan exactamente 24.300 reproducciones (3^5 = 243). Pero para llegar a 50.000 necesitamos resolver{' '}
        <span className="font-math font-semibold">3^t = 500</span>. Desliza el tiempo <span className="font-math">t</span> para acotar el exponente real antes de conocer su nombre formal.
      </p>

      <div className="rounded-xl border border-[#E3E1DA] bg-[#FAF9F6] p-4">
        <div className="mb-2 flex items-center justify-between">
          <label htmlFor="bisect-t" className="text-sm font-semibold text-[#1E293B]">
            Tiempo t (horas)
          </label>
          <span className="font-math text-sm font-semibold tabular-nums text-[#2D4B73]">
            t = {formatAr(t, 3)} h
          </span>
        </div>
        <input
          id="bisect-t"
          type="range"
          min={4}
          max={6.5}
          step={0.01}
          value={t}
          onChange={(e) => setT(Number(e.target.value))}
          className="w-full accent-[#2D4B73]"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {[5, 5.5, 5.657, 5.75, 6].map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setT(preset)}
              className="rounded-md border border-[#D4D1C7] bg-white px-2.5 py-1 font-math text-xs text-[#334155] hover:bg-[#EFECE4]"
            >
              t = {formatAr(preset, 3)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-[#E3E1DA] bg-[#FAF9F6] p-3.5">
          <p className="text-xs text-[#64748B]">Potencia 3^t (objetivo: 500)</p>
          <p className="mt-1 font-math text-lg font-semibold tabular-nums text-[#1E293B]">
            {formatAr(powerOf3, 2)}
          </p>
        </div>
        <div className="rounded-xl border border-[#E3E1DA] bg-[#FAF9F6] p-3.5">
          <p className="text-xs text-[#64748B]">Reproducciones V(t)</p>
          <p className="mt-1 font-math text-lg font-semibold tabular-nums text-[#2D4B73]">
            {formatAr(views, 0)}
          </p>
        </div>
        <div
          className={`rounded-xl border p-3.5 ${
            Math.abs(diff) < 350
              ? 'border-[#B9DEC9] bg-[#EFF7F2]'
              : 'border-[#E3E1DA] bg-[#FAF9F6]'
          }`}
        >
          <p className="text-xs text-[#64748B]">Estado respecto a 50.000</p>
          <p className="mt-1 text-sm font-semibold text-[#1E293B]">
            {Math.abs(diff) < 350
              ? '¡Muy cerca! t ≈ log_3(500) ≈ 5,657 h'
              : diff < 0
              ? 'Por debajo (falta exponente)'
              : 'Por encima (exceso de exponente)'}
          </p>
        </div>
      </div>
    </div>
  );
}
