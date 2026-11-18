export type ProvenanceTag =
  | 'FUENTE'
  | 'COMPLEMENTO'
  | 'CORRECCION'
  | 'PENDIENTE_VALIDACION';

export type CognitiveSkillLevel =
  | 1 // Recuperación
  | 2 // Comprensión
  | 3 // Relación
  | 4 // Representación
  | 5 // Aplicación
  | 6 // Análisis
  | 7 // Argumentación
  | 8 // Evaluación
  | 9 // Transferencia
  | 10; // Metacognición

export type RepresentationType =
  | 'verbal'
  | 'simbolica'
  | 'numerica'
  | 'tabular'
  | 'grafica'
  | 'algebraica'
  | 'contextual';

export type TutorMode = 'estudiante' | 'docente' | 'evaluacion';

export type AppRoute =
  | 'home'
  | 'diagnostic'
  | 'modules'
  | 'exercises'
  | 'lab'
  | 'assessment'
  | 'progress'
  | 'tutor';

export interface Prerequisite {
  id: string;
  conceptId: string;
  label: string;
  description: string;
  masteryThreshold: number;
}

export interface RepresentationEntry {
  type: RepresentationType;
  label: string;
  content: string;
}

export interface ExampleItem {
  expression: string;
  development: string;
  result: string;
  note?: string;
}

export interface CounterexampleItem {
  falseClaim: string;
  counterexample: string;
  correction: string;
}

export interface Concept {
  id: string;
  nucleusNumber: number;
  title: string;
  summary: string;
  provenance: ProvenanceTag;
  provenanceNote?: string;
  explanation: string[];
  formalFormula?: string;
  domainCondition?: string;
  examples: ExampleItem[];
  counterexamples?: CounterexampleItem[];
  representations: RepresentationEntry[];
  prerequisites: string[];
  commonErrorIds: string[];
}

export interface ModuleActivity {
  id: string;
  title: string;
  type:
    | 'diagnostico'
    | 'exploracion'
    | 'conversor'
    | 'condiciones'
    | 'propiedades'
    | 'laboratorio_grafico'
    | 'resolucion_guiada'
    | 'aplicacion'
    | 'desafio_integrador';
  description: string;
  provenance: ProvenanceTag;
}

export interface LearningModule {
  id: string;
  order: number;
  title: string;
  subtitle: string;
  objective: string;
  targetNuclei: number[];
  conceptIds: string[];
  requiredModuleIds: string[];
  estimatedMinutes: number;
  activities: ModuleActivity[];
  keyQuestion: string;
}

export interface ErrorPattern {
  code: string;
  name: string;
  nucleusRef: string;
  identification: string;
  explanation: string;
  probableCause: string;
  hintPrompt: string;
  recoveryModuleId: string;
  recoveryConceptId: string;
  equivalentExerciseId: string;
  transferExerciseId: string;
}

export interface Hint {
  level: 1 | 2 | 3 | 4 | 5;
  type:
    | 'orientadora'
    | 'conceptual'
    | 'procedimiento'
    | 'primer_paso'
    | 'solucion_completa';
  label: string;
  content: string;
  requiresReconstruction?: boolean;
}

export interface SolutionStep {
  label: string;
  expression: string;
  justification: string;
}

export interface Solution {
  finalAnswer: string;
  domainCondition?: string;
  steps: SolutionStep[];
  verificationCheck: string;
  extraneousSolutions?: string[];
  lostSolutionsWarning?: string;
}

export interface ErrorDetectorRule {
  id: string;
  matchType:
    | 'exact_value'
    | 'text_contains'
    | 'includes_extraneous'
    | 'missing_negative_solution'
    | 'unflipped_inequality'
    | 'missing_domain_intersection';
  triggerValues: string[];
  errorCode: string;
  diagnosticNote: string;
}

export interface ValidationRule {
  kind:
    | 'numeric'
    | 'set'
    | 'interval'
    | 'expression'
    | 'choice'
    | 'equation_4step';
  expectedValues: string[];
  acceptedEquivalents?: string[];
  numericTolerance?: number;
  expectedDomain?: string;
  expectedDomainCheckValues?: number[];
  forbiddenExtraneous?: number[];
  requiresDomainInput?: boolean;
  requiresJustificationInput?: boolean;
  errorDetectors: ErrorDetectorRule[];
}

export interface ExerciseOption {
  id: string;
  label: string;
  value: string;
  detectedErrorCode?: string;
}

