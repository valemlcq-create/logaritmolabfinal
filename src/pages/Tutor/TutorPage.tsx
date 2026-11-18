import { useState } from 'react';
import {
  askTutor,
  requestValidatedPracticeExercise,
} from '@/src/services/ai/tutorClient';
import {
  GeneratedExerciseCandidate,
} from '@/src/services/validation/mathValidator';
import { parseMathNumber } from '@/src/utils/mathFormat';
import { StudentProfile, TutorMessage, TutorMode } from '@/src/types';
import { Send, ShieldCheck, AlertCircle } from 'lucide-react';

interface TutorPageProps {
  profile: StudentProfile;
}

const STARTER_PROMPTS: Record<TutorMode, string[]> = {
  estudiante: [
    '¿Por qué el argumento de un logaritmo no puede ser negativo ni cero?',
    '¿Por qué aparece una solución extraña en log_2(x+3) + log_2(x−1) = 5?',
    '¿Cuál es la diferencia entre 2·log x = log(x+6) y log(x²) = log(x+6)?',
  ],
  docente: [
    'Analiza el perfil actual del estudiante y sugiere una intervención.',
    '¿Qué errores de dominio y linealidad conviene anticipar en Módulo 6?',
    '¿Qué correcciones disciplinares incorpora el Cerebro respecto de la fuente original?',
  ],
  evaluacion: [
    'Propón una rúbrica breve para evaluar el procedimiento en 4 pasos de una ecuación logarítmica.',
    '¿Cómo distinguir si un estudiante acertó por azar o comprende el dominio?',
  ],
};

