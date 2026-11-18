import { useState } from 'react';
import { ProvenanceTag } from '@/src/types';
import { ProvenanceTagText } from '@/src/components/layout/ProvenanceTagText';

interface LimitCase {
  id: string;
  label: string;
  example: string;
  expEquiv: string;
  whatFails: string;
  conclusion: string;
  provenance: ProvenanceTag;
}

const CASES: LimitCase[] = [
  {
    id: 'a-neg',
    label: 'Argumento a < 0',
    example: 'log_3(−9) = x',
    expEquiv: '3^x = −9',
    whatFails: 'Para toda base b > 0, b^x es siempre positivo (imagen (0; +∞)). Ningún exponente produce resultado negativo.',
    conclusion: 'No existe en ℝ (sin solución).',
    provenance: 'FUENTE',
  },
  {
    id: 'a-zero',
    label: 'Argumento a = 0',
    example: 'log_4(0) = x',
    expEquiv: '4^x = 0',
    whatFails: '4^x se acerca a 0 cuando x → −∞, pero nunca se anula. Es la asíntota vertical de la función logarítmica.',
    conclusion: 'No existe en ℝ (sin solución).',
    provenance: 'FUENTE',
  },
  {
    id: 'b-neg',
    label: 'Base b < 0',
    example: 'log_(−2)(8) = x',
    expEquiv: '(−2)^x = 8',
    whatFails: 'Con base negativa, b^x solo existe en ℝ para racionales irreducibles de denominador impar (p. ej. (−2)^(1/3)), nunca en intervalos continuos.',
    conclusion: 'No hay función continua ni inversa en ℝ.',
    provenance: 'CORRECCION',
  },
  {
    id: 'b-zero',
    label: 'Base b = 0',
    example: 'log_0(a) = x',
    expEquiv: '0^x = a',
    whatFails: '0^x vale 0 si x > 0 y no está definida si x ≤ 0: imposible si a ≠ 0 e indeterminado (infinitos x > 0) si a = 0.',
    conclusion: 'Sin solución o infinitas soluciones.',
    provenance: 'COMPLEMENTO',
  },
  {
    id: 'b-one',
    label: 'Base b = 1',
    example: 'log_1(5) y log_1(1)',
    expEquiv: '1^x = 5  |  1^x = 1',
    whatFails: 'f(x) = 1^x = 1 es constante: falla la existencia si a ≠ 1 (1^x ≠ 5) y falla la unicidad/inyectividad si a = 1 (sirven todos los x ∈ ℝ).',
    conclusion: 'Excluida b = 1 para garantizar existencia y unicidad.',
    provenance: 'CORRECCION',
  },
  {
    id: 'valid',
    label: 'b > 0, b ≠ 1, a > 0',
    example: 'log_2(1/8) = −3',
    expEquiv: '2^(−3) = 1/8',
    whatFails: 'Se cumplen todas las condiciones de existencia. Atención: el logaritmo (resultado) sí puede ser negativo, cero o positivo.',
    conclusion: 'Existe y es único en ℝ.',
    provenance: 'FUENTE',
  },
];

export function DomainConditionsExplorer() {
  const [active, setActive] = useState<LimitCase>(CASES[0]);

  return (
    <div className="rounded-xl border border-[#E3E1DA] bg-white p-5 sm:p-6">
      <div className="mb-4">
        <h4 className="font-display text-lg font-semibold text-[#1E293B]">
          Explorador de condiciones de existencia: ¿por qué b &gt; 0, b ≠ 1 y a &gt; 0?
        </h4>
        <p className="mt-1 text-xs text-[#526071]">
          Selecciona cada caso límite para deducir qué falla al traducir a potenciación.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        {CASES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActive(c)}
            className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
              active.id === c.id
                ? 'border-[#2D4B73] bg-[#2D4B73] text-white'
                : 'border-[#E3E1DA] bg-[#FAF9F6] text-[#334155] hover:bg-[#EFECE4]'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-[#E3E1DA] bg-[#FAF9F6] p-4 space-y-3">
        <ProvenanceTagText provenance={active.provenance} />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <p className="text-xs text-[#64748B]">Expresión analizada</p>
            <p className="font-math text-base font-semibold text-[#1E293B]">{active.example}</p>
          </div>
          <div>
            <p className="text-xs text-[#64748B]">Equivalente exponencial</p>
            <p className="font-math text-base font-semibold text-[#2D4B73]">{active.expEquiv}</p>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-[#334155]">{active.whatFails}</p>
        <p
          className={`text-sm font-semibold ${
            active.id === 'valid' ? 'text-[#2D7A5E]' : 'text-[#C0564B]'
          }`}
        >
          Conclusión: {active.conclusion}
        </p>
      </div>
    </div>
  );
}
