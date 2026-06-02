/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { TeacherData, EvaluationResult } from "../types";
import { 
  Printer, 
  FileCheck, 
  Brain, 
  Compass, 
  Heart, 
  Sparkles, 
  RotateCcw, 
  User, 
  FolderLock, 
  BookOpen, 
  Mail, 
  Phone, 
  Briefcase, 
  GraduationCap,
  Sparkle,
  MessageSquare,
  Award,
  CheckCircle2,
  Clock
} from "lucide-react";

interface ResultsDashboardProps {
  teacherData: TeacherData;
  result: EvaluationResult;
  onReset: () => void;
  strengthsNeeded: string[];
}

export default function ResultsDashboard({
  teacherData,
  result,
  onReset,
  strengthsNeeded
}: ResultsDashboardProps) {
  const [activeTab, setActiveTab] = useState<"diagnostico" | "plan" | "capacitacion">("diagnostico");
  const [recruiterNotes, setRecruiterNotes] = useState("");
  const [isHired, setIsHired] = useState<boolean | null>(null);

  // Helper to format score into percentage for the visual bar (score is on scale of 1-5)
  const getPercent = (score: number) => {
    const s = Math.max(1, Math.min(5, score));
    return Math.round(((s - 0) / 5) * 100);
  };

  const categoriesTranslation: { [key: string]: { label: string; desc: string; icon: string } } = {
    pedagogia: { label: "Conocimiento Pedagógico", desc: "Didáctica y estrategias de enseñanza", icon: "📚" },
    gestion: { label: "Gestión del Aula", desc: "Orden, respeto y optimización del tiempo", icon: "🏫" },
    softSkills: { label: "Habilidades Blandas", desc: "Empatía, comunicación y autocontrol", icon: "⭐" },
    inclusion: { label: "Inclusión y Diversidad", desc: "Respeto social e igualdad de oportunidades", icon: "🌍" },
    tecnologia: { label: "Tecnología Educativa", desc: "Integración de aplicaciones y recursos digitales", icon: "🔌" },
    relacionComunidad: { label: "Relación Comunidad", desc: "Comunicación asertiva con padres", icon: "🤝" },
    etica: { label: "Ética y Profesionalismo", desc: "Puntualidad, ética y mejora continua", icon: "⚖️" }
  };

  // Determine styles based on the recommended verdict
  const getVerdictStyle = (verdict: string) => {
    const v = verdict.toLowerCase();
    if (v.includes("altamente") || v.includes("alto")) {
      return {
        bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
        badge: "bg-emerald-510 text-white",
        label: "Apto - Altamente Recomendado",
        emoji: "👑"
      };
    } else if (v.includes("no recomendado") || v.includes("rechazar")) {
      return {
        bg: "bg-rose-50 border-rose-201 text-rose-800",
        badge: "bg-rose-500 text-white",
        label: "No Recomendado por el momento",
        emoji: "⏳"
      };
    } else {
      return {
        bg: "bg-amber-50 border-amber-200 text-amber-800",
        badge: "bg-amber-500 text-white",
        label: "Recomendado con Capacitación",
        emoji: "📝"
      };
    }
  };

  const verdictConfig = getVerdictStyle(result.generalVerdict);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto px-4 py-8"
    >
      
      {/* Action panel (Floating & printable-excluded) */}
      <div className="no-print flex flex-col sm:flex-row justify-between items-center bg-white border border-pink-100 rounded-3xl p-4 mb-8 shadow-md gap-4">
        <div className="flex items-center space-x-3 text-left">
          <div className="p-2.5 bg-pink-50 rounded-xl text-pink-600">
            <Printer className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="font-display font-extrabold text-stone-800 text-sm">Reporte Final Listo</h4>
            <p className="text-stone-500 text-xs">Imprime o guarda en PDF para tu expediente escolar.</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center space-x-2 bg-pink-650 hover:bg-pink-700 bg-pink-600 text-white font-display font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer shadow-xs w-full sm:w-auto"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Reporte</span>
          </button>
          
          <button
            onClick={onReset}
            className="flex items-center justify-center space-x-2 border border-pink-200 text-pink-700 hover:bg-pink-50 font-display font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer w-full sm:w-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Nueva Evaluación</span>
          </button>
        </div>
      </div>

      {/* Primary Report Card (Formatted for Print) */}
      <div className="bg-white rounded-3xl border border-pink-110 shadow-2xl overflow-hidden p-6 md:p-12 space-y-10 border-pink-100">
        
        {/* Printable top header banner */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-stone-100 gap-6">
          <div className="text-left space-y-1">
            <span className="text-[10px] text-pink-600 font-mono font-bold tracking-widest uppercase bg-pink-50 border border-pink-100 px-2 py-0.5 rounded">
              Expediente Digital IA de Selección
            </span>
            <h1 className="font-display font-black text-rose-950 text-3xl md:text-3.5xl">
              Reporte de Evaluación Docente
            </h1>
            <p className="text-stone-500 text-xs">
              Admisión para Educación Básica e Infantil • ID Evaluación: #{(teacherData.nombre.charCodeAt(0) || 12) * 5821}
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-pink-50 border border-pink-100 rounded-2xl p-3">
            <span className="text-3xl">🎓</span>
            <div className="text-left">
              <h3 className="font-display font-black text-xs text-rose-950">COLEGIO INTERACTIVO</h3>
              <p className="text-[10px] text-stone-500 uppercase tracking-wider font-mono">Básico & Primaria</p>
            </div>
          </div>
        </div>

        {/* Candidate Information Card */}
        <div className="bg-pink-50/15 border border-pink-100/50 rounded-3xl p-6 md:p-8 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Avatar and name section */}
          <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-r border-stone-100">
            <div className="w-16 h-16 bg-pink-100 border-2 border-pink-200 text-pink-700 rounded-2xl flex items-center justify-center font-display font-extrabold text-2xl mb-3 shadow-inner">
              {teacherData.nombre.charAt(0)}{teacherData.apellidoPaterno.charAt(0)}
            </div>
            <h2 className="font-display font-extrabold text-lg text-rose-950">
              {teacherData.nombre} <br />
              <span className="text-pink-700 font-bold text-sm">
                {teacherData.apellidoPaterno} {teacherData.apellidoMaterno}
              </span>
            </h2>
            <p className="text-[11px] font-mono font-semibold text-stone-400 mt-1 uppercase">
              Docente Aspirante
            </p>
          </div>

          {/* Core Info Grid */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left text-sm self-center font-sans">
            <div className="flex items-center space-x-2.5">
              <GraduationCap className="h-4.5 w-4.5 text-pink-500 shrink-0" />
              <span className="text-stone-700 truncate">
                <strong>Formación:</strong> {teacherData.licenciatura}
              </span>
            </div>

            <div className="flex items-center space-x-2.5">
              <Briefcase className="h-4.5 w-4.5 text-pink-500 shrink-0" />
              <span className="text-stone-700 truncate">
                <strong>Nivel:</strong> {teacherData.nivelEducativo}
              </span>
            </div>

            <div className="flex items-center space-x-2.5">
              <Clock className="h-4.5 w-4.5 text-pink-500 shrink-0" />
              <span className="text-stone-700 truncate">
                <strong>Experiencia:</strong> {teacherData.tiempoExperiencia}
              </span>
            </div>

            <div className="flex items-center space-x-2.5">
              <BookOpen className="h-4.5 w-4.5 text-pink-500 shrink-0" />
              <span className="text-stone-700 truncate">
                <strong>Materias:</strong> {teacherData.materiasEnseña || "Polivalente / General"}
              </span>
            </div>

            <div className="flex items-center space-x-2.5">
              <Mail className="h-4.5 w-4.5 text-pink-500 shrink-0" />
              <span className="text-stone-700 truncate">
                <a href={`mailto:${teacherData.correo}`} className="hover:underline">{teacherData.correo}</a>
              </span>
            </div>

            <div className="flex items-center space-x-2.5">
              <Phone className="h-4.5 w-4.5 text-pink-500 shrink-0" />
              <span className="text-stone-700">
                <strong>Teléfono:</strong> {teacherData.telefono}
              </span>
            </div>

            <div className="sm:col-span-2 border-t border-pink-50 pt-2 text-xs text-stone-500 mt-1">
              <strong>Diplomados declarados:</strong> {teacherData.cursosRecientes || "Ninguno registrado recientemente."}
            </div>
          </div>

        </div>

        {/* Verdict Box */}
        <div className={`border-2 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all ${verdictConfig.bg}`}>
          <div className="text-left space-y-1.5 flex-1">
            <span className={`inline-block font-mono text-[10px] font-bold uppercase py-0.5 px-2.5 rounded-full ${verdictConfig.badge}`}>
              VEREDICTO DE ADMISIÓN
            </span>
            <h3 className="font-display font-extrabold text-xl text-rose-950 flex items-center gap-1.5">
              <span>{verdictConfig.emoji}</span>
              <span>{verdictConfig.label}</span>
            </h3>
            <p className="text-xs text-stone-700 leading-relaxed font-sans">
              {result.generalVerdict}
            </p>
          </div>

          <div className="bg-white border rounded-2xl p-4 text-center shrink-0 min-w-32 shadow-xs ring-4 ring-pink-50/50">
            <p className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-wider">
              Score General
            </p>
            <h4 className="font-display font-black text-4xl text-rose-900 mt-1">
              {result.overallScore.toFixed(1)}
              <span className="text-xs text-stone-400 font-normal"> / 5.0</span>
            </h4>
          </div>
        </div>

        {/* Split Section: Metrics vs Soft Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Quantitative Metrics (Left) */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div>
              <h3 className="font-display font-extrabold text-rose-950 text-lg flex items-center space-x-2">
                <span>📊</span>
                <span>Desempeño Cualitativo</span>
              </h3>
              <p className="text-stone-500 text-xs">Evaluación por ejes clave pedagógicos e interpersonales.</p>
            </div>

            <div className="bg-white space-y-5">
              {Object.entries(result.scoresByCategory).map(([key, score]) => {
                const config = categoriesTranslation[key] || { label: key, desc: "", icon: "📌" };
                const isSoft = key === "softSkills";
                const barPercent = getPercent(score);

                return (
                  <div key={key} className="space-y-1.5">
                    <div className="flex justify-between items-end text-xs">
                      <div className="font-sans leading-tight">
                        <span className="mr-1.5">{config.icon}</span>
                        <strong className="text-stone-800">{config.label}</strong>
                        {isSoft && (
                          <span className="ml-1 text-[9px] font-mono text-pink-600 bg-pink-50 border border-pink-200 px-1 py-0.2 rounded font-bold uppercase animate-pulse">
                            ¡Muy Importante! ⭐
                          </span>
                        )}
                      </div>
                      <span className="font-mono font-bold text-rose-950 bg-pink-50 px-2 py-0.5 rounded">
                        {score.toFixed(1)} / 5.0
                      </span>
                    </div>

                    <div className="w-full bg-stone-100 rounded-full h-3.5 overflow-hidden border border-stone-200/55 p-[1px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${barPercent}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className={`h-full rounded-full ${
                          isSoft ? "bg-gradient-to-r from-pink-500 to-rose-600 shadow-xs" : "bg-pink-500"
                        }`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Habilidades Blandas Focal Spotlight (Right) */}
          <div className="lg:col-span-6 p-6 md:p-8 bg-rose-50/45 border-2 border-dashed border-pink-200 rounded-3xl space-y-4 text-left relative">
            <div className="absolute top-4 right-4 text-xl text-pink-400 opacity-60">💖</div>
            
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-pink-600 shrink-0 fill-pink-500" />
              <h3 className="font-display font-extrabold text-rose-950 text-lg">
                Foco Primario: Habilidades Blandas
              </h3>
            </div>

            <p className="text-stone-700 text-sm leading-relaxed font-sans">
              {result.softSkillsAnalysis}
            </p>

            <div className="p-3.5 bg-white border border-pink-100 rounded-2xl flex items-center space-x-3 text-stone-600 text-[11px] leading-relaxed">
              <Sparkles className="w-6 h-6 text-yellow-500 shrink-0" />
              <p>
                <strong>Nota del Reclutador:</strong> Las habilidades blandas predicen la permanencia voluntaria, la mediación escolar inclusiva y la excelente relación con las familias.
              </p>
            </div>
          </div>

        </div>

        {/* Tabbed Interactive Information */}
        <div className="border border-pink-100 rounded-3xl overflow-hidden bg-white">
          
          {/* Tab Selector Headers (Excluded in printing, shown as stacked lists inside print style) */}
          <div className="no-print bg-pink-50/50 flex border-b border-pink-100 font-display">
            <button
              onClick={() => setActiveTab("diagnostico")}
              className={`flex-1 py-4 text-center text-sm font-bold border-r border-pink-100 tracking-tight transition-all cursor-pointer ${
                activeTab === "diagnostico" ? "bg-white text-pink-700 shadow-xs ring-t-2 ring-pink-500" : "text-stone-600 hover:bg-pink-50/20"
              }`}
            >
              🔍 Diagnóstico y Consejos
            </button>
            <button
              onClick={() => setActiveTab("plan")}
              className={`flex-1 py-4 text-center text-sm font-bold border-r border-pink-100 tracking-tight transition-all cursor-pointer ${
                activeTab === "plan" ? "bg-white text-pink-700 shadow-xs ring-t-2 ring-pink-500" : "text-stone-600 hover:bg-pink-50/20"
              }`}
            >
              📋 Plan de Acción
            </button>
            <button
              onClick={() => setActiveTab("capacitacion")}
              className={`flex-1 py-4 text-center text-sm font-bold tracking-tight transition-all cursor-pointer ${
                activeTab === "capacitacion" ? "bg-white text-pink-700 shadow-xs ring-t-2 ring-pink-500" : "text-stone-600 hover:bg-pink-50/20"
              }`}
            >
              🏫 Aladiestramiento Docente
            </button>
          </div>

          {/* Tab Content Block */}
          <div className="p-6 md:p-8 space-y-6 text-left">
            
            {/* Tab 1: Diagnóstico */}
            {(activeTab === "diagnostico" || true) && (
              <div className={`${activeTab !== "diagnostico" ? "hidden md:hidden print:block" : "block"} space-y-6`}>
                <div className="print-only mb-4 border-b pb-2">
                  <h4 className="font-display font-extrabold text-sm uppercase text-pink-700">🔍 Diagnóstico y Consejos Escolares</h4>
                </div>
                
                <div className="space-y-4">
                  <div className="p-4 bg-pink-50/20 border border-pink-100/40 rounded-2xl">
                    <h4 className="font-display font-bold text-rose-950 text-sm mb-1.5 flex items-center gap-1.5">
                      <span>📖</span> Insights Pedagógicos y Didáctica:
                    </h4>
                    <p className="text-stone-600 text-xs md:text-sm leading-relaxed font-sans">
                      {result.pedagogicalInsights}
                    </p>
                  </div>

                  <div className="p-4 bg-pink-50/20 border border-pink-100/40 rounded-2xl">
                    <h4 className="font-display font-bold text-rose-950 text-sm mb-1.5 flex items-center gap-1.5">
                      <span>🎒</span> Estrategia para la Gestión de Aula:
                    </h4>
                    <p className="text-stone-600 text-xs md:text-sm leading-relaxed font-sans">
                      {result.classroomManagementTips}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Plan de Acción */}
            {(activeTab === "plan" || true) && (
              <div className={`${activeTab !== "plan" ? "hidden md:hidden print:block" : "block"} space-y-4`}>
                <div className="print-only mb-4 border-b pb-2 mt-6">
                  <h4 className="font-display font-extrabold text-sm uppercase text-pink-700">📋 Plan de Acción de Inducción</h4>
                </div>
                
                <h4 className="text-xs text-stone-500 mb-1 leading-snug">
                  Pasos sugeridos para maximizar su adiestramiento e integración asertiva en la escuela durante su primera quincena contratado:
                </h4>

                <div className="space-y-3">
                  {result.suggestedActionPlan.map((step, i) => (
                    <motion.div 
                      key={i}
                      initial={{ x: -10 }}
                      animate={{ x: 0 }}
                      className="flex items-start space-x-3.5 p-3.5 bg-stone-50 border border-stone-100 rounded-2xl hover:bg-stone-50/40"
                    >
                      <span className="flex items-center justify-center bg-pink-600 text-white text-[11px] font-mono font-bold w-5.5 h-5.5 rounded-lg shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <p className="text-stone-700 text-xs md:text-sm leading-relaxed font-sans">
                        {step}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Cursos y Capacitaciones */}
            {(activeTab === "capacitacion" || true) && (
              <div className={`${activeTab !== "capacitacion" ? "hidden md:hidden print:block" : "block"} space-y-6`}>
                <div className="print-only mb-4 border-b pb-2 mt-6">
                  <h4 className="font-display font-extrabold text-sm uppercase text-pink-700">🏫 Cursos y Certificaciones Recomendadas</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Recommended Certifications */}
                  <div className="space-y-4">
                    <h4 className="font-display font-bold text-rose-950 text-sm flex items-center gap-1.5 border-b border-pink-50 pb-2">
                      <Award className="w-5 h-5 text-pink-600 shrink-0" />
                      <span>Ejes Formativos Sugeridos para Admisión:</span>
                    </h4>

                    <div className="space-y-3">
                      {result.recommendedCertifications.map((cert, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-stone-700 text-xs md:text-sm">
                          <CheckCircle2 className="w-4.5 h-4.5 text-pink-600 shrink-0 mt-0.5" />
                          <span className="font-medium font-sans">{cert}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Areas analysis */}
                  <div className="bg-pink-50/10 p-5 rounded-3xl border border-pink-100 space-y-3">
                    <h4 className="font-display font-bold text-rose-950 text-sm flex items-center gap-1.5">
                      <span>🛠️</span> Recuento Diagnóstico / Autoevaluado:
                    </h4>
                    
                    <p className="text-stone-600 text-xs leading-relaxed font-sans">
                      {result.strengtheningNeedsAnalysis}
                    </p>

                    {strengthsNeeded.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[10px] text-stone-400 font-mono uppercase font-bold">Solicitudes de apoyo:</span>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {strengthsNeeded.map((str, index) => (
                            <span key={index} className="bg-white border border-pink-100 text-pink-800 text-[10px] font-medium px-2 py-0.5 rounded-lg">
                              {str}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>

        {/* Feedback / Signatures Area (Printable) */}
        <div className="border-t border-stone-100 pt-8 grid grid-cols-1 md:grid-cols-2 gap-8 font-sans">
          
          {/* Signatures mocks */}
          <div className="space-y-6 text-left">
            <h4 className="font-display font-extrabold text-sm text-rose-950">
              Firmas Autorizadas de Contratación
            </h4>
            
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="text-center">
                <div className="border-b border-stone-300 h-10 w-full mb-2" />
                <p className="text-[10px] font-bold text-stone-700 mb-0.5 uppercase">Firma del Evaluador</p>
                <p className="text-[9px] text-stone-400">Coordinacón Académica</p>
              </div>
              <div className="text-center">
                <div className="border-b border-stone-300 h-10 w-full mb-2" />
                <p className="text-[10px] font-bold text-stone-700 mb-0.5 uppercase">Firma del Candidato</p>
                <p className="text-[9px] text-stone-400">Docente Aspirante</p>
              </div>
            </div>
          </div>

          {/* Interactive hiring decision for recruitment staff (Not printable) */}
          <div className="no-print bg-stone-50 border border-stone-200/60 p-5 rounded-3xl space-y-3 flex flex-col justify-between">
            <div className="text-left">
              <h4 className="font-display font-black text-rose-950 text-xs uppercase tracking-wider mb-1">
                Panel Administrativo del Colegio
              </h4>
              <p className="text-[10px] text-stone-500 leading-snug">
                ¿Deseas contratar formalmente a {teacherData.nombre}? Selecciona el dictamen e inserta notas.
              </p>
            </div>

            <div className="flex space-x-3 my-2">
              <button
                id="btn-hired-yes"
                onClick={() => setIsHired(true)}
                className={`flex-1 py-1.5 rounded-xl font-display font-bold text-xs cursor-pointer transition-all ${
                  isHired === true ? "bg-emerald-600 text-white shadow" : "bg-white border text-stone-600 hover:bg-stone-100"
                }`}
              >
                ✓ Contratar
              </button>
              <button
                id="btn-hired-no"
                onClick={() => setIsHired(false)}
                className={`flex-1 py-1.5 rounded-xl font-display font-bold text-xs cursor-pointer transition-all ${
                  isHired === false ? "bg-rose-600 text-white shadow" : "bg-white border text-stone-600 hover:bg-stone-100"
                }`}
              >
                ✗ Postergar
              </button>
            </div>

            <textarea
              id="txt-hiring-notes"
              rows={2}
              value={recruiterNotes}
              onChange={(e) => setRecruiterNotes(e.target.value)}
              placeholder="Escribe comentarios internos para el expediente escolar..."
              className="w-full bg-white border rounded-xl p-2.5 text-xs text-stone-700 focus:outline-hidden focus:ring-1 focus:ring-pink-400"
            />
          </div>

        </div>

      </div>

      {/* Floating printable notification overlay */}
      <div className="print-only hidden pt-12 text-center text-[10px] text-stone-400 border-t border-dashed mt-12">
        <p>Reporte Oficial IA de Admisión y Selección Docente • Colegio Interactivo. Todos los derechos reservados.</p>
        <p>Válido únicamente para dictámenes internos de la junta directiva escolar.</p>
      </div>

    </motion.div>
  );
}
