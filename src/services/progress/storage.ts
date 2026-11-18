import { createDefaultProfile } from '@/src/services/adaptive/adaptiveEngine';
import { StudentProfile } from '@/src/types';

const STORAGE_KEY = 'logaritmos_cea_profile_v1';

export function loadStudentProfile(): StudentProfile {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return createDefaultProfile();
    const parsed = JSON.parse(raw) as Partial<StudentProfile>;
    if (!parsed || typeof parsed !== 'object' || !parsed.conceptProgress) {
      return createDefaultProfile();
    }
    // Completa campos que falten (perfiles guardados con versiones anteriores)
    // para evitar errores al acceder a listas u objetos inexistentes.
    const defaults = createDefaultProfile();
    const merged = { ...defaults, ...parsed } as StudentProfile;
    for (const key of Object.keys(defaults) as (keyof StudentProfile)[]) {
      const def = defaults[key];
      const val = merged[key];
      if (Array.isArray(def) && !Array.isArray(val)) {
        (merged as unknown as Record<string, unknown>)[key] = def;
      } else if (def && typeof def === 'object' && !Array.isArray(def) && (val === null || typeof val !== 'object')) {
        (merged as unknown as Record<string, unknown>)[key] = def;
      }
    }
    return merged;
  } catch {
    return createDefaultProfile();
  }
}

export function saveStudentProfile(profile: StudentProfile): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // Ignore storage quota errors gracefully
  }
}

export function resetStudentProfile(): StudentProfile {
  const fresh = createDefaultProfile();
  saveStudentProfile(fresh);
  return fresh;
}
