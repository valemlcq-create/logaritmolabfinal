import { Concept, Prerequisite } from '@/src/types';

export const FUNDAMENTAL_EQUIVALENCE = {
  formula: 'log_b(a) = c  ⇔  b^c = a',
  conditions: 'b > 0,  b ≠ 1,  a > 0',
  verbal:
    'El logaritmo en base b de a es el único exponente real c al que hay que elevar la base b para obtener el argumento a.',
  transversalIdeas: [
    {
      id: 'idea-mult-add',
      title: 'Multiplicativo ↔ aditivo',
      description:
        'El logaritmo transforma productos en sumas y cocientes en restas. Simplifica cálculos, rectifica gráficos exponenciales en escala semilogarítmica y define escalas donde pasos iguales equivalen a factores iguales.',
      provenance: 'FUENTE' as const,
    },
    {
      id: 'idea-inversion',
      title: 'Inversión mutua',
      description:
        'Potenciación y logaritmación se deshacen mutuamente bajo las condiciones de validez. Cada propiedad de los logaritmos es la lectura desde el exponente de una propiedad de la potenciación.',
      provenance: 'FUENTE' as const,
    },
    {
      id: 'idea-dominio',
      title: 'Dominio como condición de existencia',
      description:
        'Las restricciones b > 0, b ≠ 1 y a > 0 no son reglas arbitrarias para memorizar: son la condición para que exista la función inversa, y explican tanto la asíntota vertical como las soluciones extrañas y la pérdida de soluciones.',
      provenance: 'FUENTE' as const,
    },
  ],
};

export const PREREQUISITES: Prerequisite[] = [
  {
    id: 'pre-exp-ext',
    conceptId: 'c-fundamentos',
    label: 'Extensión del exponente (nulo, negativo y fraccionario)',
    description:
      'Comprender por principio de permanencia que b^0 = 1 (b ≠ 0), b^(-n) = 1/b^n y b^(m/n) = ⁿ√(b^m) para b > 0.',
    masteryThreshold: 70,
  },
  {
    id: 'pre-pot-props',
    conceptId: 'c-fundamentos',
    label: 'Propiedades de la potenciación (P1–P5) y jerarquía de signos',
    description:
      'Aplicar producto/cociente de igual base, potencia de potencia y distinguir (-2)^4 = 16 de -2^4 = -16.',
    masteryThreshold: 70,
  },
  {
    id: 'pre-crecimiento',
    conceptId: 'c-crecimiento-comparado',
    label: 'Crecimiento aditivo vs. crecimiento multiplicativo',
    description:
      'Distinguir progresión aritmética (diferencia constante, f(t) = a + r·t) de progresión geométrica (razón constante, g(t) = a·q^t).',
    masteryThreshold: 70,
  },
];

