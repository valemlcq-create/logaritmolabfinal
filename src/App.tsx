import { useEffect, useState } from 'react';
import { TopNavBar } from '@/src/components/layout/TopNavBar';
import { LEARNING_MODULES } from '@/src/data/modules/modules';
import { DiagnosticPage } from '@/src/pages/Diagnostic/DiagnosticPage';
import { HomePage } from '@/src/pages/Home/HomePage';
import { LabPage } from '@/src/pages/Lab/LabPage';
import { ModulesPage } from '@/src/pages/Modules/ModulesPage';
import { ProgressPage } from '@/src/pages/Progress/ProgressPage';
import { TutorPage } from '@/src/pages/Tutor/TutorPage';
import { applyAttemptToProfile } from '@/src/services/adaptive/adaptiveEngine';
import {
  loadStudentProfile,
  resetStudentProfile,
  saveStudentProfile,
} from '@/src/services/progress/storage';
import {
  AppRoute,
  Exercise,
  LearningAttempt,
  MetacognitionEntry,
  SelfAssessmentEntry,
  StudentProfile,
} from '@/src/types';

export default function App() {
  const [route, setRoute] = useState<AppRoute>('home');
  const [activeModuleId, setActiveModuleId] = useState<string>('m1');
  const [profile, setProfile] = useState<StudentProfile>(() => loadStudentProfile());

  useEffect(() => {
    saveStudentProfile(profile);
  }, [profile]);

  const handleNavigate = (nextRoute: AppRoute, moduleId?: string) => {
    if (moduleId) {
      setActiveModuleId(moduleId);
      setProfile((prev) =>
        prev.visitedModules.includes(moduleId)
          ? prev
          : { ...prev, visitedModules: [...prev.visitedModules, moduleId] }
      );
    }
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectModule = (moduleId: string) => {
    setActiveModuleId(moduleId);
    setProfile((prev) =>
      prev.visitedModules.includes(moduleId)
        ? prev
        : { ...prev, visitedModules: [...prev.visitedModules, moduleId] }
    );
    if (moduleId === 'm0') {
      setRoute('diagnostic');
    } else {
      setRoute('modules');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAttemptRecorded = (attempt: LearningAttempt, exercise: Exercise) => {
    setProfile((prev) => applyAttemptToProfile(prev, attempt, exercise.difficulty));
  };

  const handleCompleteDiagnostic = (
    score: number,
    missingPrereqs: string[],
    summary: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      diagnosticCompleted: true,
      diagnosticScore: score,
      missingPrerequisites: missingPrereqs,
      initialProfileSummary: summary,
    }));
  };

  const handleSaveMetacognition = (entry: MetacognitionEntry) => {
    setProfile((prev) => ({
      ...prev,
      metacognitionLogs: [entry, ...prev.metacognitionLogs],
    }));
  };

  const handleSaveSelfAssessment = (entry: SelfAssessmentEntry) => {
    setProfile((prev) => ({
      ...prev,
      selfAssessments: [entry, ...prev.selfAssessments],
    }));
  };

  const activeModuleTitle = LEARNING_MODULES.find(
    (m) => m.id === activeModuleId
  )?.title;

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1E293B]">
      <TopNavBar
        currentRoute={route}
        onNavigate={handleNavigate}
        profile={profile}
        activeModuleTitle={activeModuleTitle}
      />

      <main>
        {route === 'home' && (
          <HomePage profile={profile} onNavigate={handleNavigate} />
        )}

        {route === 'diagnostic' && (
          <DiagnosticPage
            profile={profile}
            onAttemptRecorded={handleAttemptRecorded}
            onCompleteDiagnostic={handleCompleteDiagnostic}
            onJumpToModule={handleSelectModule}
          />
        )}

        {route === 'modules' && (
          <ModulesPage
            activeModuleId={activeModuleId}
            onSelectModule={handleSelectModule}
            profile={profile}
            onAttemptRecorded={handleAttemptRecorded}
            onSaveMetacognition={handleSaveMetacognition}
            onSaveSelfAssessment={handleSaveSelfAssessment}
          />
        )}

        {route === 'lab' && <LabPage />}

        {route === 'progress' && (
          <ProgressPage
            profile={profile}
            onReplaceProfile={(next) => setProfile(next)}
            onResetProfile={() => setProfile(resetStudentProfile())}
            onJumpToModule={handleSelectModule}
          />
        )}

        {route === 'tutor' && <TutorPage profile={profile} />}
      </main>

      <footer className="mt-14 border-t border-[#E3E1DA] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-5 text-xs text-[#64748B] sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>
            Logaritmos: comprender, explorar y aplicar · 5.º año de secundaria (Orientación en Comunicación)
          </span>
          <span>
            Basado en el corpus disciplinar «Cerebro: conocimiento sobre logaritmos»
          </span>
        </div>
      </footer>
    </div>
  );
}
