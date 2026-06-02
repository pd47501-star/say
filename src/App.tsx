/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { TeacherData, SECTIONS, EvaluationResult, PracticeEvidence } from "./types";
import LandingPage from "./components/LandingPage";
import TeacherForm from "./components/TeacherForm";
import LikertSectionView from "./components/LikertSectionView";
import SelfEvaluationView from "./components/SelfEvaluationView";
import EvidenceView from "./components/EvidenceView";
import LoadingScreen from "./components/LoadingScreen";
import ResultsDashboard from "./components/ResultsDashboard";
import { GraduationCap, Heart } from "lucide-react";

const INITIAL_TEACHER_DATA: TeacherData = {
  nombre: "",
  apellidoPaterno: "",
  apellidoMaterno: "",
  edad: "",
  tipoExperiencia: "",
  tiempoExperiencia: "",
  licenciatura: "",
  telefono: "",
  correo: "",
  nivelEducativo: "",
  cursosRecientes: "",
  materiasEnseña: ""
};

// Order of Likert evaluation pages
const LIKERT_SECTION_KEYS = [
  "pedagogia",
  "gestion",
  "softSkills",
  "inclusion",
  "tecnologia",
  "relacionComunidad",
  "etica"
];

export default function App() {
  const [phase, setPhase] = useState<number>(0);
  const [teacherData, setTeacherData] = useState<TeacherData>(INITIAL_TEACHER_DATA);
  const [responses, setResponses] = useState<{ [key: string]: number }>({});
  const [openAnswers, setOpenAnswers] = useState<{ [key: string]: string }>({});
  const [strengthsNeeded, setStrengthsNeeded] = useState<string[]>([]);
  const [evidence, setEvidence] = useState<PracticeEvidence[]>([]);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const startEvaluation = () => {
    setPhase(1);
    scrollToTop();
  };

  const handleNextFromForm = (data: TeacherData) => {
    setTeacherData(data);
    setPhase(2); // Goes to first Likert section (pedagogia)
    scrollToTop();
  };

  const handleBackFromForm = () => {
    setPhase(0);
    scrollToTop();
  };

  const handleNextFromLikert = (sectionAnswers: { [key: string]: number }) => {
    // Merge new answers
    setResponses((prev) => ({ ...prev, ...sectionAnswers }));
    
    // Check if we are on the last Likert page
    const currentLikertIdx = phase - 2;
    if (currentLikertIdx < LIKERT_SECTION_KEYS.length - 1) {
      setPhase((p) => p + 1);
    } else {
      setPhase(9); // Transition directly to open-ended autoevaluación page
    }
    scrollToTop();
  };

  const handleBackFromLikert = () => {
    setPhase((p) => p - 1);
    scrollToTop();
  };

  const handleNextFromSelfEval = (answers: { [key: string]: string }, strengths: string[]) => {
    setOpenAnswers(answers);
    setStrengthsNeeded(strengths);
    setPhase(10); // Transition directly to simulation & evidence portal
    scrollToTop();
  };

  const handleBackFromSelfEval = () => {
    // Return to the last Likert page
    setPhase(2 + LIKERT_SECTION_KEYS.length - 1);
    scrollToTop();
  };

  const handleFinishAndSubmit = async (finalEvidence: PracticeEvidence[]) => {
    setEvidence(finalEvidence);
    setPhase(11); // Set to LoadingScreen
    setServerError(null);
    scrollToTop();

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherData,
          responses,
          openAnswers,
          strengthNeeded: strengthsNeeded,
          evidence: finalEvidence,
          strengthsNeeded
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.error || "Error de red al procesar el reporte de selección.");
      }

      const result: EvaluationResult = await response.json();
      setEvaluationResult(result);
      setPhase(12); // Done!
    } catch (error: any) {
      console.error(error);
      setServerError(error?.message || "Sucedió un error al contactar al servidor escolar. Por favor verifica tu conexión o que tu llave GEMINI_API_KEY en Secrets esté bien configurada.");
      setPhase(10); // Revert back to simulation to retry
    }
  };

  const handleBackFromEvidence = () => {
    setPhase(9);
    scrollToTop();
  };

  const handleResetEvaluation = () => {
    setPhase(0);
    setTeacherData(INITIAL_TEACHER_DATA);
    setResponses({});
    setOpenAnswers({});
    setStrengthsNeeded([]);
    setEvidence([]);
    setEvaluationResult(null);
    setServerError(null);
    scrollToTop();
  };

  const getSidebarInfo = (p: number) => {
    switch (p) {
      case 1:
        return {
          emoji: "👩‍🏫",
          badge: "Ficha de Registro",
          title: "¡Impulsa tu Futuro Docente!",
          description: "Completa tu perfil para iniciar la evaluación de habilidades pedagógicas y de mediación escolar.",
          nextStepLabel: "Conocimiento Pedagógico"
        };
      case 2:
        return {
          emoji: "📚",
          badge: "Eje Pedagógico (1/7)",
          title: "Didáctica y Aprendizaje",
          description: "Exploremos tu dominio metodológico, el diseño de clases y tus didácticas lúdicas en aula.",
          nextStepLabel: "Gestión del Aula"
        };
      case 3:
        return {
          emoji: "🏫",
          badge: "Eje Control Grupal (2/7)",
          title: "Gestión del Aula Activa",
          description: "Mide cómo estableces un clima de orden, respeto, optimización del tiempo y convivencia pacífica.",
          nextStepLabel: "Habilidades Blandas"
        };
      case 4:
        return {
          emoji: "💖",
          badge: "Eje Psicoemocional (3/7)",
          title: "Habilidades Blandas Clave",
          description: "La empatía, la escucha asertiva y el autocontrol emocional ante los conflictos diarios.",
          nextStepLabel: "Inclusión y Diversidad"
        };
      case 5:
        return {
          emoji: "🌍",
          badge: "Eje Inclusión Social (4/7)",
          title: "Igualdad y Diversidad",
          description: "Evalúa tus estrategias de equidad para atender barreras de aprendizaje y rezago escolar.",
          nextStepLabel: "Tecnología Educativa"
        };
      case 6:
        return {
          emoji: "🔌",
          badge: "Eje Innovación Digital (5/7)",
          title: "Tecnologías Aplicadas",
          description: "Pondera el uso constructivo de TIC, plataformas interactivas y recursos didácticos de vanguardia.",
          nextStepLabel: "Relación Comunitaria"
        };
      case 7:
        return {
          emoji: "🤝",
          badge: "Eje Familia & Entorno (6/7)",
          title: "Vínculo con la Comunidad",
          description: "Analiza tus habilidades de comunicación asertiva y de colaboración con padres de familia.",
          nextStepLabel: "Ética y Profesionalismo"
        };
      case 8:
        return {
          emoji: "⚖️",
          badge: "Eje Ética Escolar (7/7)",
          title: "Mejora Continua y Ética",
          description: "Tu puntualidad, el profesionalismo escolar y las ganas de seguir capacitándote como mentor.",
          nextStepLabel: "Autoevaluación Docente"
        };
      case 9:
        return {
          emoji: "✍️",
          badge: "Eje Autocrítica",
          title: "Práctica Reflexiva",
          description: "La docencia requiere introspección y autoanálisis. Compártenos tus ideas y áreas de adiestramiento.",
          nextStepLabel: "Simulación de Conflicto Escolar"
        };
      case 10:
        return {
          emoji: "🚨",
          badge: "Simulación de Convivencia",
          title: "Inteligencia Emocional Práctica",
          description: "Un estudiante se frustra y arroja sus cosas en aula. ¿Cómo intervienes y regulas la convivencia escolar?",
          nextStepLabel: "Generar Reporte Diagnóstico IA"
        };
      default:
        return {
          emoji: "🏫",
          badge: "Colegio Interactivo",
          title: "Evaluación Escolar",
          description: "Paso de inducción para la contratación del personal docente aspirante.",
          nextStepLabel: "Siguiente proceso"
        };
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fffafb] font-sans antialiased">
      
      {/* Visual background decorations in pink */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-pink-100 rounded-full blur-3xl opacity-50 -z-35 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-rose-50 rounded-full blur-3xl opacity-60 -z-35 pointer-events-none" />

      {/* Primary Header banner aligned with Vibrant Palette Design HTML */}
      <header className="no-print h-20 bg-white border-b-4 border-pink-200 flex items-center justify-between px-4 md:px-10 flex-shrink-0 shadow-xs sticky top-0 z-50">
        <button 
          type="button"
          onClick={handleResetEvaluation}
          className="flex items-center gap-3 text-left bg-transparent border-none cursor-pointer"
        >
          <div className="w-12 h-12 bg-pink-500 rounded-xl flex items-center justify-center text-white text-2.5xl font-black shadow-lg shadow-pink-200/50">
            ✏️
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-pink-600 tracking-tight italic font-display leading-none">
              EduEval <span className="text-slate-400 font-light">Plus</span>
            </h1>
            <span className="text-stone-400 block text-[9px] md:text-[10px] font-mono leading-none tracking-wider uppercase font-bold mt-1">
              Admisión Docente • Colegio Interactivo
            </span>
          </div>
        </button>

        {/* Header classroom indicators */}
        <div className="flex items-center space-x-1 sm:space-x-2.5">
          <span className="text-xs font-mono font-bold text-pink-600 bg-pink-50 border border-pink-100/50 px-2.5 py-1.5 rounded-xl hidden md:flex items-center space-x-1.5">
            <Heart className="w-3.5 h-3.5 fill-pink-500 animate-pulse text-pink-500" />
            <span>Vocación y Empatía Primero</span>
          </span>
          <span className="text-lg select-none hover:rotate-12 transition-transform cursor-help" title="Lápiz, libros, corazón, estrellas">✏️ 📚 💖</span>
        </div>
      </header>

      {/* Main Container Wrapper */}
      <main className="flex-1">
        
        {serverError && (
          <div className="max-w-4xl mx-auto px-4 pt-6 no-print">
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 font-medium text-sm text-left flex items-start gap-3">
              <span className="text-lg">❌</span>
              <div className="flex-1">
                <p><strong>Error de Procesamiento:</strong> {serverError}</p>
                <button 
                  onClick={() => handleFinishAndSubmit(evidence)}
                  className="mt-2.5 bg-red-650 bg-red-600 hover:bg-red-700 text-white rounded-xl px-4 py-1.5 text-xs font-bold cursor-pointer"
                >
                  Reintentar procesar con IA
                </button>
              </div>
            </div>
          </div>
        )}

        {phase >= 1 && phase <= 10 ? (
          /* Side-by-side Layout from Vibrant Palette when active evaluation phase is running */
          <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8 items-start">
            
            {/* Left Sidebar: Graphic illustration and dynamic metadata */}
            <div className="w-full lg:w-1/3 bg-white rounded-3xl border-4 border-pink-100 p-8 flex flex-col items-center justify-center text-center shadow-lg shadow-pink-100/50 relative overflow-hidden self-stretch lg:self-start no-print">
              <div className="absolute -top-10 -left-10 bg-pink-100/40 w-32 h-32 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -right-10 bg-rose-100/45 w-32 h-32 rounded-full blur-2xl" />
              
              <div className="w-40 h-40 bg-pink-50 rounded-full mb-6 relative flex items-center justify-center border border-pink-100 shadow-inner">
                <div className="text-7xl select-none">
                  {getSidebarInfo(phase).emoji}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-yellow-400 w-12 h-12 rounded-full border-4 border-white flex items-center justify-center text-xl shadow-md animate-pulse">
                  ✨
                </div>
              </div>
              
              <span className="text-[10px] bg-pink-50 text-pink-600 font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-pink-100 mb-3">
                {getSidebarInfo(phase).badge}
              </span>
              
              <h2 className="text-2xl font-black text-rose-950 font-display leading-tight mb-2">
                {getSidebarInfo(phase).title}
              </h2>
              <p className="text-stone-500 font-sans text-sm leading-relaxed mb-6">
                {getSidebarInfo(phase).description}
              </p>
              
              <div className="w-full space-y-4 mt-auto">
                <div className="bg-pink-50/50 p-4 rounded-2xl border-2 border-dashed border-pink-200 text-left">
                  <p className="text-[9px] font-bold text-pink-500 uppercase tracking-widest mb-1 font-mono">
                    Siguiente paso sugerido:
                  </p>
                  <p className="text-xs font-bold text-stone-700 font-sans flex items-center gap-1.5">
                    <span>⚡</span> {getSidebarInfo(phase).nextStepLabel}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Interactive Workspace Area */}
            <div className="flex-1 w-full min-w-0">
              <AnimatePresence mode="wait">
                {phase === 1 && (
                  <TeacherForm 
                     initialData={teacherData}
                     onNext={handleNextFromForm}
                     onBack={handleBackFromForm}
                  />
                )}

                {phase >= 2 && phase <= 8 && (() => {
                  const currentLikertIdx = phase - 2;
                  const currentSectionKey = LIKERT_SECTION_KEYS[currentLikertIdx];
                  const currentSection = SECTIONS[currentSectionKey];

                  return (
                    <LikertSectionView 
                      key={currentSectionKey}
                      sectionKey={currentSectionKey}
                      section={currentSection}
                      savedAnswers={responses}
                      onNext={handleNextFromLikert}
                      onBack={handleBackFromLikert}
                      currentStep={currentLikertIdx + 1}
                      totalSteps={LIKERT_SECTION_KEYS.length}
                    />
                  );
                })()}

                {phase === 9 && (
                  <SelfEvaluationView 
                    savedOpenAnswers={openAnswers}
                    savedStrengthsNeeded={strengthsNeeded}
                    onNext={handleNextFromSelfEval}
                    onBack={handleBackFromSelfEval}
                  />
                )}

                {phase === 10 && (
                  <EvidenceView 
                    savedEvidence={evidence}
                    onFinish={handleFinishAndSubmit}
                    onBack={handleBackFromEvidence}
                    isSubmitting={false}
                  />
                )}
              </AnimatePresence>
            </div>

          </div>
        ) : (
          /* Phases 0, 11, 12 render as full-width experience cards */
          <AnimatePresence mode="wait">
            {phase === 0 && <LandingPage onStart={startEvaluation} />}
            {phase === 11 && <LoadingScreen />}
            {phase === 12 && evaluationResult && (
              <ResultsDashboard 
                teacherData={teacherData}
                result={evaluationResult}
                onReset={handleResetEvaluation}
                strengthsNeeded={strengthsNeeded}
              />
            )}
          </AnimatePresence>
        )}
      </main>

      {/* Bottom Feature Bar from Vibrant Palette when active evaluation phase is running */}
      {phase >= 1 && phase <= 10 && (
        <footer className="no-print h-20 bg-pink-600 px-4 md:px-10 flex items-center justify-between text-pink-100 flex-shrink-0 sticky bottom-0 z-50">
          <div className="hidden lg:flex gap-10">
            <div className="flex items-center gap-2">
              <span className="text-yellow-300 font-sans">★</span>
              <span className="text-xs font-display font-black uppercase tracking-widest">Enfoque en Habilidades Blandas</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-300 font-sans">★</span>
              <span className="text-xs font-display font-black uppercase tracking-widest">Evaluación Pedagógica</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-yellow-300 font-sans">★</span>
              <span className="text-xs font-display font-black uppercase tracking-widest">Inclusión & Diversidad</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between lg:justify-end gap-4 w-full lg:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-pink-200">Avance:</span>
              <div className="h-3 w-28 md:w-40 bg-pink-800 rounded-full overflow-hidden border border-pink-500">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${phase === 10 ? 100 : phase * 10}%` }}
                  transition={{ duration: 0.5 }}
                  className="h-full bg-yellow-300 rounded-full"
                />
              </div>
            </div>
            <span className="text-xs font-mono font-bold whitespace-nowrap uppercase">
              {phase === 10 ? 100 : phase * 10}% COMPLETADO
            </span>
          </div>
        </footer>
      )}

      {/* Primary Decorative Footer (Excluded in printing, shown on landing/results) */}
      {(phase === 0 || phase >= 11) && (
        <footer className="no-print border-t border-pink-105 bg-white py-10 text-stone-500 text-xs mt-12">
          <div className="max-w-6xl mx-auto px-4 md:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
            
            <div className="space-y-1.5">
              <h4 className="font-display font-black text-rose-950 text-sm">Colegio Interactivo</h4>
              <p className="max-w-xs leading-relaxed text-[11px]">
                Evaluando de forma integral la vocación psicopedagógica y socioemocional de los futuros educadores de educación fundamental.
              </p>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2 text-[10px] font-mono whitespace-nowrap">
              <span className="text-stone-400 select-none uppercase font-bold">Unicorn Classroom Hub</span>
              <div className="flex space-x-1.5 text-lg animate-pulse">
                <span>🍎</span>
                <span>✏️</span>
                <span>📐</span>
                <span>🎨</span>
                <span>✈️</span>
              </div>
            </div>
          </div>
        </footer>
      )}

    </div>
  );
}