export const CONCEPTS: Concept[] = [
  {
    id: 'c-fundamentos',
    nucleusNumber: 1,
    title: 'Potenciación, radicación y principio de permanencia',
    summary:
      'El logaritmo recupera un exponente: comprenderlo exige dominar qué significa un exponente natural, nulo, negativo, racional e irracional, y las propiedades P1–P5.',
    provenance: 'FUENTE',
    provenanceNote:
      'Incluye [Complemento] sobre por qué se exige base positiva b > 0 en exponentes fraccionarios y [Corrección] en notación de radicales.',
    formalFormula:
      'b^m · b^n = b^(m+n)  |  b^m : b^n = b^(m−n)  |  (b^m)^n = b^(m·n)  |  b^(m/n) = ⁿ√(b^m)',
    explanation: [
      'Cada extensión del exponente (cero, entero negativo, racional, irracional) se define para que siga valiendo la regla b^m · b^n = b^(m+n) (principio de permanencia).',
      'El exponente negativo invierte la base, no vuelve negativo al resultado: 2^(−3) = 1/8, nunca −8 ni −6.',
      'En b^(m/n) (con b > 0), el denominador n es el índice de la raíz y el numerador m es el exponente del radicando.',
      '[Complemento] Con base negativa la regla de fracciones equivalentes falla: (−8)^(1/3) = −2, pero (−8)^(2/6) = ⁶√64 = 2. Por eso b^x con x real se define solo para b > 0.',
      'Jerarquía de operaciones: la potencia precede al signo opuesto salvo paréntesis explícitos: (−2)^4 = 16, pero −2^4 = −(2^4) = −16.',
    ],
    examples: [
      {
        expression: 'A = 7^0 + (1/3)^(−2) − 16^(3/4)',
        development: '1 + 3^2 − (⁴√16)^3 = 1 + 9 − 8',
        result: '2',
      },
      {
        expression: 'B = (8/27)^(−1/3) · 5^(−1)',
        development: '(27/8)^(1/3) · 1/5 = 3/2 · 1/5',
        result: '3/10',
      },
      {
        expression: 'E = (1/8)^(−2/3) + (0,25)^(−1) − 27^(4/3)',
        development: '8^(2/3) + 4 − (³√27)^4 = 4 + 4 − 81',
        result: '−73',
      },
    ],
    counterexamples: [
      {
        falseClaim: '(a + b)^2 = a^2 + b^2',
        counterexample: '(3 + 4)^2 = 49 ≠ 3^2 + 4^2 = 25',
        correction: 'La potencia no es distributiva respecto de la suma ni de la resta.',
      },
      {
        falseClaim: '16^(3/4) = 16 · (3/4) = 12',
        counterexample: '16^(3/4) = (⁴√16)^3 = 2^3 = 8 ≠ 12',
        correction: 'El exponente fraccionario indica raíz de índice 4 y potencia 3, no multiplicación.',
      },
    ],
    representations: [
      {
        type: 'simbolica',
        label: 'Divisiones sucesivas',
        content: '2^3/2 = 2^2 = 4 → 2^2/2 = 2^1 = 2 → 2^1/2 = 2^0 = 1 → 2^0/2 = 2^(−1) = 1/2',
      },
      {
        type: 'verbal',
        label: 'Lectura conceptual',
        content: 'Restar 1 al exponente equivale a dividir por la base.',
      },
    ],
    prerequisites: [],
    commonErrorIds: ['ERR-PRE'],
  },
  {
    id: 'c-crecimiento-comparado',
    nucleusNumber: 1,
    title: 'Crecimiento aditivo vs. crecimiento multiplicativo',
    summary:
      'El puente hacia los logaritmos consiste en distinguir procesos que suman una cantidad fija de procesos que multiplican por un factor constante.',
    provenance: 'FUENTE',
    formalFormula: 'Lineal: F(t) = a + r·t   vs.   Exponencial: G(t) = a · q^t',
    explanation: [
      'En una progresión aritmética (modelo continuo lineal) son constantes las diferencias entre valores consecutivos.',
      'En una progresión geométrica (modelo continuo exponencial) son constantes los cocientes entre valores consecutivos.',
      'Un error muy frecuente es modelizar un fenómeno que se duplica cada hora como f(t) = a · b · t (lineal en t).',
    ],
    examples: [
      {
        expression: 'Lectores nota digital: Alfa (+20/h) vs Beta (×2/h), desde 10 iniciales',
        development: 'Alfa: F(t) = 10 + 20t (t=5 → 110). Beta: G(t) = 10 · 2^t (t=5 → 320).',
        result: 'En t = 5 h, Beta casi triplica a Alfa',
      },
    ],
    representations: [
      {
        type: 'tabular',
        label: 'Tabla comparativa t = 0..5',
        content: 'F(t): 10, 30, 50, 70, 90, 110 (+20) | G(t): 10, 20, 40, 80, 160, 320 (×2)',
      },
    ],
    prerequisites: ['c-fundamentos'],
    commonErrorIds: ['ERR-PRE', 'ERR-M'],
  },
  {
    id: 'c-origen',
    nucleusNumber: 2,
    title: 'Origen y necesidad del logaritmo: el exponente desconocido',
    summary:
      'En b^c = a pueden buscarse tres incógnitas. La potenciación no es conmutativa (2^5 ≠ 5^2), por eso exige dos inversas: radicación (base) y logaritmación (exponente).',
    provenance: 'FUENTE',
    provenanceNote:
      'Contiene [Corrección] en la fórmula de nuevas reproducciones por intervalo (válida para t ≥ 1) y [Complemento] histórico (Stifel, Napier 1614, Bürgi 1620, Briggs, Euler).',
    formalFormula: '100 · 3^t = 50.000  ⇒  3^t = 500  ⇒  t = log_3(500) ≈ 5,657 h',
    explanation: [
      '¿Cuánto da 2^5? (potenciación: 32). ¿Qué número elevado a la 5 da 32? (radicación: ⁵√32 = 2). ¿A qué exponente hay que elevar 2 para obtener 32? (logaritmación: log_2(32) = 5).',
      'En el documental estudiantil (100 reproducciones iniciales que se triplican cada hora), alcanzar 24.300 da 3^t = 243 = 3^5 (t = 5 h exactas).',
      'Alcanzar 50.000 exige 3^t = 500. Como 3^5 = 243 < 500 < 729 = 3^6, el exponente real existe entre 5 y 6 (acotado entre 5,5 y 5,75) y necesita nombre propio: log_3(500).',
      '[Complemento] Históricamente, Michael Stifel (s. XVI) y John Napier (1614) advirtieron que al emparejar progresión geométrica con aritmética los productos se convierten en sumas; Henry Briggs diseñó los logaritmos decimales y Euler consolidó la base e y la función inversa.',
    ],
    examples: [
      {
        expression: '100 · 3^t = 24.300',
        development: '3^t = 243 = 3^5 → por inyectividad de 3^t',
        result: 't = 5 h',
      },
      {
        expression: '100 · 3^t = 50.000',
        development: '3^t = 500 → 3^5,5 ≈ 420,9 < 500 < 3^5,75 ≈ 553,9',
        result: 't = log_3(500) ≈ 5,657 h (5 h 39 min)',
      },
    ],
    representations: [
      {
        type: 'contextual',
        label: 'Pregunta orientadora',
        content: '¿Cuántas veces (incluso no enteras) hay que multiplicar por la base para obtener el resultado?',
      },
    ],
    prerequisites: ['c-fundamentos', 'c-crecimiento-comparado'],
    commonErrorIds: ['ERR-A', 'ERR-B'],
  },
  {
    id: 'c-definicion',
    nucleusNumber: 3,
    title: 'Definición, notación, lectura e identidades fundamentales',
    summary:
      'El logaritmo de un número es un exponente. Toda equivalencia log_b(a) = c ⇔ b^c = a dice lo mismo cambiando el foco entre resultado y exponente.',
    provenance: 'FUENTE',
    formalFormula:
      'log_b(a) = c ⇔ b^c = a  (b > 0, b ≠ 1, a > 0)  |  log_b(1) = 0  |  log_b(b) = 1  |  log_b(b^x) = x  |  b^(log_b a) = a',
    explanation: [
      'Elementos: b es la base, a es el argumento (o antilogaritmo) y c es el logaritmo. Se lee «logaritmo en base b de a es igual a c».',
      '«Logaritmación» es la operación; «logaritmo» es su resultado (el exponente).',
      'Identidades fundamentales: log_b(1) = 0 (pues b^0 = 1), log_b(b) = 1 (pues b^1 = b), log_b(b^x) = x para todo x ∈ ℝ, y b^(log_b(a)) = a para todo a > 0.',
      'Notación: log a indica base 10 en secundaria (en programación/universidad suele indicar base e, conviene explicitarlo); ln a indica base e ≈ 2,71828; log_2 a o lb a indica base 2. Además, (log x)^2 = log² x es distinto de log(x²).',
      'Cuatro interpretaciones del logaritmo: operacional (cantidad de factores b), de orden de magnitud (si 10^n ≤ a < 10^(n+1), a tiene n+1 cifras enteras), estructural (productos en sumas) y funcional (inversa de b^x).',
    ],
    examples: [
      {
        expression: 'log_4(32)',
        development: '4^x = 32 → 2^(2x) = 2^5 → 2x = 5',
        result: 'x = 5/2',
      },
      {
        expression: 'log_(1/8)(16)',
        development: '(2^(−3))^x = 2^4 → −3x = 4',
        result: 'x = −4/3',
      },
      {
        expression: 'log_2(³√4)',
        development: '2^x = 2^(2/3)',
        result: 'x = 2/3',
      },
    ],
    representations: [
      {
        type: 'simbolica',
        label: 'Equivalencia bidireccional',
        content: '2^6 = 64  ⇔  log_2(64) = 6  |  (1/2)^(−3) = 8  ⇔  log_(1/2)(8) = −3',
      },
      {
        type: 'verbal',
        label: 'Lectura del exponente',
        content: 'El exponente al que hay que elevar 2 para obtener 64 es 6.',
      },
    ],
    prerequisites: ['c-origen'],
    commonErrorIds: ['ERR-A', 'ERR-B', 'ERR-C'],
  },
  {
    id: 'c-existencia',
    nucleusNumber: 4,
    title: 'Condiciones de existencia y dominio',
    summary:
      'En ℝ, log_b(a) existe y es único si y solo si b > 0, b ≠ 1 y a > 0. Cada restricción se deduce de lo que puede y no puede hacer b^x.',
    provenance: 'CORRECCION',
    provenanceNote:
      '[Corrección] en 4.2 sobre base negativa (no «saltos infinitos», sino dominio solo en racionales de denominador impar, sin intervalos) y base 1 (falla existencia para a≠1 y unicidad/inyectividad para a=1). Incluye [Complemento] de base nula b=0.',
    formalFormula: 'Dominio real de log_b(a):  b > 0,  b ≠ 1,  a > 0',
    domainCondition: 'b > 0 ∧ b ≠ 1 ∧ a > 0',
    explanation: [
      'Argumento negativo (a < 0): b^x > 0 siempre para b > 0; ningún exponente produce un número negativo.',
      'Argumento nulo (a = 0): b^x nunca se anula; cuando b > 1 y a → 0⁺, log_b(a) → −∞ (asíntota vertical).',
      '[Corrección] Base negativa (b < 0): b^x solo existe en ℝ para racionales irreducibles de denominador impar (como (−2)^(1/3)); el dominio no contiene ningún intervalo, no hay función continua ni inversa que construir.',
      '[Complemento] Base nula (b = 0): 0^x vale 0 si x > 0 y no existe si x ≤ 0 (sin solución para a ≠ 0, infinitas soluciones si a = 0).',
      '[Corrección] Base uno (b = 1): 1^x = 1 es constante; para a ≠ 1 no hay solución (falla existencia) y para a = 1 sirven infinitos x (falla unicidad/inyectividad).',
      'Atención clave: el LOGARITMO (el resultado) SÍ puede ser negativo, nulo o positivo (ej. log_2(1/8) = −3); lo que debe ser positivo es el ARGUMENTO.',
    ],
    examples: [
      {
        expression: 'Dominio de log_2(x + 3) + log_2(x − 1)',
        development: 'x + 3 > 0  y  x − 1 > 0  ⇒  x > −3  y  x > 1',
        result: '(1; +∞)',
      },
      {
        expression: 'Dominio de log_2[(x + 3)(x − 1)]',
        development: '(x + 3)(x − 1) > 0  ⇒  ambos positivos o ambos negativos',
        result: '(−∞; −3) ∪ (1; +∞) — distinto dominio que la suma',
      },
      {
        expression: 'Dominio de log_(x−1)(3 − x)',
        development: 'x − 1 > 0,  x − 1 ≠ 1,  3 − x > 0  ⇒  1 < x < 3 y x ≠ 2',
        result: '(1; 2) ∪ (2; 3)',
      },
    ],
    representations: [
      {
        type: 'algebraica',
        label: 'Tabla de restricciones',
        content: 'a < 0: sin solución | a = 0: sin solución | b < 0: no hay función | b = 0: indefinido/indet. | b = 1: constante',
      },
    ],
    prerequisites: ['c-definicion'],
    commonErrorIds: ['ERR-C', 'ERR-D', 'ERR-E', 'ERR-G'],
  },
  {
    id: 'c-sistemas',
    nucleusNumber: 5,
    title: 'Sistemas de logaritmos: decimal, natural, binario y conversión',
    summary:
      'Todas las bases válidas son proporcionales entre sí. Tres bases tienen uso privilegiado: 10 (decimal), e (natural) y 2 (binario).',
    provenance: 'COMPLEMENTO',
    provenanceNote:
      'La fuente original solo mencionaba la notación decimal; este núcleo completo fue desarrollado como [Complemento] en el Cerebro.',
    formalFormula:
      'e = lim(n→∞) (1 + 1/n)^n ≈ 2,71828  |  ln a ≈ 2,3026·log a  |  log_(1/b)(a) = −log_b(a)',
    explanation: [
      'Logaritmo decimal (base 10, log a): afín al sistema decimal; multiplicar por 10 suma 1 al logaritmo. La parte entera (característica) indica el orden de magnitud y la parte decimal (mantisa) depende de las cifras significativas.',
      'Logaritmo natural (base e ≈ 2,71828, ln a): surge del límite del interés compuesto continuo (1 + 1/n)^n y modela procesos de tasa proporcional continua P(t) = P_0·e^(kt).',
      'Logaritmo binario (base 2, log_2 n): indica cuántas veces duplicar 1 para llegar a n; es central en informática (k bits representan 2^k valores; distinguir N valores requiere ⌈log_2 N⌉ bits) y en semividas.',
      'En la calculadora científica solo suelen estar log y ln; cualquier otra base se calcula por cambio de base.',
    ],
    examples: [
      {
        expression: 'log 2 ≈ 0,30103 → log 200 y log 0,02',
        development: 'log(2 · 10^2) = 0,30103 + 2;  log(2 · 10^(−2)) = 0,30103 − 2',
        result: 'log 200 ≈ 2,30103  |  log 0,02 ≈ −1,69897',
      },
      {
        expression: 'log_3(500) con calculadora',
        development: 'log 500 / log 3 ≈ 2,69897 / 0,47712 (o ln 500 / ln 3)',
        result: '≈ 5,6568',
      },
    ],
    representations: [
      {
        type: 'numerica',
        label: 'Constantes de referencia',
        content: 'log 2 ≈ 0,30103 · log 3 ≈ 0,47712 · log e ≈ 0,43429 · ln 2 ≈ 0,69315 · ln 10 ≈ 2,30259',
      },
    ],
    prerequisites: ['c-definicion'],
    commonErrorIds: ['ERR-F', 'ERR-M'],
  },
  {
    id: 'c-propiedades',
    nucleusNumber: 6,
    title: 'Propiedades logarítmicas, demostración y límites de validez',
    summary:
      'Las propiedades L1–L5 derivan de P1–P3 y la definición. Transformar expresiones puede ampliar o reducir el dominio.',
    provenance: 'FUENTE',
    provenanceNote:
      'Incluye [Complemento] en 6.4 (validez con valor absoluto: log(x²) = 2·log|x|), 6.5 (falsas igualdades y contraejemplos) y coherencia interna de base 5 en 6.6.',
    formalFormula:
      'L1: log_b(x·y) = log_b x + log_b y  |  L2: log_b(x/y) = log_b x − log_b y  |  L3: log_b(x^k) = k·log_b x  |  L5: log_b a = log_c a / log_c b',
    domainCondition: 'b > 0, b ≠ 1, x > 0, y > 0 (en variables reales generales, usar |x| e |y| donde corresponda)',
    explanation: [
      'P1 (b^m·b^n = b^(m+n)) fundamenta L1 (logaritmo del producto = suma). P2 fundamenta L2 (cociente = resta). P3 fundamenta L3 (potencia) y L4 (raíz, k = 1/n). L3 + definición fundamenta L5 (cambio de base, donde b ≠ 1 asegura denominador no nulo).',
      'Consecuencias del cambio de base: log_b(a)·log_a(b) = 1; log_(b^k)(a) = (1/k)·log_b(a); regla de la cadena log_b(a)·log_a(c) = log_b(c).',
      '[Complemento] Condiciones de validez: desarrollar (izquierda → derecha) puede REDUCIR el dominio; condensar (derecha → izquierda) puede AMPLIARLO. En ℝ, para todo x ≠ 0 vale log(x²) = 2·log|x|.',
      '[Complemento] Lo que NO cumplen: no hay regla para log(x + y) ni log(x − y); log x / log y NO es log(x/y) (es log_y x); (log x)² NO es 2·log x.',
    ],
    examples: [
      {
        expression: '2·log 5 + log 4',
        development: 'log(5^2) + log 4 = log(25 · 4) = log 100',
        result: '2',
      },
      {
        expression: 'log_2 3 · log_3 8',
        development: 'Regla de la cadena de bases → log_2 8',
        result: '3',
      },
      {
        expression: 'Desarrollar log_2(8x^2) sin asumir x > 0',
        development: 'log_2(8) + log_2(x^2) = 3 + 2·log_2|x|',
        result: '3 + 2·log_2|x| (x ≠ 0)',
      },
    ],
    counterexamples: [
      {
        falseClaim: 'log(x + y) = log x + log y',
        counterexample: 'log(10 + 10) = log(20) ≈ 1,301 ≠ log 10 + log 10 = 2',
        correction: 'No existe fórmula general para el logaritmo de una suma.',
      },
      {
        falseClaim: 'log x / log y = log(x/y)',
        counterexample: 'log 100 / log 10 = 2/1 = 2 ≠ log(100/10) = log 10 = 1',
        correction: 'El cociente de logaritmos es cambio de base: log x / log y = log_y x.',
      },
      {
        falseClaim: 'log(x^2) = 2·log x para todo x ≠ 0',
        counterexample: 'Con x = −3: log((−3)^2) = log 9 existe, pero 2·log(−3) no existe en ℝ',
        correction: 'La versión válida para todo x ≠ 0 es log(x^2) = 2·log|x|.',
      },
    ],
    representations: [
      {
        type: 'algebraica',
        label: 'Correspondencia Potencia → Logaritmo',
        content: 'P1 (b^m·b^n = b^(m+n)) → L1 (log_b(xy) = log_b x + log_b y)',
      },
    ],
    prerequisites: ['c-existencia', 'c-sistemas'],
    commonErrorIds: ['ERR-F', 'ERR-G', 'ERR-J', 'ERR-K'],
  },
  {
    id: 'c-funciones',
    nucleusNumber: 7,
    title: 'Funciones exponencial y logarítmica e inversibilidad',
    summary:
      'f(x) = b^x y g(x) = log_b(x) son funciones inversas entre sí: sus gráficas son simétricas respecto de y = x e intercambian dominio, imagen, puntos notables y asíntotas.',
    provenance: 'CORRECCION',
    provenanceNote:
      '[Corrección] en 7.1 (asíntota horizontal y=0 hacia x→+∞ para 0<b<1) y 7.8 (rango de deslizador [-2, 5]). Incluye [Complemento] sobre intersección fuera de y=x (b=1/16), transformaciones y ritmos de crecimiento.',
    formalFormula:
      'f: ℝ → (0; +∞), f(x) = b^x   ↔   g: (0; +∞) → ℝ, g(x) = log_b(x)   (simetría respecto de y = x)',
    explanation: [
      'Función exponencial f(x) = b^x: dominio ℝ, imagen (0; +∞), pasa por (0; 1) y (1; b), asíntota horizontal y = 0 (hacia −∞ si b > 1; hacia +∞ si 0 < b < 1), cóncava hacia arriba.',
      'Función logarítmica g(x) = log_b(x): dominio (0; +∞), imagen ℝ, pasa por (1; 0) y (b; 1), raíz en x = 1, asíntota vertical x = 0.',
      'Monotonía: si b > 1 ambas crecen estrictamente; si 0 < b < 1 ambas decrecen estrictamente.',
      '[Complemento] Una función y su inversa pueden cortarse fuera de y = x cuando son decrecientes: con b = 1/16, los puntos (1/2; 1/4) y (1/4; 1/2) pertenecen a ambas gráficas.',
      '[Complemento] Ritmos de crecimiento: para b > 1 y x grande, log_b(x) < x^p < b^x (por ejemplo, log_2(1.000.000) ≈ 19,9).',
    ],
    examples: [
      {
        expression: 'g(x) = log_2(x + 3) − 1',
        development: 'Dominio (−3; +∞); asíntota x = −3; raíz log_2(x+3) = 1 → x = −1; g(0) = log_2(3) − 1 ≈ 0,585',
        result: 'Desplazada 3 a la izquierda y 1 hacia abajo',
      },
    ],
    representations: [
      {
        type: 'grafica',
        label: 'Intercambio de coordenadas',
        content: 'Si (2; 4) está en y = 2^x, entonces (4; 2) está en y = log_2(x).',
      },
    ],
    prerequisites: ['c-existencia', 'c-propiedades'],
    commonErrorIds: ['ERR-M', 'ERR-N', 'ERR-D', 'ERR-E'],
  },
  {
    id: 'c-ecuaciones',
    nucleusNumber: 8,
    title: 'Ecuaciones exponenciales y logarítmicas',
    summary:
      'Toda resolución se apoya en inyectividad e inversión, pero en ecuaciones logarítmicas es obligatorio el protocolo de 4 pasos para evitar soluciones extrañas y pérdida de soluciones.',
    provenance: 'FUENTE',
    provenanceNote:
      'Incluye [Complemento] sobre pérdida de soluciones (log(x²) = log(x+6) vs 2·log x = log(x+6)), bases distintas y base variable.',
    formalFormula:
      '1. Dominio  →  2. Transformación  →  3. Resolución algebraica  →  4. Descarte y verificación en original',
    domainCondition: 'Exponenciales: b^x > 0 (si z = b^x, exigir z > 0). Logarítmicas: argumentos > 0 y base > 0, base ≠ 1.',
    explanation: [
      'Ecuaciones exponenciales (4 métodos): igualación de bases, aplicar logaritmos, factor común b^x y sustitución cuadrática z = b^x (descartando z ≤ 0 porque b^x > 0 siempre).',
      'Ecuaciones logarítmicas — Protocolo obligatorio: (1) Determinar el dominio de validez en la ecuación original; (2) Transformar con definición, propiedades o inyectividad; (3) Resolver la ecuación algebraica; (4) Descartar valores fuera de dominio y verificar en la ecuación original.',
      '¿Por qué aparecen soluciones extrañas? Al condensar log_2(x+3) + log_2(x−1) = 5 en log_2[(x+3)(x−1)] = 5, se agrega la zona (−∞; −3) donde ambos factores son negativos («dominio agregado»). Por eso x = −7 resuelve la transformada pero no la original.',
      '[Complemento] Riesgo inverso (perder soluciones): 2·log x = log(x+6) tiene dominio x > 0 (S = {3}), pero log(x²) = log(x+6) tiene dominio x ≠ 0 y x > −6 (S = {−2; 3}). Reemplazar log(x²) por 2·log x sin valor absoluto pierde x = −2.',
    ],
    examples: [
      {
        expression: '2·9^x − 5·3^x − 3 = 0',
        development: 'z = 3^x > 0 → 2z² − 5z − 3 = 0 → z = 3 o z = −1/2 (descartado por z > 0) → 3^x = 3',
        result: 'S = {1}',
      },
      {
        expression: 'log_2(x + 3) + log_2(x − 1) = 5',
        development: 'Dominio: x > 1. Condensando: (x+3)(x−1) = 32 → x² + 2x − 35 = 0 → x = 5 o x = −7 (∉ D)',
        result: 'S = {5}',
      },
      {
        expression: 'log_x(16) = 2',
        development: 'Dominio base: x > 0 y x ≠ 1. Por definición: x² = 16 → x = 4 o x = −4 (descartado)',
        result: 'S = {4}',
      },
    ],
    representations: [
      {
        type: 'algebraica',
        label: 'Control de método según estructura',
        content: 'Suma/resta → condensar (controlar dominio original) | Bases distintas → cambio de base | Polinomio en log → sustitución u = log x',
      },
    ],
    prerequisites: ['c-propiedades', 'c-funciones'],
    commonErrorIds: ['ERR-G', 'ERR-I', 'ERR-J', 'ERR-K', 'ERR-L'],
  },
  {
    id: 'c-inecuaciones',
    nucleusNumber: 9,
    title: 'Inecuaciones y sistemas exponenciales/logarítmicos',
    summary:
      'Gobernadas por el principio de monotonía: con b > 1 el sentido de la desigualdad se conserva; con 0 < b < 1 se invierte. Siempre intersecar con el dominio.',
    provenance: 'COMPLEMENTO',
    provenanceNote:
      'Núcleo completo incorporado como [Complemento] en el Cerebro para responder «¿a partir de cuándo se supera un valor?».',
    formalFormula:
      'b > 1: log_b u < log_b v ⇔ u < v  |  0 < b < 1: log_b u < log_b v ⇔ u > v  (u, v > 0)',
    domainCondition: 'En inecuaciones logarítmicas, S = S_algebraica ∩ Dominio_original.',
    explanation: [
      'Con base b > 1 las funciones b^x y log_b x son crecientes: conservan el sentido de la desigualdad.',
      'Con base 0 < b < 1 son decrecientes: invierten el sentido de la desigualdad al despejar exponentes o argumentos.',
      'Error clásico: resolver log x + log(x − 3) ≤ 1 obteniendo [−2; 5] sin intersecar con el dominio x > 3, que da S = (3; 5].',
      'En sistemas (lineales en log x / log y, mixtos o exponenciales), se transforma cada ecuación a una relación algebraica entre exponentes o argumentos y se controla el dominio final.',
    ],
    examples: [
      {
        expression: 'log_(1/2)(x − 1) > −2',
        development: 'Dominio x > 1. Como 0 < 1/2 < 1, se invierte: x − 1 < (1/2)^(−2) = 4 → x < 5',
        result: 'S = (1; 5)',
      },
      {
        expression: 'log x + log(x − 3) ≤ 1',
        development: 'Dominio x > 3. x(x−3) ≤ 10 → −2 ≤ x ≤ 5. Intersecando con x > 3:',
        result: 'S = (3; 5]',
      },
    ],
    representations: [
      {
        type: 'grafica',
        label: 'Sentido de monotonía',
        content: 'b > 1 (sube) → conserva signo | 0 < b < 1 (baja) → invierte signo',
      },
    ],
    prerequisites: ['c-ecuaciones'],
    commonErrorIds: ['ERR-H', 'ERR-G', 'ERR-L'],
  },
  {
    id: 'c-aplicaciones',
    nucleusNumber: 10,
    title: 'Aplicaciones en Comunicación Social y ciencias',
    summary:
      'Los logaritmos despejan tiempos/pasos en procesos multiplicativos y comprimen magnitudes de muchos órdenes (decibeles, pH, Richter, escalas semilogarítmicas, informática y música).',
    provenance: 'FUENTE',
    provenanceNote:
      'Incluye [Corrección] en decibeles (nivel de intensidad sonora 10·log(I/I_0) vs presión sonora, y Weber-Fechner como modelo aproximado), [Corrección] en pH (-log[H+]), [Precisión] en lectura crítica de escalas y [Complemento] en tiempo de duplicación, semivida, interés compuesto, Richter, informática y música. Datos de General Acha marcados como [Pendiente de validación] por ser situaciones hipotéticas.',
    formalFormula:
      'T_d = log 2 / log b  |  β = 10·log(I/I_0) dB (I_0 = 10^(−12) W/m²)  |  pH = −log[H⁺]  |  log y = log k + x·log b',
    explanation: [
      'Difusión de información: N(t) = N_0·b^t; tiempo de duplicación T_d = log 2 / log b. Advertencia crítica: ningún crecimiento exponencial real dura indefinidamente; la audiencia es finita y el fenómeno se satura (modelo logístico).',
      '[Corrección] Nivel de intensidad sonora: β = 10·log(I/I_0) dB. Duplicar la intensidad NO duplica los decibeles: suma 10·log 2 ≈ 3 dB; multiplicar por 10 suma 10 dB. La ley de Weber-Fechner es un modelo psicofísico aproximado.',
      '[Precisión] Lectura crítica de gráficos en medios: ninguna escala (lineal o logarítmica) es engañosa en sí misma; la lineal muestra cantidades absolutas y la logarítmica muestra ritmos relativos (pendiente = log b). También debe distinguirse el truncamiento de ejes del uso de escala logarítmica.',
      '[Complemento] Aplicaciones interdisciplinarias: semivida (Carbono-14, T ≈ 5.730 años), interés compuesto y regla del 70, escala de pH = −log[H⁺], magnitud sísmica M = log(A/A_0), bits ⌈log_2 N⌉ y música (12·log_2(f_2/f_1) semitonos).',
    ],
    examples: [
      {
        expression: 'Estudio de radio: silencio I_1 = 10^(−10) W/m² vs programa I_2 = 10^(−4) W/m²',
        development: 'β_1 = 10·log(10^2) = 20 dB;  β_2 = 10·log(10^8) = 80 dB',
        result: 'La intensidad creció 1.000.000×, el nivel subió +60 dB',
      },
      {
        expression: 'Audiencia acumulada 10, 100, 1.000 en días 1, 2, 3',
        development: 'log(10)=1, log(100)=2, log(1000)=3 → pendiente constante igual a log(10) = 1',
        result: 'Recta en gráfico semilogarítmico',
      },
    ],
    representations: [
      {
        type: 'contextual',
        label: 'Alfabetización cuantitativa ciudadana',
        content: 'Interpretar titulares con «crecimiento del x % diario» o gráficos en escala logarítmica sin subestimar saltos de orden de magnitud.',
      },
    ],
    prerequisites: ['c-ecuaciones', 'c-inecuaciones'],
    commonErrorIds: ['ERR-M', 'ERR-N'],
  },
];

export const CURATION_NOTES_PENDING_VALIDATION = [
  'Referencias de página específicas a Activados 5 (Puerto de Palos, 2013) citadas en la planificación origen.',
  'Referencia bibliográfica exacta «GeoGebra Institute (2021). Manual de comandos...» (documentación verificable en línea).',
  'Cotejo textual con el Diseño Curricular de La Pampa (2014), Tomo II Orientación en Comunicación.',
  'Nombres y mediciones de emisoras o laboratorio de agua de General Acha (ejemplos hipotéticos ilustrativos).',
  'Valores históricos de referencia en reseña y constantes generales (semivida C-14, magnitudes sísmicas) sin cotejo externo en esta edición.',
];
