import { useMemo, useState } from 'react';
import { formatAr } from '@/src/utils/mathFormat';
import { ProvenanceTagText } from '@/src/components/layout/ProvenanceTagText';

interface InteractiveLogGraphLabProps {
  initialBase?: number;
}

export function InteractiveLogGraphLab({ initialBase = 2 }: InteractiveLogGraphLabProps) {
  // Slider b ∈ [-2, 5] step 0.1 per Cerebro 7.8 [Corrección]
  const [base, setBase] = useState<number>(initialBase);
  const [shiftH, setShiftH] = useState<number>(0);
  const [shiftK, setShiftK] = useState<number>(0);
  const [showExp, setShowExp] = useState<boolean>(true);
  const [showLog, setShowLog] = useState<boolean>(true);
  const [showSymmetry, setShowSymmetry] = useState<boolean>(true);
  const [showPoints, setShowPoints] = useState<boolean>(true);

  const width = 560;
  const height = 420;
  const minCoord = -4;
  const maxCoord = 8;
  const span = maxCoord - minCoord; // 12 units

  const toPxX = (x: number) => ((x - minCoord) / span) * width;
  const toPxY = (y: number) => height - ((y - minCoord) / span) * height;

  const isValidBase = base > 0 && Math.abs(base - 1) > 0.001;
  const isBaseOne = Math.abs(base - 1) <= 0.001;
  const isBaseZero = Math.abs(base) <= 0.001;
  const isBaseNegative = base < -0.001;

  const expPath = useMemo(() => {
    if (!isValidBase) return '';
    const pts: string[] = [];
    for (let i = 0; i <= 240; i++) {
      const x = minCoord + (i / 240) * span;
      const y = Math.pow(base, x - shiftH) + shiftK;
      if (Number.isFinite(y) && y >= minCoord - 2 && y <= maxCoord + 2) {
        const cmd = pts.length === 0 ? 'M' : 'L';
        pts.push(`${cmd}${toPxX(x).toFixed(1)},${toPxY(y).toFixed(1)}`);
      }
    }
    return pts.join(' ');
  }, [base, shiftH, shiftK, isValidBase]);

  const logPath = useMemo(() => {
    if (!isValidBase) return '';
    const pts: string[] = [];
    const lnB = Math.log(base);
    for (let i = 1; i <= 320; i++) {
      const x = shiftH + (i / 320) * (maxCoord - shiftH + 0.5);
      if (x <= shiftH + 0.005) continue;
      const y = Math.log(x - shiftH) / lnB + shiftK;
      if (Number.isFinite(y) && y >= minCoord - 2 && y <= maxCoord + 2) {
        const cmd = pts.length === 0 ? 'M' : 'L';
        pts.push(`${cmd}${toPxX(x).toFixed(1)},${toPxY(y).toFixed(1)}`);
      }
    }
    return pts.join(' ');
  }, [base, shiftH, shiftK, isValidBase]);

  const isolatedNegPoints = useMemo(() => {
    if (!isBaseNegative) return [];
    const fracs = [-3, -2, -5 / 3, -1, -1 / 3, 0, 1 / 3, 1, 5 / 3, 2, 3];
    return fracs.map((x) => {
      const absPow = Math.pow(Math.abs(base), x);
      const isOddNeg = Math.abs((x * 3) % 2) === 1 || Math.abs(x % 2) === 1;
      const y = isOddNeg ? -absPow : absPow;
      return { x, y };
    });
  }, [base, isBaseNegative]);

  const tableRows = useMemo(() => {
    if (!isValidBase) return [];
    const xs = [-2, -1, 0, 1, 2];
    return xs.map((x) => {
      const expVal = Math.pow(base, x);
      return {
        x,
        expY: expVal,
        logX: expVal,
        logY: x,
      };
    });
  }, [base, isValidBase]);

  const diagnosisText = useMemo(() => {
    if (isBaseOne) {
      return 'Con b = 1, f(x) = 1^x = 1 es constante. Falla la inyectividad (recta horizontal) y log_1(x) no existe en ℝ.';
    }
    if (isBaseZero) {
      return 'Con b = 0, 0^x vale 0 para x > 0 y no existe para x ≤ 0. No hay función exponencial continua ni logaritmo en base 0.';
    }
    if (isBaseNegative) {
      return '[Corrección] Con b < 0, b^x solo existe en ℝ para racionales irreducibles de denominador impar (puntos aislados en la gráfica). No contiene ningún intervalo continuo ni admite inversa.';
    }
    if (Math.abs(base - 1 / 16) < 0.02) {
      return '[Complemento] Con b ≈ 1/16 (0 < b < 1), ambas funciones decrecen y se cortan además fuera de y = x, cerca de (0,5; 0,25) y (0,25; 0,5).';
    }
    if (base > 1) {
      return `Con b = ${formatAr(base, 2)} > 1, ambas son estrictamente crecientes. Asíntota de b^x: y = ${formatAr(shiftK, 1)} (x → −∞); asíntota de log_b: x = ${formatAr(shiftH, 1)}.`;
    }
    return `Con 0 < b = ${formatAr(base, 2)} < 1, ambas son estrictamente decrecientes. [Corrección] Asíntota de b^x: y = ${formatAr(shiftK, 1)} (x → +∞); asíntota de log_b: x = ${formatAr(shiftH, 1)}.`;
  }, [base, shiftH, shiftK, isBaseOne, isBaseZero, isBaseNegative]);

  return (
    <section className="rounded-xl border border-[#E3E1DA] bg-white p-5 sm:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-xl font-semibold text-[#1E293B]">
            Laboratorio gráfico interactivo: f(x) = b^x y g(x) = log_b(x)
          </h3>
          <ProvenanceTagText
            provenance="CORRECCION"
            note="Deslizador ampliado a [−2; 5] para explorar b = 1, b = 0, b < 0 y caso b = 1/16."
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setBase(2);
            setShiftH(0);
            setShiftK(0);
          }}
          className="self-start rounded-lg border border-[#D4D1C7] bg-[#FAF9F6] px-3 py-2 text-xs font-medium text-[#334155] transition-colors hover:bg-[#EFECE4] whitespace-nowrap shrink-0"
        >
          Restablecer (b = 2)
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:items-start">
        {/* Interactive Canvas (Left 7 cols) */}
        <div className="lg:col-span-7">
          <div className="overflow-hidden rounded-xl border border-[#E3E1DA] bg-[#FAF9F6]">
            <svg
              viewBox={`0 0 ${width} ${height}`}
              className="h-auto w-full select-none"
              role="img"
              aria-label="Plano cartesiano interactivo de las funciones exponencial y logarítmica"
            >
              {/* Grid lines */}
              {Array.from({ length: span + 1 }, (_, idx) => {
                const coord = minCoord + idx;
                const px = toPxX(coord);
                const py = toPxY(coord);
                const isAxis = coord === 0;
                return (
                  <g key={coord}>
                    <line
                      x1={px}
                      y1={0}
                      x2={px}
                      y2={height}
                      stroke={isAxis ? '#475569' : '#E5E3DC'}
                      strokeWidth={isAxis ? 1.5 : 1}
                    />
                    <line
                      x1={0}
                      y1={py}
                      x2={width}
                      y2={py}
                      stroke={isAxis ? '#475569' : '#E5E3DC'}
                      strokeWidth={isAxis ? 1.5 : 1}
                    />
                    {coord !== 0 && coord % 2 === 0 && (
                      <>
                        <text
                          x={px}
                          y={toPxY(0) + 14}
                          textAnchor="middle"
                          fontSize="10"
                          fill="#64748B"
                        >
                          {coord}
                        </text>
                        <text
                          x={toPxX(0) - 10}
                          y={py + 3}
                          textAnchor="end"
                          fontSize="10"
                          fill="#64748B"
                        >
                          {coord}
                        </text>
                      </>
                    )}
                  </g>
                );
              })}

              {/* Symmetry axis y = x */}
              {showSymmetry && (
                <line
                  x1={toPxX(minCoord)}
                  y1={toPxY(minCoord)}
                  x2={toPxX(maxCoord)}
                  y2={toPxY(maxCoord)}
                  stroke="#94A3B8"
                  strokeWidth="1.5"
                  strokeDasharray="5 5"
                />
              )}

              {/* Asymptotes when shifted */}
              {isValidBase && showExp && (
                <line
                  x1={0}
                  y1={toPxY(shiftK)}
                  x2={width}
                  y2={toPxY(shiftK)}
                  stroke="#2D7A5E"
                  strokeWidth="1"
                  strokeDasharray="3 4"
                  opacity={0.7}
                />
              )}
              {isValidBase && showLog && (
                <line
                  x1={toPxX(shiftH)}
                  y1={0}
                  x2={toPxX(shiftH)}
                  y2={height}
                  stroke="#C0564B"
                  strokeWidth="1"
                  strokeDasharray="3 4"
                  opacity={0.7}
                />
              )}

              {/* Base = 1 horizontal constant line */}
              {isBaseOne && showExp && (
                <line
                  x1={0}
                  y1={toPxY(1 + shiftK)}
                  x2={width}
                  y2={toPxY(1 + shiftK)}
                  stroke="#2D7A5E"
                  strokeWidth="2.5"
                />
              )}

              {/* Base < 0 isolated points */}
              {isBaseNegative &&
                isolatedNegPoints.map((pt, i) => (
                  <circle
                    key={i}
                    cx={toPxX(pt.x)}
                    cy={toPxY(pt.y)}
                    r="3.5"
                    fill="#9A6315"
                  />
                ))}

              {/* Exponential curve */}
              {isValidBase && showExp && expPath && (
                <path
                  d={expPath}
                  fill="none"
                  stroke="#2D7A5E"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                />
              )}

              {/* Logarithmic curve */}
              {isValidBase && showLog && logPath && (
                <path
                  d={logPath}
                  fill="none"
                  stroke="#C0564B"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                />
              )}

              {/* Key symmetric points */}
              {isValidBase && showPoints && shiftH === 0 && shiftK === 0 && (
                <g>
                  {showExp && (
                    <>
                      <circle cx={toPxX(0)} cy={toPxY(1)} r="4.5" fill="#2D7A5E" />
                      <text x={toPxX(0) - 24} y={toPxY(1) - 8} fontSize="11" fill="#1E293B">
                        (0; 1)
                      </text>
                      <circle cx={toPxX(1)} cy={toPxY(base)} r="4.5" fill="#2D7A5E" />
                      <text x={toPxX(1) + 8} y={toPxY(base) - 6} fontSize="11" fill="#1E293B">
                        (1; {formatAr(base, 2)})
                      </text>
                    </>
                  )}
                  {showLog && (
                    <>
                      <circle cx={toPxX(1)} cy={toPxY(0)} r="4.5" fill="#C0564B" />
                      <text x={toPxX(1) + 6} y={toPxY(0) + 14} fontSize="11" fill="#1E293B">
                        (1; 0)
                      </text>
                      <circle cx={toPxX(base)} cy={toPxY(1)} r="4.5" fill="#C0564B" />
                      <text x={toPxX(base) + 8} y={toPxY(1) + 14} fontSize="11" fill="#1E293B">
                        ({formatAr(base, 2)}; 1)
                      </text>
                    </>
                  )}
                  {showSymmetry && showExp && showLog && (
                    <line
                      x1={toPxX(1)}
                      y1={toPxY(base)}
                      x2={toPxX(base)}
                      y2={toPxY(1)}
                      stroke="#64748B"
                      strokeWidth="1"
                      strokeDasharray="2 3"
                    />
                  )}
                </g>
              )}
            </svg>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#475569]">
            <span className="inline-flex items-center gap-1.5 font-medium text-[#2D7A5E]">
              <span className="inline-block h-0.5 w-4 bg-[#2D7A5E]" /> Exponencial f(x)
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium text-[#C0564B]">
              <span className="inline-block h-0.5 w-4 bg-[#C0564B]" /> Logarítmica g(x)
            </span>
            <span className="inline-flex items-center gap-1.5 text-[#64748B]">
              <span className="inline-block h-0.5 w-4 border-t border-dashed border-[#64748B]" /> Eje y = x
            </span>
          </div>
        </div>

        {/* Control & Concept Deck (Right 5 cols) */}
        <div className="space-y-4 lg:col-span-5">
          <div className="rounded-xl border border-[#E3E1DA] bg-[#FAF9F6] p-4">
            <div className="mb-2 flex items-center justify-between">
              <label htmlFor="slider-base" className="text-sm font-semibold text-[#1E293B]">
                Base b
              </label>
              <span className="font-math text-sm font-semibold tabular-nums text-[#2D4B73]">
                b = {formatAr(base, 2)}
              </span>
            </div>
            <input
              id="slider-base"
              type="range"
              min={-2}
              max={5}
              step={0.1}
              value={base}
              onChange={(e) => setBase(Number(e.target.value))}
              className="w-full accent-[#2D4B73]"
            />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {[
                { label: 'b = 2', v: 2 },
                { label: 'b = 0,5', v: 0.5 },
                { label: 'b = 1/16', v: 0.0625 },
                { label: 'b = e', v: 2.718 },
                { label: 'b = 1', v: 1 },
                { label: 'b = 0', v: 0 },
                { label: 'b = −2', v: -2 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setBase(preset.v)}
                  className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                    Math.abs(base - preset.v) < 0.01
                      ? 'border-[#2D4B73] bg-[#2D4B73] text-white'
                      : 'border-[#D4D1C7] bg-white text-[#334155] hover:bg-[#EFECE4]'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transformaciones (h, k) */}
          <div className="rounded-xl border border-[#E3E1DA] bg-[#FAF9F6] p-4 space-y-3">
            <p className="text-xs font-semibold text-[#334155]">
              Transformaciones: g(x) = log_b(x − h) + k
            </p>
            <div>
              <div className="flex justify-between text-xs text-[#475569]">
                <label htmlFor="slider-h">Desplazamiento horizontal (h)</label>
                <span className="font-math tabular-nums">h = {formatAr(shiftH, 1)}</span>
              </div>
              <input
                id="slider-h"
                type="range"
                min={-3}
                max={3}
                step={0.5}
                value={shiftH}
                onChange={(e) => setShiftH(Number(e.target.value))}
                className="w-full accent-[#C0564B]"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs text-[#475569]">
                <label htmlFor="slider-k">Desplazamiento vertical (k)</label>
                <span className="font-math tabular-nums">k = {formatAr(shiftK, 1)}</span>
              </div>
              <input
                id="slider-k"
                type="range"
                min={-3}
                max={3}
                step={0.5}
                value={shiftK}
                onChange={(e) => setShiftK(Number(e.target.value))}
                className="w-full accent-[#2D7A5E]"
              />
            </div>
          </div>

          {/* Visibility toggles */}
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'Exponencial', active: showExp, toggle: () => setShowExp((s) => !s) },
              { label: 'Logarítmica', active: showLog, toggle: () => setShowLog((s) => !s) },
              { label: 'Recta y = x', active: showSymmetry, toggle: () => setShowSymmetry((s) => !s) },
              { label: 'Puntos notables', active: showPoints, toggle: () => setShowPoints((s) => !s) },
            ].map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={item.toggle}
                className={`rounded-md border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  item.active
                    ? 'border-[#2D4B73] bg-[#EEF5FA] text-[#1E3A5F]'
                    : 'border-[#E3E1DA] bg-white text-[#64748B]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Dynamic Diagnosis */}
          <div className="rounded-xl border border-[#DCE8F5] bg-[#EEF5FA] p-4 text-sm leading-relaxed text-[#1E3A5F]">
            {diagnosisText}
          </div>

          {/* Swapped Table of Values */}
          {isValidBase && shiftH === 0 && shiftK === 0 && (
            <div className="overflow-x-auto rounded-xl border border-[#E3E1DA]">
              <table className="w-full text-left text-xs tabular-nums">
                <thead className="bg-[#FAF9F6] text-[#475569]">
                  <tr>
                    <th className="px-3 py-2 font-semibold">x</th>
                    <th className="px-3 py-2 font-semibold text-[#2D7A5E]">b^x</th>
                    <th className="px-3 py-2 font-semibold text-[#C0564B]">(b^x ; x) en log_b</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFECE4]">
                  {tableRows.map((row) => (
                    <tr key={row.x}>
                      <td className="px-3 py-1.5 font-math">{row.x}</td>
                      <td className="px-3 py-1.5 font-math">{formatAr(row.expY, 3)}</td>
                      <td className="px-3 py-1.5 font-math">
                        ({formatAr(row.logX, 2)}; {row.logY})
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
