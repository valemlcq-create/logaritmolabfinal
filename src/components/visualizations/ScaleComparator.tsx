import { useState } from 'react';
import { formatAr } from '@/src/utils/mathFormat';
import { ProvenanceTagText } from '@/src/components/layout/ProvenanceTagText';

const SERIES = [
  { day: 1, audience: 10 },
  { day: 2, audience: 100 },
  { day: 3, audience: 1000 },
  { day: 4, audience: 10000 },
];

export function ScaleComparator() {
  const [truncateLinear, setTruncateLinear] = useState(false);

  const w = 320;
  const h = 210;
  const pad = 38;

  // Linear scale Y mapping
  const minLin = truncateLinear ? 800 : 0;
  const maxLin = 10500;
  const mapX = (day: number) => pad + ((day - 1) / 3) * (w - 2 * pad);
  const mapLinY = (val: number) =>
    h - pad - ((Math.max(val, minLin) - minLin) / (maxLin - minLin)) * (h - 2 * pad);

  // Semilog scale (log10) mapping: log10(10)=1 .. log10(10000)=4
  const mapLogY = (val: number) => {
    const lv = Math.log10(val);
    return h - pad - ((lv - 0.5) / 4) * (h - 2 * pad);
  };

  return (
    <section className="rounded-xl border border-[#E3E1DA] bg-white p-5 sm:p-6">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-xl font-semibold text-[#1E293B]">
            Lectura crítica: escala lineal vs. escala semilogarítmica
          </h3>
          <ProvenanceTagText
            provenance="CORRECCION"
            note="Ninguna escala es engañosa en sí misma: la lineal muestra cantidades absolutas y la logarítmica ritmos relativos."
          />
        </div>
        <button
          type="button"
          onClick={() => setTruncateLinear((v) => !v)}
          className={`rounded-lg border px-3 py-2 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
            truncateLinear
              ? 'border-[#9A6315] bg-[#FDF6EB] text-[#9A6315]'
              : 'border-[#D4D1C7] bg-[#FAF9F6] text-[#334155]'
          }`}
        >
          {truncateLinear ? 'Eje lineal truncado (desde 800)' : 'Simular eje lineal truncado'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Linear chart */}
        <div className="rounded-xl border border-[#E3E1DA] bg-[#FAF9F6] p-4">
          <p className="mb-2 text-sm font-semibold text-[#1E293B]">
            1. Escala lineal (eje y = audiencia)
          </p>
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Gráfico en escala lineal">
            <line x1={pad} y1={pad / 2} x2={pad} y2={h - pad} stroke="#64748B" strokeWidth="1.5" />
            <line x1={pad} y1={h - pad} x2={w - pad / 2} y2={h - pad} stroke="#64748B" strokeWidth="1.5" />
            <polyline
              fill="none"
              stroke="#2D4B73"
              strokeWidth="2.5"
              points={SERIES.map((p) => `${mapX(p.day)},${mapLinY(p.audience)}`).join(' ')}
            />
            {SERIES.map((p) => (
              <g key={p.day}>
                <circle cx={mapX(p.day)} cy={mapLinY(p.audience)} r="4" fill="#2D4B73" />
                <text x={mapX(p.day)} y={h - pad + 15} textAnchor="middle" fontSize="10" fill="#475569">
                  Día {p.day}
                </text>
                <text
                  x={mapX(p.day) - 6}
                  y={mapLinY(p.audience) - 8}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#1E293B"
                >
                  {formatAr(p.audience, 0)}
                </text>
              </g>
            ))}
          </svg>
          <p className="mt-2 text-xs leading-relaxed text-[#475569]">
            Muestra <strong>cuántas personas</strong> se suman en valor absoluto.{' '}
            {truncateLinear
              ? 'Al truncar el eje desde 800, los días 1 y 2 quedan aplastados sobre la base.'
              : 'La curva acelera bruscamente porque cada día multiplica por 10.'}
          </p>
        </div>

        {/* Semilog chart */}
        <div className="rounded-xl border border-[#E3E1DA] bg-[#FAF9F6] p-4">
          <p className="mb-2 text-sm font-semibold text-[#1E293B]">
            2. Escala semilogarítmica (eje y = log₁₀ audiencia)
          </p>
          <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Gráfico en escala semilogarítmica">
            <line x1={pad} y1={pad / 2} x2={pad} y2={h - pad} stroke="#64748B" strokeWidth="1.5" />
            <line x1={pad} y1={h - pad} x2={w - pad / 2} y2={h - pad} stroke="#64748B" strokeWidth="1.5" />
            <polyline
              fill="none"
              stroke="#C0564B"
              strokeWidth="2.5"
              points={SERIES.map((p) => `${mapX(p.day)},${mapLogY(p.audience)}`).join(' ')}
            />
            {SERIES.map((p) => {
              const logVal = Math.log10(p.audience);
              return (
                <g key={p.day}>
                  <circle cx={mapX(p.day)} cy={mapLogY(p.audience)} r="4" fill="#C0564B" />
                  <text x={mapX(p.day)} y={h - pad + 15} textAnchor="middle" fontSize="10" fill="#475569">
                    Día {p.day}
                  </text>
                  <text
                    x={mapX(p.day)}
                    y={mapLogY(p.audience) - 10}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#991B1B"
                  >
                    log = {logVal}
                  </text>
                </g>
              );
            })}
          </svg>
          <p className="mt-2 text-xs leading-relaxed text-[#475569]">
            Al graficar <span className="font-math">log(y) = 1 · x</span>, se forma una{' '}
            <strong>recta de pendiente log(10) = 1</strong>. Cada paso vertical de +1 representa{' '}
            <strong>multiplicar por 10</strong> (riesgo: subestimar diferencias si se lee como lineal).
          </p>
        </div>
      </div>
    </section>
  );
}
