import { useState } from 'react';
import { formatAr } from '@/src/utils/mathFormat';
import { ProvenanceTagText } from '@/src/components/layout/ProvenanceTagText';

const FALSE_LAWS = [
  {
    id: 'sum',
    claim: 'log(x + y) = log x + log y',
    leftLabel: 'log(x + y)',
    rightLabel: 'log x + log y',
    evalLeft: (x: number, y: number) => Math.log10(x + y),
    evalRight: (x: number, y: number) => Math.log10(x) + Math.log10(y),
    truth: 'No existe fórmula general para el logaritmo de una suma. L1 aplica al PRODUCTO x·y.',
  },
  {
    id: 'quot',
    claim: 'log x / log y = log(x / y)',
    leftLabel: 'log x / log y',
    rightLabel: 'log(x / y)',
    evalLeft: (x: number, y: number) => Math.log10(x) / Math.log10(y),
    evalRight: (x: number, y: number) => Math.log10(x / y),
    truth: 'log x / log y es cambio de base (= log_y x), mientras que log(x/y) = log x − log y.',
  },
  {
    id: 'pow',
    claim: '(log x)² = 2 · log x',
    leftLabel: '(log x)²',
    rightLabel: '2 · log x',
    evalLeft: (x: number) => Math.pow(Math.log10(x), 2),
    evalRight: (x: number) => 2 * Math.log10(x),
    truth: 'L3 baja el exponente del ARGUMENTO log(x²) = 2·log|x|, nunca el exponente de todo el logaritmo.',
  },
];

export function PropertiesAndFallaciesLab() {
  const [selected, setSelected] = useState(FALSE_LAWS[0]);
  const [xVal, setXVal] = useState(100);
  const [yVal, setYVal] = useState(10);

  const leftVal = selected.evalLeft(xVal, yVal);
  const rightVal = selected.evalRight(xVal, yVal);

  return (
    <div className="rounded-xl border border-[#E3E1DA] bg-white p-5 sm:p-6 space-y-5">
      <div>
        <h4 className="font-display text-lg font-semibold text-[#1E293B]">
          Origen desde la potenciación y detector de falsas propiedades
        </h4>
        <ProvenanceTagText
          provenance="COMPLEMENTO"
          note="Prueba con valores numéricos concretos por qué las ilusiones de linealidad fallan."
        />
      </div>

      {/* P -> L Bridge Table */}
      <div className="overflow-x-auto rounded-xl border border-[#E3E1DA]">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#FAF9F6] text-[#475569]">
            <tr>
              <th className="px-3 py-2 font-semibold">Propiedad de potenciación</th>
              <th className="px-3 py-2 font-semibold">Propiedad logarítmica que fundamenta</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EFECE4] text-[#1E293B]">
            <tr>
              <td className="px-3 py-2 font-math">P1: b^m · b^n = b^(m+n)</td>
              <td className="px-3 py-2 font-math">L1: log_b(x·y) = log_b x + log_b y</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-math">P2: b^m : b^n = b^(m−n)</td>
              <td className="px-3 py-2 font-math">L2: log_b(x/y) = log_b x − log_b y</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-math">P3: (b^m)^k = b^(m·k)</td>
              <td className="px-3 py-2 font-math">L3: log_b(x^k) = k·log_b x  (L4 si k = 1/n)</td>
            </tr>
            <tr>
              <td className="px-3 py-2 font-math">L3 + definición (b ≠ 1)</td>
              <td className="px-3 py-2 font-math">L5: log_b(a) = log_c(a) / log_c(b)</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Counterexample Tester */}
      <div className="rounded-xl border border-[#E8C5BF] bg-[#FDF3F1] p-4 space-y-3">
        <p className="text-xs font-semibold text-[#C0564B]">
          Comprobador de contraejemplos (lo que los logaritmos NO cumplen)
        </p>
        <div className="flex flex-wrap gap-2">
          {FALSE_LAWS.map((law) => (
            <button
              key={law.id}
              type="button"
              onClick={() => setSelected(law)}
              className={`rounded-lg border px-3 py-1.5 font-math text-xs transition-colors ${
                selected.id === law.id
                  ? 'border-[#C0564B] bg-[#C0564B] text-white'
                  : 'border-[#E8C5BF] bg-white text-[#334155]'
              }`}
            >
              {law.claim}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs text-[#475569]">Valor de x: {xVal}</label>
            <input
              type="range"
              min={2}
              max={1000}
              step={1}
              value={xVal}
              onChange={(e) => setXVal(Number(e.target.value))}
              className="w-full accent-[#C0564B]"
            />
          </div>
          {selected.id !== 'pow' && (
            <div>
              <label className="text-xs text-[#475569]">Valor de y: {yVal}</label>
              <input
                type="range"
                min={2}
                max={500}
                step={1}
                value={yVal}
                onChange={(e) => setYVal(Number(e.target.value))}
                className="w-full accent-[#C0564B]"
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-[#E8C5BF] bg-white p-3">
            <p className="text-xs text-[#64748B]">Lado izquierdo: {selected.leftLabel}</p>
            <p className="font-math text-base font-semibold tabular-nums text-[#1E293B]">
              {formatAr(leftVal, 4)}
            </p>
          </div>
          <div className="rounded-lg border border-[#E8C5BF] bg-white p-3">
            <p className="text-xs text-[#64748B]">Lado derecho: {selected.rightLabel}</p>
            <p className="font-math text-base font-semibold tabular-nums text-[#1E293B]">
              {formatAr(rightVal, 4)}
            </p>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-[#7F1D1D]">
          <strong>Contraejemplo verificado:</strong> {formatAr(leftVal, 4)} ≠ {formatAr(rightVal, 4)}. {selected.truth}
        </p>
      </div>
    </div>
  );
}
