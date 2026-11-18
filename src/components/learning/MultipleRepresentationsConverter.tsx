import { useState } from 'react';
import { formatAr } from '@/src/utils/mathFormat';

interface Preset {
  label: string;
  base: number;
  baseLabel: string;
  exp: number;
  expLabel: string;
  resultLabel: string;
  note: string;
}

const PRESETS: Preset[] = [
  {
    label: '2^6 = 64',
    base: 2,
    baseLabel: '2',
    exp: 6,
    expLabel: '6',
    resultLabel: '64',
    note: '2 se multiplica 6 veces',
  },
  {
    label: '3^(−3) = 1/27',
    base: 3,
    baseLabel: '3',
    exp: -3,
    expLabel: '−3',
    resultLabel: '1/27',
    note: 'Exponente negativo: argumento entre 0 y 1',
  },
  {
    label: '10^5 = 100.000',
    base: 10,
    baseLabel: '10',
    exp: 5,
    expLabel: '5',
    resultLabel: '100.000',
    note: 'Cantidad de ceros de una potencia de 10',
  },
  {
    label: '5^(1/2) = √5',
    base: 5,
    baseLabel: '5',
    exp: 0.5,
    expLabel: '1/2',
    resultLabel: '√5',
    note: 'Una raíz corresponde a un exponente fraccionario',
  },
  {
    label: '(1/2)^(−3) = 8',
    base: 0.5,
    baseLabel: '1/2',
    exp: -3,
    expLabel: '−3',
    resultLabel: '8',
    note: 'Con base menor que 1, argumentos mayores que 1 dan logaritmo negativo',
  },
  {
    label: '7^0 = 1',
    base: 7,
    baseLabel: '7',
    exp: 0,
    expLabel: '0',
    resultLabel: '1',
    note: 'El logaritmo de 1 es 0 en toda base válida',
  },
];

export function MultipleRepresentationsConverter() {
  const [selected, setSelected] = useState<Preset>(PRESETS[0]);
  const [customBase, setCustomBase] = useState<number>(2);
  const [customExp, setCustomExp] = useState<number>(3);
  const [useCustom, setUseCustom] = useState(false);

  const bStr = useCustom ? formatAr(customBase, 1) : selected.baseLabel;
  const cStr = useCustom ? formatAr(customExp, 1) : selected.expLabel;
  const aVal = useCustom ? Math.pow(customBase, customExp) : 0;
  const aStr = useCustom ? formatAr(aVal, 4) : selected.resultLabel;

  return (
    <div className="rounded-xl border border-[#E3E1DA] bg-white p-5 sm:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h4 className="font-display text-lg font-semibold text-[#1E293B]">
            Conversor de representaciones múltiples
          </h4>
          <p className="text-xs text-[#526071]">
            Conecta forma exponencial, forma logarítmica y lectura verbal del exponente.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setUseCustom((v) => !v)}
          className="self-start rounded-lg border border-[#D4D1C7] bg-[#FAF9F6] px-3 py-1.5 text-xs font-medium text-[#2D4B73] hover:bg-[#EEF5FA] whitespace-nowrap"
        >
          {useCustom ? 'Ver ejemplos del Cerebro' : 'Modo libre (elegir b y c)'}
        </button>
      </div>

      {!useCustom ? (
        <div className="mb-5 flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => setSelected(p)}
              className={`rounded-lg border px-3 py-1.5 font-math text-xs font-medium transition-colors whitespace-nowrap ${
                selected.label === p.label
                  ? 'border-[#2D4B73] bg-[#2D4B73] text-white'
                  : 'border-[#E3E1DA] bg-[#FAF9F6] text-[#334155] hover:bg-[#EFECE4]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="mb-5 grid grid-cols-1 gap-4 rounded-xl border border-[#E3E1DA] bg-[#FAF9F6] p-4 sm:grid-cols-2">
          <div>
            <div className="flex justify-between text-xs font-medium text-[#334155]">
              <label htmlFor="conv-b">Base válida (b &gt; 0, b ≠ 1)</label>
              <span className="font-math">b = {formatAr(customBase, 1)}</span>
            </div>
            <input
              id="conv-b"
              type="range"
              min={0.5}
              max={10}
              step={0.5}
              value={customBase}
              onChange={(e) => {
                const v = Number(e.target.value);
                setCustomBase(v === 1 ? 1.5 : v);
              }}
              className="mt-1 w-full accent-[#2D4B73]"
            />
          </div>
          <div>
            <div className="flex justify-between text-xs font-medium text-[#334155]">
              <label htmlFor="conv-c">Exponente / Logaritmo (c)</label>
              <span className="font-math">c = {formatAr(customExp, 1)}</span>
            </div>
            <input
              id="conv-c"
              type="range"
              min={-3}
              max={5}
              step={0.5}
              value={customExp}
              onChange={(e) => setCustomExp(Number(e.target.value))}
              className="mt-1 w-full accent-[#C0564B]"
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-[#DCE8F5] bg-[#EEF5FA] p-4">
          <p className="text-xs font-medium text-[#2D4B73]">1. Forma exponencial (informa resultado)</p>
          <p className="mt-2 font-math text-lg font-semibold text-[#1E293B]">
            {bStr}^{cStr} = {aStr}
          </p>
        </div>

        <div className="rounded-xl border border-[#F5DDD9] bg-[#FDF3F1] p-4">
          <p className="text-xs font-medium text-[#C0564B]">2. Forma logarítmica (informa exponente)</p>
          <p className="mt-2 font-math text-lg font-semibold text-[#1E293B]">
            log_({bStr})({aStr}) = {cStr}
          </p>
        </div>

        <div className="rounded-xl border border-[#D4ECE1] bg-[#EFF7F2] p-4">
          <p className="text-xs font-medium text-[#2D7A5E]">3. Lectura verbal del exponente</p>
          <p className="mt-2 text-sm leading-relaxed text-[#1E293B]">
            «El exponente al que hay que elevar <span className="font-semibold">{bStr}</span> para obtener{' '}
            <span className="font-semibold">{aStr}</span> es <span className="font-semibold">{cStr}</span>.»
          </p>
        </div>
      </div>

      {!useCustom && (
        <p className="mt-3 text-xs text-[#526071]">
          <span className="font-semibold text-[#334155]">Idea clave:</span> {selected.note}.
        </p>
      )}
    </div>
  );
}
