import { ProvenanceTag } from '@/src/types';

interface ProvenanceTagTextProps {
  provenance: ProvenanceTag;
  note?: string;
}

const LABELS: Record<ProvenanceTag, { title: string; colorClass: string }> = {
  FUENTE: {
    title: 'Contenido nuclear · Fuente disciplinar',
    colorClass: 'text-[#2D4B73]',
  },
  COMPLEMENTO: {
    title: 'Ampliación disciplinar · Complemento del Cerebro',
    colorClass: 'text-[#6B4E8A]',
  },
  CORRECCION: {
    title: 'Versión corregida · Curaduría del Cerebro',
    colorClass: 'text-[#2D7A5E]',
  },
  PENDIENTE_VALIDACION: {
    title: 'Referencia ilustrativa · Pendiente de validación',
    colorClass: 'text-[#9A6315]',
  },
};

export function ProvenanceTagText({ provenance, note }: ProvenanceTagTextProps) {
  const cfg = LABELS[provenance];
  return (
    <div className="text-xs leading-relaxed text-[#526071]">
      <span className={`font-medium ${cfg.colorClass}`}>{cfg.title}</span>
      {note ? (
        <>
          <span className="mx-1.5" aria-hidden="true">
            ·
          </span>
          <span>{note}</span>
        </>
      ) : null}
    </div>
  );
}
