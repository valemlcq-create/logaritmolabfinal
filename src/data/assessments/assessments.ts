import { Assessment } from '@/src/types';

export const ASSESSMENTS: Assessment[] = [
  {
    id: 'assess-diag',
    type: 'diagnostica',
    title: 'Evaluación Diagnóstica Inicial (Módulo 0)',
    description:
      'Evalúa tus prerrequisitos sobre potenciación, radicación, jerarquía de signos y modelos de crecimiento para detectar posibles brechas antes de comenzar.',
    moduleId: 'm0',
    exerciseIds: ['ex-m0-1', 'ex-m0-2', 'ex-m0-3'],
    rubricCriteria: [
      'Aplica el principio de permanencia para exponentes nulo y negativo.',
      'Convierte exponentes racionales a radicales sin multiplicar la base.',
      'Distingue crecimiento aditivo (lineal) de crecimiento multiplicativo (exponencial).',
    ],
  },
  {
    id: 'assess-form-dominio',
    type: 'formativa',
    title: 'Control Formativo: Existencia y Propiedades',
    description:
      'Comprueba si justificas las restricciones b > 0, b ≠ 1, a > 0 y detectas falsas igualdades.',
    moduleId: 'm4',
    exerciseIds: ['ex-m3-1', 'ex-m3-2', 'ex-m4-2', 'ex-m4-4'],
    rubricCriteria: [
      'Distingue argumento positivo de logaritmo negativo.',
      'Exige b > 0 y b ≠ 1 en bases variables.',
      'Refuta ilusiones de linealidad y conserva 2·log|x|.',
    ],
  },
  {
    id: 'assess-rec-dominio',
    type: 'recuperacion',
    title: 'Ruta de Recuperación: Control del Dominio y Soluciones Extrañas',
    description:
      'Secuencia guiada activada cuando se detectan errores de dominio o aceptación de soluciones extrañas.',
    moduleId: 'm6',
    exerciseIds: ['ex-m3-3', 'ex-m6-2', 'ex-m6-3'],
    rubricCriteria: [
      'Declara el dominio antes de condensar o transformar.',
      'Distingue soluciones de la ecuación transformada vs. original.',
      'Verifica cada raíz en la expresión inicial.',
    ],
  },
  {
    id: 'assess-integradora',
    type: 'integradora',
    title: 'Evaluación Integradora Final (Módulo 8)',
    description:
      'Integra cálculo, análisis gráfico, control algebraico del dominio, argumentación y transferencia contextual.',
    moduleId: 'm8',
    exerciseIds: ['ex-m5-2', 'ex-m6-2', 'ex-m6-7', 'ex-m7-3', 'ex-m8-1', 'ex-m8-2'],
    rubricCriteria: [
      'Interpreta y traduce entre registros numérico, algebraico, gráfico y contextual.',
      'Cumple el protocolo Dominio → Transformación → Resolución → Verificación.',
      'Justifica matemáticamente por qué un procedimiento es válido o inválido.',
      'Evalúa críticamente escalas logarítmicas y límites de modelos reales.',
    ],
  },
];
