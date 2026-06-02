/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { PracticeEvidence } from "../types";
import { ChevronLeft, FileText, UploadCloud, AlertCircle, Sparkles, Folder, CheckSquare } from "lucide-react";

interface EvidenceViewProps {
  savedEvidence: PracticeEvidence[];
  onFinish: (evidence: PracticeEvidence[]) => void;
  onBack: () => void;
  isSubmitting: boolean;
}

export default function EvidenceView({
  savedEvidence,
  onFinish,
  onBack,
  isSubmitting
}: EvidenceViewProps) {
  const [simulationResponse, setSimulationResponse] = useState<string>(
    savedEvidence.find(ev => ev.tipo === "entrevista")?.descripcion || ""
  );
  
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>(
    savedEvidence.filter(ev => ev.tipo !== "entrevista").map(ev => ev.titulo)
  );

  const [customFeedbackState, setCustomFeedbackState] = useState<string>("");

  const templates = [
    { id: "temp_1", type: "planeacion", title: "Planeación Didáctica Semanal", desc: "Formato estructurado de clases para Español y Matemáticas", size: "1.2 MB", icon: "📑" },
    { id: "temp_2", type: "portafolio", title: "Portafolio de Evidencias de Convivencia", desc: "Fotos de convivencia inclusiva y control grupal", size: "2.4 MB", icon: "🎨" },
    { id: "temp_3", type: "video_clase", title: "Vídeo Muestra de Clase (5min)", desc: "Enlace de simulación aplicando estrategias de aula activa", size: "Enlace web", icon: "🎥" },
    { id: "temp_4", type: "otro", title: "Bitácora Docente Escolar", desc: "Reportes de comunicación asertiva con padres de familia", size: "850 KB", icon: "📔" }
  ];

  const handleToggleTemplate = (title: string) => {
    setSelectedTemplates(prev => {
      if (prev.includes(title)) {
        return prev.filter(t => t !== title);
      } else {
        return [...prev, title];
      }
    });
  };

  const handleFinishSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simulationResponse.trim()) {
      alert("Por favor, responde el escenario educativo de simulación. Nos permite evaluar con precisión tus habilidades blandas.");
      return;
    }

    // Build evidence list
    const evidenceList: PracticeEvidence[] = [];
    
    // Add simulation response as a virtual mini-interview
    evidenceList.push({
      tipo: "entrevista",
      titulo: "Simulación de conflicto en aula (Habilidades blandas)",
      descripcion: simulationResponse,
    });

    // Add selected pre-loaded portfolio assets
    templates.forEach(temp => {
      if (selectedTemplates.includes(temp.title)) {
        evidenceList.push({
          tipo: temp.type,
          titulo: temp.title,
          descripcion: temp.desc,
          fileName: temp.title + " (Ejemplo Académico)",
          urlSimulada: `https://institucion-educativa.cdn/docentes/evidencias/${temp.id}.pdf`
        });
      }
    });

    onFinish(evidenceList);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      {/* Header Info */}
      <div className="mb-6">
        <span className="text-xs font-mono font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-md">
          PÁGINA DE EVALUACIÓN 9 DE 10
        </span>
        <h2 className="font-display font-extrabold text-2xl text-rose-950 mt-1">
          Simulación Práctica y Portafolio
        </h2>
        <p className="text-stone-500 text-sm mt-1">
          La contratación final requiere pruebas reales de cómo conduces tus clases. Resuelve el escenario de simulación y selecciona las evidencias escolares que adjuntarás a tu postulación.
        </p>
      </div>

      <form onSubmit={handleFinishSubmit} className="space-y-8">
        
        {/* Scenario simulation (Very important for Soft Skills evaluation) */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-pink-200/80 border-b-8 border-pink-400 shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-105/40 rounded-full blur-2xl -z-10" />
          
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-yellow-100 text-yellow-700 rounded-xl font-mono animate-pulse">
              🚨 Escenario Escolar
            </div>
            <h3 className="font-display font-bold text-rose-950 text-lg">
              Simulación de Convivencia y Inteligencia Emocional
            </h3>
          </div>

          <p className="text-stone-700 text-sm italic bg-amber-50/40 p-4 rounded-2xl border-l-4 border-yellow-400">
            "Un estudiante con rezago de aprendizaje se frustra gravemente durante una actividad, de pronto grita diciendo que 'no sirve para nada', arroja con violencia todos sus materiales al suelo escolar y se rehúsa a cooperar ante el resto del grupo que lo observa."
          </p>

          <div className="space-y-3">
            <label className="block text-sm font-semibold font-display text-rose-950">
              ¿Cuál sería tu reacción inmediata, qué palabras usarías y cómo solucionarías la situación pedagógica y socioemocionalmente? *
            </label>
            <p className="text-xs text-stone-500">
              Valoramos tu capacidad de autorregulación emocional, tu empatía activa, la inclusión oportuna del alumno y cómo restableces un ambiente colaborativo y pacífico.
            </p>
            <textarea
              id="txt-simulation-response"
              rows={5}
              required
              value={simulationResponse}
              onChange={(e) => setSimulationResponse(e.target.value)}
              placeholder="Explica qué harías de forma específica para calmar al alumno, cómo trabajarías con el grupo, y qué estrategias de refuerzo de habilidades blandas aplicarías..."
              className="w-full p-4 bg-pink-50/10 border border-pink-100 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-pink-400 focus:bg-white text-stone-800 text-sm transition-all shadow-xs"
            />
          </div>
        </div>

        {/* Portafolio de Evidencias (Checklist selections) */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-pink-100 border-b-8 border-pink-400 shadow-xl space-y-6">
          <div>
            <h3 className="font-display font-extrabold text-lg text-rose-950 flex items-center space-x-2">
              <Folder className="w-5 h-5 text-pink-500" />
              <span>Evidencias Docentes del Portafolio</span>
            </h3>
            <p className="text-stone-500 text-xs mt-1">
              Selecciona los documentos, planeaciones o evidencias didácticas modelo que deseas incluir como parte de tu portafolio docente de muestra para contratación (puedes marcar varios):
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templates.map((temp) => {
              const checked = selectedTemplates.includes(temp.title);
              return (
                <button
                  key={temp.id}
                  id={`temp-btn-${temp.id}`}
                  type="button"
                  onClick={() => handleToggleTemplate(temp.title)}
                  className={`flex items-start space-x-4 p-4 border rounded-2xl text-left cursor-pointer transition-all ${
                    checked
                      ? "bg-pink-100/60 border-pink-300 shadow-inner scale-[0.99]"
                      : "bg-white border-pink-50 hover:bg-pink-50/30"
                  }`}
                >
                  <span className="text-3xl p-1 bg-white border border-pink-50 rounded-xl shadow-xs shrink-0 self-center">
                    {temp.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display font-bold text-sm text-stone-800 tracking-tight text-ellipsis overflow-hidden">
                      {temp.title}
                    </h4>
                    <p className="text-stone-500 text-xs leading-relaxed mt-0.5 truncate">
                      {temp.desc}
                    </p>
                    <span className="inline-block mt-2 text-[10px] font-mono text-pink-600 bg-pink-50 border border-pink-100 px-1.5 py-0.5 rounded">
                      {temp.size}
                    </span>
                  </div>
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                    checked ? "bg-pink-600 border-pink-600 text-white" : "border-pink-200 bg-white"
                  }`}>
                    {checked && "✓"}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Virtual manual file uploader mockup */}
          <div className="border-2 border-dashed border-pink-200 rounded-3xl p-6 text-center bg-pink-50/10">
            <UploadCloud className="w-10 h-10 text-pink-400 mx-auto mb-3 animate-bounce" style={{ animationDuration: "3s" }} />
            <h4 className="font-display font-bold text-sm text-stone-700">¿Subir otra planeación propia?</h4>
            <p className="text-stone-500 text-xs max-w-xs mx-auto mt-1 leading-relaxed">
              Arrastra y suelta tus archivos PDF o selecciona directamente desde tu ordenador (Límite: 10MB).
            </p>
            <div className="mt-4">
              <input 
                id="file-uploader-simula"
                type="file" 
                className="hidden" 
                onChange={() => alert("Simulación: Archivo seleccionado y cargado con éxito en el portafolio virtual.")}
              />
              <button 
                type="button"
                onClick={() => document.getElementById("file-uploader-simula")?.click()}
                className="bg-white border border-pink-200 text-pink-700 hover:bg-pink-50 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
              >
                Buscar Archivo
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={onBack}
            disabled={isSubmitting}
            className="flex items-center space-x-2 border border-pink-200 text-pink-700 bg-white hover:bg-pink-50 px-6 py-3.5 rounded-2xl font-display font-bold text-sm transition-all cursor-pointer shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Regresar página</span>
          </button>

          <button
            id="btn-finalizar-evaluacion"
            type="submit"
            disabled={isSubmitting}
            className="flex items-center space-x-3 bg-pink-500 hover:bg-pink-600 text-white shadow-xl shadow-pink-200/50 hover:shadow-pink-300 px-8 py-4 rounded-2xl font-display font-black text-base transition-all disabled:opacity-50 flex-row cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <span>{isSubmitting ? "Generando Reporte..." : "Terminar y Generar Reporte"}</span>
            <Sparkles className="w-5 h-5 shrink-0" />
          </button>
        </div>

      </form>
    </motion.div>
  );
}
