import { LearningModule } from '@/src/types';

export const LEARNING_MODULES: LearningModule[] = [
  {
    id: 'm0',
    order: 0,
    title: 'Módulo 0 — Diagnóstico',
    subtitle: 'Potenciación, radicación y modos de crecer',
    objective:
      'Evaluar tus conocimientos previos sobre exponentes, propiedades P1–P5, jerarquía de signos y crecimiento aditivo vs. multiplicativo para personalizar tu recorrido.',
    targetNuclei: [1],
    conceptIds: ['c-fundamentos', 'c-crecimiento-comparado'],
    requiredModuleIds: [],
    estimatedMinutes: 10,
    keyQuestion:
      '¿Cómo se extienden las potencias de exponente entero y fraccionario y en qué se diferencia sumar de multiplicar?',
    activities: [
      {
        id: 'act-m0-diag',
        title: 'Evaluación diagnóstica inicial',
        type: 'diagnostico',
        description:
          'Detecta qué prerrequisitos ya dominas y construye tu perfil adaptativo inicial.',
        provenance: 'FUENTE',
      },
      {
        id: 'act-m0-repaso',
        title: 'Principio de permanencia y radicales',
        type: 'exploracion',
        description:
          'Recorrido visual por divisiones sucesivas, exponente fraccionario y jerarquía de signos.',
        provenance: 'FUENTE',
      },
    ],
  },
  {
    id: 'm1',
    order: 1,
    title: 'Módulo 1 — ¿Por qué necesitamos logaritmos?',
    subtitle: 'El problema del exponente desconocido',
    objective:
      'Descubrir la necesidad del logaritmo a partir de fenómenos donde se conoce la base y el resultado, pero la incógnita está en el exponente.',
    targetNuclei: [2],
    conceptIds: ['c-origen'],
    requiredModuleIds: ['m0'],
    estimatedMinutes: 15,
    keyQuestion:
      'Si conocemos la base y el resultado de una potencia, ¿qué operación recupera el exponente?',
    activities: [
      {
        id: 'act-m1-video',
        title: 'Difusión del documental y acotación de 3^t = 500',
        type: 'exploracion',
        description:
          'Pasa de la sucesión discreta al modelo continuo y acota el exponente real entre 5 y 6 antes de formalizar.',
        provenance: 'FUENTE',
      },
      {
        id: 'act-m1-historia',
        title: 'Las tres preguntas de una potencia y reseña histórica',
        type: 'exploracion',
        description:
          'Compara potenciación, radicación y logaritmación, y conoce su origen con Stifel, Napier, Briggs y Euler.',
        provenance: 'COMPLEMENTO',
      },
    ],
  },
  {
    id: 'm2',
    order: 2,
    title: 'Módulo 2 — Comprender el logaritmo',
    subtitle: 'Definición, lectura e identidades',
    objective:
      'Dominar la equivalencia log_b(a) = c ⇔ b^c = a, leer e interpretar verbalmente cada elemento, calcular logaritmos por definición y usar identidades.',
    targetNuclei: [3],
    conceptIds: ['c-definicion'],
    requiredModuleIds: ['m1'],
    estimatedMinutes: 20,
    keyQuestion:
      '¿Cómo se traduce una igualdad entre forma exponencial, forma logarítmica y lenguaje verbal?',
    activities: [
      {
        id: 'act-m2-conv',
        title: 'Conversor de representaciones múltiples',
        type: 'conversor',
        description:
          'Experimenta transformando b^c = a en log_b(a) = c y su interpretación verbal en tiempo real.',
        provenance: 'FUENTE',
      },
      {
        id: 'act-m2-calc',
        title: 'Cálculo por definición e identidades fundamentales',
        type: 'exploracion',
        description:
          'Practica igualación a una misma base y las 4 identidades de anulación mutua.',
        provenance: 'FUENTE',
      },
    ],
  },
  {
    id: 'm3',
    order: 3,
    title: 'Módulo 3 — Condiciones de existencia y dominio',
    subtitle: 'Por qué b > 0, b ≠ 1 y argumento > 0',
    objective:
      'Explicar desde la potenciación por qué existen las restricciones de base y argumento, y determinar dominios de expresiones con variables.',
    targetNuclei: [4],
    conceptIds: ['c-existencia'],
    requiredModuleIds: ['m2'],
    estimatedMinutes: 20,
    keyQuestion:
      '¿Por qué las condiciones b > 0, b ≠ 1 y a > 0 no son reglas arbitrarias, sino condiciones para que exista inversa?',
    activities: [
      {
        id: 'act-m3-limites',
        title: 'Laboratorio de casos límite (a ≤ 0, b < 0, b = 0, b = 1)',
        type: 'condiciones',
        description:
          'Comprueba exactamente qué falla (existencia, unicidad o continuidad en intervalos) en cada caso excluido.',
        provenance: 'CORRECCION',
      },
      {
        id: 'act-m3-dom',
        title: 'Determinación de dominios en expresiones algebraicas',
        type: 'exploracion',
        description:
          'Compara el dominio de log_2(x+3) + log_2(x−1) frente a log_2[(x+3)(x−1)].',
        provenance: 'FUENTE',
      },
    ],
  },
  {
    id: 'm4',
    order: 4,
    title: 'Módulo 4 — Sistemas de logaritmos y propiedades',
    subtitle: 'Bases 10, e, 2, cambio de base y propiedades L1–L5',
    objective:
      'Deducir L1–L5 desde las propiedades de la potenciación, dominar el cambio de base, evitar falsas igualdades y aplicar correctamente 2·log|x|.',
    targetNuclei: [5, 6],
    conceptIds: ['c-sistemas', 'c-propiedades'],
    requiredModuleIds: ['m3'],
    estimatedMinutes: 25,
    keyQuestion:
      '¿Cómo se deducen las propiedades logarítmicas desde P1–P3 y cuándo cambia el dominio al transformar?',
    activities: [
      {
        id: 'act-m4-sistemas',
        title: 'Sistemas decimal, natural (e), binario y cambio de base',
        type: 'exploracion',
        description:
          'Explora log, ln, log_2 y la aproximación de e mediante (1 + 1/n)^n.',
        provenance: 'COMPLEMENTO',
      },
      {
        id: 'act-m4-props',
        title: 'Puente P1–P3 → L1–L5 y detector de falsas igualdades',
        type: 'propiedades',
        description:
          'Contrasta con contraejemplos por qué log(x+y) ≠ log x + log y y por qué log(x²) = 2·log|x|.',
        provenance: 'COMPLEMENTO',
      },
    ],
  },
  {
    id: 'm5',
    order: 5,
    title: 'Módulo 5 — Funciones exponencial y logarítmica',
    subtitle: 'Laboratorio gráfico interactivo e inversibilidad',
    objective:
      'Explorar gráficamente f(x) = b^x y g(x) = log_b(x), su simetría respecto de y = x, asíntotas, monotonía, transformaciones y ritmos de crecimiento.',
    targetNuclei: [7],
    conceptIds: ['c-funciones'],
    requiredModuleIds: ['m4'],
    estimatedMinutes: 25,
    keyQuestion:
      '¿Cómo se refleja cada característica de b^x en su inversa log_b(x) y qué ocurre cuando b ≤ 0 o b = 1?',
    activities: [
      {
        id: 'act-m5-lab',
        title: 'Laboratorio Gráfico Interactivo (deslizador b ∈ [−2; 5])',
        type: 'laboratorio_grafico',
        description:
          'Experimenta con b > 1, 0 < b < 1, b = 1, b ≤ 0, b = 1/16, desplazamientos (h, k) y reflexión respecto de y = x.',
        provenance: 'CORRECCION',
      },
    ],
  },
  {
    id: 'm6',
    order: 6,
    title: 'Módulo 6 — Álgebra y resolución',
    subtitle: 'Ecuaciones, inecuaciones y sistemas con control del dominio',
    objective:
      'Resolver ecuaciones exponenciales/logarítmicas, inecuaciones y sistemas siguiendo obligatoriamente: Dominio → Transformación → Resolución → Verificación.',
    targetNuclei: [8, 9],
    conceptIds: ['c-ecuaciones', 'c-inecuaciones'],
    requiredModuleIds: ['m5'],
    estimatedMinutes: 30,
    keyQuestion:
      '¿Por qué aparecen soluciones extrañas al condensar y cómo evitamos perder soluciones válidas?',
    activities: [
      {
        id: 'act-m6-guia',
        title: 'Resolvedor algebraico en 4 pasos obligatorios',
        type: 'resolucion_guiada',
        description:
          'Practica ecuaciones exponenciales, logarítmicas (extrañas y pérdida de soluciones), inecuaciones y sistemas.',
        provenance: 'FUENTE',
      },
    ],
  },
  {
    id: 'm7',
    order: 7,
    title: 'Módulo 7 — Aplicaciones y transferencia',
    subtitle: 'Comunicación Social, escalas logarítmicas y ciencias',
    objective:
      'Modelizar procesos de difusión, decibeles en radio y lectura crítica de gráficos semilogarítmicos, junto con transferencias interdisciplinarias.',
    targetNuclei: [10, 12],
    conceptIds: ['c-aplicaciones'],
    requiredModuleIds: ['m6'],
    estimatedMinutes: 25,
    keyQuestion:
      '¿Qué información revela una escala logarítmica frente a una lineal y cuáles son los límites de un modelo exponencial?',
    activities: [
      {
        id: 'act-m7-escalas',
        title: 'Comparador interactivo: escala lineal vs. semilogarítmica',
        type: 'aplicacion',
        description:
          'Analiza una misma serie de audiencia en escala lineal y logarítmica y evalúa posibles distorsiones.',
        provenance: 'CORRECCION',
      },
      {
        id: 'act-m7-casos',
        title: 'Decibeles, pH, semivida, interés compuesto, bits y música',
        type: 'aplicacion',
        description:
          'Resuelve situaciones contextualizadas distinguiendo el contenido nuclear de las ampliaciones interdisciplinarias.',
        provenance: 'COMPLEMENTO',
      },
    ],
  },
  {
    id: 'm8',
    order: 8,
    title: 'Módulo 8 — Integración y desafío final',
    subtitle: 'Síntesis, evaluación integradora y metacognición',
    objective:
      'Integrar todos los registros (numérico, algebraico, funcional, gráfico y modelización), justificar procedimientos, detectar errores y reflexionar sobre tu propio aprendizaje.',
    targetNuclei: [11, 13],
    conceptIds: ['c-ecuaciones', 'c-aplicaciones', 'c-funciones'],
    requiredModuleIds: ['m7'],
    estimatedMinutes: 25,
    keyQuestion:
      '¿Puedes justificar por qué tu procedimiento es válido, detectar errores sutiles y transferir el concepto a una situación nueva?',
    activities: [
      {
        id: 'act-m8-desafio',
        title: 'Desafíos integradores de argumentación y transferencia',
        type: 'desafio_integrador',
        description:
          'Problemas de análisis de procedimientos ajenos, dominio completo, verificación y comunicación escrita.',
        provenance: 'FUENTE',
      },
    ],
  },
];