export function TutorPage({ profile }: TutorPageProps) {
  const [mode, setMode] = useState<TutorMode>('estudiante');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<TutorMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      mode: 'estudiante',
      timestamp: new Date().toISOString(),
      content:
        'Hola. Soy tu tutor especializado en logaritmos, anclado al Cerebro disciplinar. No resolveré los ejercicios por ti de inmediato: te guiaré con preguntas sobre la equivalencia b^c = a y el control del dominio. ¿Qué duda o paso quieres revisar?',
    },
  ]);

  // Validated Dynamic Exercise Generator state
  const [genTopic, setGenTopic] = useState('cálculo por definición');
  const [genLoading, setGenLoading] = useState(false);
  const [genStatus, setGenStatus] = useState<string | null>(null);
  const [generatedEx, setGeneratedEx] = useState<GeneratedExerciseCandidate | null>(null);
  const [genAnswer, setGenAnswer] = useState('');
  const [genFeedback, setGenFeedback] = useState<string | null>(null);

  const sendQuestion = async (textToSend: string) => {
    const clean = textToSend.trim();
    if (!clean || loading) return;

    const userMsg: TutorMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      mode,
      timestamp: new Date().toISOString(),
      content: clean,
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setInput('');
    setLoading(true);

    const reply = await askTutor({
      question: clean,
      mode,
      profile,
      // El historial previo NO incluye la consulta actual (se envía aparte en `question`).
      history: messages.map((m) => ({ role: m.role, content: m.content })),
    });

    const assistantMsg: TutorMessage = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      mode,
      timestamp: new Date().toISOString(),
      content: reply.text,
      isFallback: reply.isFallback,
    };

    setMessages((prev) => [...prev, assistantMsg]);
    setLoading(false);
  };

  const handleGenerateValidated = async () => {
    setGenLoading(true);
    setGenStatus(null);
    setGeneratedEx(null);
    setGenAnswer('');
    setGenFeedback(null);

    const res = await requestValidatedPracticeExercise(genTopic);
    setGenStatus(res.note);
    if (res.validated && res.candidate) {
      setGeneratedEx(res.candidate);
    }
    setGenLoading(false);
  };

  const handleCheckGenerated = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatedEx) return;
    const parsed = parseMathNumber(genAnswer);
    if (parsed === null) {
      setGenFeedback('Ingresa un número o fracción válida (ej. 3 o 1/2).');
      return;
    }
    if (Math.abs(parsed - generatedEx.expectedNumericAnswer) <= 0.01) {
      setGenFeedback(`Correcto: ${generatedEx.explanation}`);
    } else {
      setGenFeedback(
        `Aún no coincide. Recuerda traducir a forma exponencial: ${generatedEx.base}^x = ${generatedEx.argument}.`
      );
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-[#E3E1DA] bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium text-[#2D4B73]">
            Anclado al Cerebro disciplinar · Sin invención matemática
          </p>
          <h1 className="mt-1 font-display text-2xl font-bold text-[#1E293B]">
            Tutor especializado en logaritmos
          </h1>
        </div>

        {/* 3 Modes Switcher (Sec. 26) */}
        <div className="flex items-center gap-1 rounded-lg border border-[#E3E1DA] bg-[#FAF9F6] p-1">
          {(['estudiante', 'docente', 'evaluacion'] as TutorMode[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setMode(m)}
              className={`rounded-md px-3 py-1.5 text-xs font-semibold capitalize transition-colors whitespace-nowrap ${
                mode === m
                  ? 'bg-white text-[#1E293B] shadow-sm'
                  : 'text-[#64748B] hover:text-[#1E293B]'
              }`}
            >
              Modo {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Chat Column */}
        <div className="flex flex-col rounded-2xl border border-[#E3E1DA] bg-white lg:col-span-8">
          <div className="flex flex-wrap gap-2 border-b border-[#EFECE4] bg-[#FAF9F6] p-3">
            {STARTER_PROMPTS[mode].map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => sendQuestion(prompt)}
                className="rounded-lg border border-[#E3E1DA] bg-white px-2.5 py-1.5 text-left text-xs text-[#334155] hover:border-[#2D4B73]"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4 sm:p-5 max-h-[460px]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-xl p-4 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'ml-auto max-w-[85%] bg-[#2D4B73] text-white'
                    : 'mr-auto max-w-[92%] border border-[#E3E1DA] bg-[#FAF9F6] text-[#1E293B]'
                }`}
              >
                <div className="mb-1 flex items-center justify-between text-[11px] opacity-75">
                  <span>{msg.role === 'user' ? 'Tú' : `Tutor (${msg.mode})`}</span>
                  {msg.isFallback && <span>Modo autónomo local</span>}
                </div>
                {msg.content}
              </div>
            ))}
            {loading && (
              <div className="rounded-xl border border-[#E3E1DA] bg-[#FAF9F6] p-3 text-xs text-[#64748B]">
                Analizando con el Cerebro disciplinar...
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendQuestion(input);
            }}
            className="flex gap-2 border-t border-[#EFECE4] p-3 sm:p-4"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Escribe tu consulta en modo ${mode}...`}
              className="flex-1 rounded-lg border border-[#D4D1C7] bg-[#FAF9F6] px-3.5 py-2.5 text-sm text-[#1E293B]"
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#2D4B73] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1E3A5F] disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
              Enviar
            </button>
          </form>
        </div>

        {/* Right Column: Generation -> Validation -> Presentation Panel */}
        <div className="space-y-4 lg:col-span-4">
          <div className="rounded-2xl border border-[#E3E1DA] bg-white p-5 space-y-4">
            <div>
              <h2 className="font-display text-base font-semibold text-[#1E293B]">
                Generador validado de práctica
              </h2>
              <p className="mt-1 text-xs text-[#526071]">
                Pipeline <span className="font-math">generación → validación → presentación</span>: todo ejercicio generado se verifica matemáticamente antes de mostrarse.
              </p>
            </div>

            <div>
              <label htmlFor="gen-topic" className="block text-xs font-semibold text-[#334155]">
                Tema de práctica
              </label>
              <select
                id="gen-topic"
                value={genTopic}
                onChange={(e) => setGenTopic(e.target.value)}
                className="mt-1 w-full rounded-lg border border-[#D4D1C7] bg-[#FAF9F6] px-3 py-2 text-xs text-[#1E293B]"
              >
                <option value="cálculo por definición">Cálculo por definición</option>
                <option value="logaritmos con exponente negativo o fraccionario">
                  Base fraccionaria / exponente negativo
                </option>
                <option value="cambio de base exacto">Cambio de base exacto</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleGenerateValidated}
              disabled={genLoading}
              className="w-full rounded-lg bg-[#2D7A5E] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#23614A] disabled:opacity-50"
            >
              {genLoading ? 'Generando y validando...' : 'Generar ejercicio verificado'}
            </button>

            {genStatus && (
              <div className="flex items-start gap-2 rounded-lg border border-[#E3E1DA] bg-[#FAF9F6] p-3 text-xs text-[#334155]">
                {generatedEx ? (
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#2D7A5E]" />
                ) : (
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#9A6315]" />
                )}
                <span>{genStatus}</span>
              </div>
            )}

            {generatedEx && (
              <form
                onSubmit={handleCheckGenerated}
                className="space-y-3 rounded-xl border border-[#B9DEC9] bg-[#EFF7F2] p-4"
              >
                <p className="text-xs font-semibold text-[#2D7A5E]">
                  Dominio verificado: {generatedEx.domainCondition}
                </p>
                <p className="text-sm font-semibold text-[#1E293B]">{generatedEx.statement}</p>
                <input
                  type="text"
                  value={genAnswer}
                  onChange={(e) => setGenAnswer(e.target.value)}
                  placeholder="Tu respuesta numérica..."
                  className="w-full rounded-lg border border-[#B9DEC9] bg-white px-3 py-2 font-math text-xs"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-[#2D4B73] px-3 py-1.5 text-xs font-semibold text-white"
                >
                  Comprobar
                </button>
                {genFeedback && <p className="text-xs text-[#1E293B]">{genFeedback}</p>}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