export interface Exercise {
  id: string;
  moduleId: string;
  conceptId: string;
  difficulty: 1 | 2 | 3 | 4 | 5;
  cognitiveSkill: CognitiveSkillLevel;
  cognitiveLabel: string;
  representation: RepresentationType;
  statement: string;
  contextNote?: string;
  inputPlaceholder?: string;
  options?: ExerciseOption[];
  requiresDomainStep: boolean;
  requiresJustification: boolean;
  justificationPrompt?: string;
  expectedAnswer: string;
  solution: Solution;
  hints: Hint[];
  commonErrors: string[];
  validationRules: ValidationRule;
  prerequisites: string[];
  evaluationCriterion: string;
  provenance: ProvenanceTag;
  reconstructionExerciseId?: string;
}

export interface Feedback {
  isValid: boolean;
  isResultCorrect: boolean;
  isDomainValid: boolean;
  isProcedureValid: boolean;
  isJustificationValid: boolean;
  summaryWhatYouDid: string;
  whatIsRight: string;
  whereProblemAppears: string;
  whyItHappens: string;
  whatToReview: string;
  retryPrompt: string;
  detectedErrorCodes: string[];
  suggestedHintLevel: number;
}

export interface LearningAttempt {
  id: string;
  exerciseId: string;
  moduleId: string;
  conceptId: string;
  timestamp: string;
  submittedAnswer: string;
  submittedDomain?: string;
  submittedJustification?: string;
  isResultCorrect: boolean;
  isDomainValid: boolean;
  isJustificationValid: boolean;
  detectedErrorCodes: string[];
  hintsUsed: number[];
  attemptNumber: number;
  durationSec: number;
}

export type ConceptMasteryStatus =
  | 'no_iniciado'
  | 'en_proceso'
  | 'necesita_recuperacion'
  | 'dominado';

export interface ProgressRecord {
  conceptId: string;
  status: ConceptMasteryStatus;
  masteryScore: number; // 0 to 100
  attemptsCount: number;
  correctCount: number;
  errorFrequencyByCode: Record<string, number>;
  lastUpdated: string;
}

export interface LearningRouteStep {
  phase:
    | 'aprendizaje'
    | 'practica'
    | 'error'
    | 'recuperacion'
    | 'nueva_practica'
    | 'dominio'
    | 'transferencia';
  label: string;
  moduleId: string;
  completed: boolean;
}

export interface LearningRoute {
  id: string;
  targetConceptId: string;
  reason: string;
  triggeredByErrorCode?: string;
  steps: LearningRouteStep[];
  createdAt: string;
}

export interface MetacognitionEntry {
  id: string;
  moduleId: string;
  timestamp: string;
  strategyUsed: string;
  whyStrategy: string;
  conditionChecked: string;
  possibleError: string;
  verificationMethod: string;
  hardestPart: string;
  needToPractice: string;
}

export interface SelfAssessmentEntry {
  id: string;
  timestamp: string;
  comprehension: number; // 1-5
  confidence: number; // 1-5
  perceivedDifficulty: number; // 1-5
  dominantStrategy: string;
  helpNeeded: string;
}

export interface Assessment {
  id: string;
  type: 'diagnostica' | 'formativa' | 'recuperacion' | 'integradora';
  title: string;
  description: string;
  moduleId?: string;
  exerciseIds: string[];
  rubricCriteria: string[];
}

export interface StudentProfile {
  id: string;
  name: string;
  profileLabel?: string; // e.g. Perfil A..F for simulation or real student
  diagnosticCompleted: boolean;
  diagnosticScore: number;
  missingPrerequisites: string[];
  initialProfileSummary: string;
  visitedModules: string[];
  completedActivities: string[];
  completedExercises: string[];
  totalCorrect: number;
  totalIncorrect: number;
  errorHistory: Record<string, number>;
  averageDifficulty: number;
  totalHintsUsed: number;
  totalTimeSec: number;
  conceptProgress: Record<string, ProgressRecord>;
  activeRecoveryRoutes: LearningRoute[];
  attempts: LearningAttempt[];
  metacognitionLogs: MetacognitionEntry[];
  selfAssessments: SelfAssessmentEntry[];
}

export interface TutorMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  mode: TutorMode;
  timestamp: string;
  provenanceUsed?: ProvenanceTag[];
  isFallback?: boolean;
}
