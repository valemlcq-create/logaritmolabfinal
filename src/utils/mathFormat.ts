export function formatAr(value: number, decimals = 3): string {
  if (!Number.isFinite(value)) return 'Indefinido';
  const rounded = Number(value.toFixed(decimals));
  const [intPart, decPart] = String(rounded).split('.');
  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return decPart ? `${formattedInt},${decPart}` : formattedInt;
}

/**
 * Safely parses integers, decimals (comma or dot), and simple fractions like -4/3 or 5/2
 * without using eval().
 */
export function parseMathNumber(raw: string): number | null {
  if (!raw) return null;
  const cleaned = raw
    .trim()
    .replace(/−/g, '-')
    .replace(/\s+/g, '')
    .replace(/,/g, '.');

  if (!cleaned) return null;

  // Simple fraction a/b
  const fracMatch = cleaned.match(/^([+-]?\d+(?:\.\d+)?)\/([+-]?\d+(?:\.\d+)?)$/);
  if (fracMatch) {
    const num = Number(fracMatch[1]);
    const den = Number(fracMatch[2]);
    if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) return null;
    return num / den;
  }

  // Plain decimal/integer
  if (/^[+-]?\d+(?:\.\d+)?$/.test(cleaned)) {
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : null;
  }

  return null;
}

export function normalizeIntervalString(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .replace(/−/g, '-')
    .replace(/∞/g, 'inf')
    .replace(/∪/g, 'u')
    .replace(/,/g, ';')
    .replace(/\s+/g, '')
    .replace(/real/g, 'r')
    .replace(/ℝ/g, 'r');
}

export function parseSetValues(raw: string): number[] {
  const cleaned = raw
    .replace(/[{}[\]()]/g, '')
    .replace(/s\s*=\s*/i, '')
    .replace(/x\s*=\s*/gi, '')
    .replace(/−/g, '-')
    .trim();

  if (!cleaned) return [];
  const parts = cleaned.split(/[;|\sy,o]+/i).filter(Boolean);
  const parsed: number[] = [];
  for (const p of parts) {
    const num = parseMathNumber(p);
    if (num !== null) parsed.push(num);
  }
  return parsed;
}
