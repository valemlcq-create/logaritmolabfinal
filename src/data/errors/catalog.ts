import { ErrorPattern } from '@/src/types';

export const ERROR_CATALOG: ErrorPattern[] = [
  {
    code: 'ERR-PRE',
    name: 'Errores en potenciación, radicación o crecimiento',
    nucleusRef: 'Núcleo 1 (11.2)',
    identification:
      'Evaluar b^0 = 0, b^(-n) = −b^n, multiplicar la base por el exponente fraccionario, confundir −2^4 con (−2)^4 o modelar crecimiento multiplicativo como f(t) = a·b·t.',
    explanation:
      'El principio de permanencia exige b^0 = 1 y b^(−n) = 1/b^n; el signo negativo en el exponente invierte la base, no cambia el signo del número.',
    probableCause:
      'Concebir el exponente únicamente como conteo de multiplicaciones o aplicar reglas de la multiplicación a la potenciación.',
    hintPrompt:
      'Recuerda la secuencia de divisiones sucesivas: 2^2 = 4, 2^1 = 2, 2^0 = 1, 2^(−1) = 1/2. Cada paso divide por la base.',
    recoveryModuleId: 'm0',
    recoveryConceptId: 'c-fundamentos',
    equivalentExerciseId: 'ex-m0-2',
    transferExerciseId: 'ex-m1-1',
  },
  {
    code: 'ERR-A',
    name: 'Confundir argumento con base',
    nucleusRef: 'Núcleo 3 / 11.2',
    identification:
      'Invertir los roles de base y argumento al traducir log_b(a) = c, por ejemplo afirmar que log_2(8) = 1/3.',
    explanation:
      'En log_b(a) = c, b es la base que se eleva al exponente c para alcanzar el argumento a (b^c = a), no al revés.',
    probableCause:
      'Memorizar la notación de forma mecánica sin leerla verbalmente como pregunta por el exponente.',
    hintPrompt:
      'Lee en voz alta: «¿A qué exponente hay que elevar la base (el subíndice) para obtener el argumento?»',
    recoveryModuleId: 'm2',
    recoveryConceptId: 'c-definicion',
    equivalentExerciseId: 'ex-m2-1',
    transferExerciseId: 'ex-m2-3',
  },
  {
    code: 'ERR-B',
    name: 'Confundir logaritmo con resultado de la potencia',
    nucleusRef: 'Núcleo 3 / 11.2',
    identification:
      'Responder con b^a en lugar de buscar el exponente c tal que b^c = a (ej. decir log_2(3) = 8).',
    explanation:
      'La forma exponencial informa el resultado de la potencia; la forma logarítmica informa el exponente.',
    probableCause:
      'Pérdida del significado de logaritmo como exponente.',
    hintPrompt:
      'El logaritmo nunca es el resultado de elevar la base al argumento: el logaritmo ES el exponente desconocido en b^x = a.',
    recoveryModuleId: 'm2',
    recoveryConceptId: 'c-definicion',
    equivalentExerciseId: 'ex-m2-2',
    transferExerciseId: 'ex-m1-2',
  },
  {
    code: 'ERR-C',
    name: 'Olvidar que el argumento debe ser positivo (o rechazar logaritmos negativos)',
    nucleusRef: 'Núcleo 4 / 11.2',
    identification:
      'Aceptar argumentos ≤ 0 en ℝ o, por el contrario, descartar soluciones válidas solo porque el logaritmo da negativo (ej. log x = −2).',
    explanation:
      'Para b > 0, b^x es siempre positivo, por lo que el argumento debe ser > 0. En cambio, el exponente (el logaritmo) sí puede ser negativo, cero o positivo.',
    probableCause:
      'Confundir la restricción sobre el argumento (a > 0) con el signo del resultado c (log_b a).',
    hintPrompt:
      'Distingue dos cosas: el argumento dentro de log_b(...) debe ser > 0, pero el valor de log_b(a) puede ser negativo si el argumento está entre 0 y 1 (cuando b > 1).',
    recoveryModuleId: 'm3',
    recoveryConceptId: 'c-existencia',
    equivalentExerciseId: 'ex-m3-1',
    transferExerciseId: 'ex-m3-3',
  },
  {
    code: 'ERR-D',
    name: 'Aceptar base igual a 1',
    nucleusRef: 'Núcleo 4 / 11.2',
    identification:
      'Operar con log_1(a) como si fuera válido en ℝ.',
    explanation:
      'La función f(x) = 1^x = 1 es constante: si a ≠ 1 no existe solución, y si a = 1 hay infinitas soluciones (fallan existencia y unicidad).',
    probableCause:
      'Tratar b > 0 como única condición sobre la base olvidando b ≠ 1.',
    hintPrompt:
      'Prueba plantear 1^x = 5 y 1^x = 1: ¿existe un único exponente?',
    recoveryModuleId: 'm3',
    recoveryConceptId: 'c-existencia',
    equivalentExerciseId: 'ex-m3-2',
    transferExerciseId: 'ex-m6-5',
  },
  {
    code: 'ERR-E',
    name: 'Aceptar base negativa o nula como base válida del logaritmo real',
    nucleusRef: 'Núcleo 4 / 11.2',
    identification:
      'Evaluar log_(−2)(a) o incluir valores b ≤ 0 en el dominio de una base variable.',
    explanation:
      'Con b < 0, b^x solo existe en ℝ para racionales de denominador impar y no define intervalos continuos ni función inversa; con b = 0 no hay función exponencial invertible.',
    probableCause:
      'Pensar casos aislados como (−2)^3 = −8 sin analizar la continuidad ni la definición general en ℝ.',
    hintPrompt:
      '¿Qué sucede con (−2)^(1/2) en ℝ? Como la exponencial real exige b > 0, la base del logaritmo también.',
    recoveryModuleId: 'm3',
    recoveryConceptId: 'c-existencia',
    equivalentExerciseId: 'ex-m3-2',
    transferExerciseId: 'ex-m6-5',
  },
  {
    code: 'ERR-F',
    name: 'Ilusión de linealidad y falsas propiedades',
    nucleusRef: 'Núcleo 6 (6.5 / 11.1)',
    identification:
      'Aplicar log(x+y) = log x + log y, log x / log y = log(x/y), (log x)^2 = 2·log x o log(kx) = k·log x.',
    explanation:
      'El logaritmo transforma multiplicación en suma (L1) y potencia del argumento en multiplicación (L3). No se distribuye sobre sumas ni «se simplifica» como un factor.',
    probableCause:
      'Extender reglas lineales de la suma y multiplicación, o leer «log x» como «log por x».',
    hintPrompt:
      'Prueba con potencias de 10: compara log(10 + 10) ≈ 1,301 con log 10 + log 10 = 2.',
    recoveryModuleId: 'm4',
    recoveryConceptId: 'c-propiedades',
    equivalentExerciseId: 'ex-m4-2',
    transferExerciseId: 'ex-m4-3',
  },
  {
    code: 'ERR-G',
    name: 'Aplicar propiedades sin controlar el dominio (o igualar exponentes con distinta base)',
    nucleusRef: 'Núcleo 6.4 / 8 / 11.2',
    identification:
      'Transformar expresiones logarítmicas sin declarar restricciones previas o igualar exponentes cuando las bases son diferentes (2^x = 3^(x−1) → x = x−1).',
    explanation:
      'Las propiedades L1–L5 exigen argumentos positivos. Desarrollar reduce el dominio y condensar lo amplía.',
    probableCause:
      'Manipular símbolos de forma mecánica como en álgebra polinómica elemental.',
    hintPrompt:
      'Escribe primero las condiciones de dominio de cada término de la expresión original antes de aplicar cualquier propiedad.',
    recoveryModuleId: 'm6',
    recoveryConceptId: 'c-ecuaciones',
    equivalentExerciseId: 'ex-m6-1',
    transferExerciseId: 'ex-m6-2',
  },
  {
    code: 'ERR-H',
    name: 'Olvidar invertir la desigualdad si 0 < b < 1 u olvidar intersecar con el dominio',
    nucleusRef: 'Núcleo 9 (9.1–9.3)',
    identification:
      'Mantener el signo de la desigualdad cuando 0 < b < 1 o entregar el intervalo algebraico sin intersecarlo con el dominio.',
    explanation:
      'Cuando 0 < b < 1 la función es decreciente: a mayor argumento corresponde menor logaritmo (se invierte la desigualdad). Además, toda solución debe pertenecer al dominio original.',
    probableCause:
      'Automatismo heredado de inecuaciones lineales y olvido del comportamiento decreciente.',
    hintPrompt:
      'Verifica si la base es mayor o menor que 1 antes de despejar, y al final interseca tu intervalo con el dominio inicial.',
    recoveryModuleId: 'm6',
    recoveryConceptId: 'c-inecuaciones',
    equivalentExerciseId: 'ex-m6-6',
    transferExerciseId: 'ex-m6-7',
  },
  {
    code: 'ERR-I',
    name: 'Aceptar soluciones extrañas',
    nucleusRef: 'Núcleo 8.3 (11.2)',
    identification:
      'Incluir en el conjunto solución raíces de la ecuación condensada que anulan o vuelven negativo algún argumento original (ej. x = −7 en log_2(x+3)+log_2(x−1)=5).',
    explanation:
      'Condensar suma de logaritmos amplía el dominio (el producto de dos negativos también es positivo). Esa zona agregada produce soluciones de la ecuación transformada que no son soluciones de la original.',
    probableCause:
      'No contrastar las raíces algebraicas contra el dominio inicial ni sustituir en la ecuación original.',
    hintPrompt:
      'Sustituye cada solución candidata en la ecuación ORIGINAL: ¿todos los argumentos quedan estrictamente positivos?',
    recoveryModuleId: 'm6',
    recoveryConceptId: 'c-ecuaciones',
    equivalentExerciseId: 'ex-m6-2',
    transferExerciseId: 'ex-m8-1',
  },
  {
    code: 'ERR-J',
    name: 'Perder soluciones por una transformación incorrecta',
    nucleusRef: 'Núcleo 8.3 (11.2)',
    identification:
      'Descartar valores negativos de x sin analizar si el argumento (como x²) sí es positivo, o reducir log(x²) a 2·log x.',
    explanation:
      'El criterio de validez es que el ARGUMENTO sea positivo, no que x sea positivo. En log(x²) = log(x + 6), x = −2 hace (−2)² = 4 > 0 y −2 + 6 = 4 > 0.',
    probableCause:
      'Confundir x > 0 con «argumento > 0» o aplicar L3 sin valor absoluto.',
    hintPrompt:
      'Evalúa x = −2 en log(x²) y en log(x+6): ¿alguno de los argumentos resulta negativo o cero?',
    recoveryModuleId: 'm6',
    recoveryConceptId: 'c-ecuaciones',
    equivalentExerciseId: 'ex-m6-3',
    transferExerciseId: 'ex-m8-1',
  },
  {
    code: 'ERR-K',
    name: 'Aplicar log(x²) = 2·log x en lugar de 2·log|x|',
    nucleusRef: 'Núcleo 6.4 / 8.3',
    identification:
      'Simplificar log(x²) como 2·log x perdiendo la rama negativa del dominio (x < 0).',
    explanation:
      'log(x²) existe para todo x ≠ 0, mientras que 2·log x solo existe para x > 0. La identidad equivalente en todo el dominio es log(x²) = 2·log|x|.',
    probableCause:
      'Aplicar L3 mecánicamente sin reparar en la paridad del exponente.',
    hintPrompt:
      'Prueba x = −3 en log(x²) y en 2·log(x): ¿en qué se diferencian sus dominios?',
    recoveryModuleId: 'm4',
    recoveryConceptId: 'c-propiedades',
    equivalentExerciseId: 'ex-m4-4',
    transferExerciseId: 'ex-m6-3',
  },
  {
    code: 'ERR-L',
    name: 'Resolver algebraicamente sin verificar en la expresión original',
    nucleusRef: 'Núcleo 8 / 11.1',
    identification:
      'Dar por terminada una ecuación o inecuación al hallar x sin comprobar la igualdad ni el dominio.',
    explanation:
      'Con logaritmos las transformaciones no siempre son equivalencias; la verificación es parte constitutiva del método, no un paso opcional.',
    probableCause:
      'Hábito escolar de álgebra elemental donde casi toda transformación conserva el conjunto solución.',
    hintPrompt:
      'Completa el paso de verificación sustituyendo tu resultado en ambos miembros de la ecuación inicial.',
    recoveryModuleId: 'm6',
    recoveryConceptId: 'c-ecuaciones',
    equivalentExerciseId: 'ex-m6-1',
    transferExerciseId: 'ex-m6-4',
  },
  {
    code: 'ERR-M',
    name: 'Confundir crecimiento exponencial con crecimiento logarítmico o escalas',
    nucleusRef: 'Núcleo 7.7 / 10.4 / 10.7',
    identification:
      'Creer que el logaritmo crece rápido, que duplicar la intensidad duplica los decibeles (2 × 60 dB = 120 dB) o leer distancias iguales en escala logarítmica como aumentos iguales.',
    explanation:
      'El logaritmo crece muy lentamente (comprime órdenes de magnitud): en escala logarítmica, pasos iguales representan factores multiplicativos iguales; duplicar intensidad suma ~3 dB.',
    probableCause:
      'Interpretar escalas logarítmicas con lógica aditiva/lineal.',
    hintPrompt:
      'Recuerda: multiplicar por la base suma una constante. En dB, 10·log(2·I / I_0) = 10·log(I/I_0) + 10·log 2 ≈ +3 dB.',
    recoveryModuleId: 'm7',
    recoveryConceptId: 'c-aplicaciones',
    equivalentExerciseId: 'ex-m7-2',
    transferExerciseId: 'ex-m7-3',
  },
  {
    code: 'ERR-N',
    name: 'Interpretar gráficos intercambiando dominio, imagen o asíntota',
    nucleusRef: 'Núcleo 7.1–7.5',
    identification:
      'Atribuir asíntota horizontal y = 0 a log_b(x), asíntota vertical x = 0 a b^x, o desconocer la simetría respecto de y = x.',
    explanation:
      'Como f(x) = b^x y g(x) = log_b(x) son inversas, intercambian ejes: (0;1) ↔ (1;0), dominio ℝ ↔ (0;+∞), y asíntota horizontal y=0 ↔ asíntota vertical x=0.',
    probableCause:
      'Estudiar las curvas de memoria sin conectarlas mediante la reflexión respecto de y = x.',
    hintPrompt:
      'Explora el Laboratorio Gráfico activando la recta y = x y el par de puntos simétricos (p; q) y (q; p).',
    recoveryModuleId: 'm5',
    recoveryConceptId: 'c-funciones',
    equivalentExerciseId: 'ex-m5-1',
    transferExerciseId: 'ex-m5-2',
  },
];

export const ERROR_MAP: Record<string, ErrorPattern> = Object.fromEntries(
  ERROR_CATALOG.map((err) => [err.code, err])
);
