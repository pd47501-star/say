/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { AUTO_OPEN_QUESTIONS, FORTALECIMIENTO_AREAS } from "../types";
import { ChevronLeft, ChevronRight, AlertCircle, Heart, NotebookPen, HelpCircle } from "lucide-react";

interface SelfEvaluationViewProps {
  savedOpenAnswers: { [key: string]: string };
  savedStrengthsNeeded: string[];
  onNext: (openAnswers: { [key: string]: string }, strengthsNeeded: string[]) => void;
  onBack: () => void;
}

export default function SelfEvaluationView({
  savedOpenAnswers,
  savedStrengthsNeeded,
  onNext,
  onBack
}: SelfEvaluationViewProps) {
  const [openAnswers, setOpenAnswers] = useState<{ [key: string]: string }>({
    auto_1: savedOpenAnswers.auto_1 || "",
    auto_2: savedOpenAnswers.auto_2 || "",
    auto_3: savedOpenAnswers.auto_3 || "",
    auto_4: savedOpenAnswers.auto_4 || "",
  });
  const [strengths, setStrengths] = useState<string[]>(savedStrengthsNeeded);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleStrength = (areaText: string) => {
    setStrengths((prev) => {
      if (prev.includes(areaText)) {
        return prev.filter((item) => item !== areaText);
      } else {
        return [...prev, areaText];
      }
    });
  };

  const handleNextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate open answers are not empty
    const unfinished = AUTO_OPEN_QUESTIONS.filter((q) => !openAnswers[q.id]?.trim());
    if (unfinished.length > 0) {
      setErrorMsg("Por favor, dedica un momento para responder todas las preguntas de autoevaluación. Tu reflexión personal es fundamental para el reporte escolar.");
      return;
    }
    onNext(openAnswers, strengths);
  };

  const updateAnswers = (id: string, text: string) => {
    setOpenAnswers((prev) => ({ ...prev, [id]: text }));
    setErrorMsg(null);
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
          PÁGINA DE EVALUACIÓN 8 DE 10
        </span>
        <h2 className="font-display font-extrabold text-2xl text-rose-950 mt-1">Autoevaluación Docente y Reflexión</h2>
        <p className="text-stone-500 text-sm mt-1">
          La docencia requiere introspección y autoanálisis. Compártenos tus ideas y dinos en qué áreas te gustaría recibir capacitación.
        </p>
      </div>

      <form onSubmit={handleNextSubmit} className="space-y-8">
        
        {/* Open Questions Board */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-pink-100 border-b-8 border-pink-400 shadow-xl space-y-6">
          <div className="bg-pink-50/50 p-4 rounded-2xl flex items-start space-x-3 text-pink-800 text-xs">
            <NotebookPen className="w-5 h-5 text-pink-500 shrink-0 mt-0.5" />
            <p>
              Tus respuestas abiertas serán analizadas por Inteligencia Artificial para identificar tus mayores fortalezas disciplinarias, tus rasgos de adaptabilidad pedagógica y tu enfoque de mentoría frente al aula escolar.
            </p>
          </div>

          {errorMsg && (
            <motion.div 
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center space-x-3 text-sm font-medium"
            >
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <span>{errorMsg}</span>
            </motion.div>
          )}

          <div className="space-y-6">
            {AUTO_OPEN_QUESTIONS.map((q) => (
              <div key={q.id} className="flex flex-col">
                <label className="block text-sm font-semibold font-display text-rose-950 mb-2 flex items-center space-x-2">
                  <span className="w-2.5 h-2.5 bg-pink-400 rounded-full shrink-0" />
                  <span>{q.text} *</span>
                </label>
                <textarea
                  id={`open-ans-${q.id}`}
                  rows={3}
                  value={openAnswers[q.id]}
                  onChange={(e) => updateAnswers(q.id, e.target.value)}
                  placeholder="Redacta tu respuesta de forma sincera y detallada (ej. explicando anécdotas, metodologías o anhelos)..."
                  className="w-full p-4 bg-pink-50/10 border border-pink-100 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-pink-400 focus:bg-white text-stone-800 text-sm transition-all resize-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Selected Areas of Strengthening (Capacitaciones) */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-pink-100 border-b-8 border-pink-400 shadow-xl space-y-6">
          <div>
            <h3 className="font-display font-extrabold text-lg text-rose-950">
              Áreas de Fortalecimiento Sugeridas
            </h3>
            <p className="text-stone-500 text-xs mt-1">
              Selecciona las áreas donde consideras que ocupas capacitación, adiestramiento o mentoría institucional (puedes marcar múltiples opciones):
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FORTALECIMIENTO_AREAS.map((area) => {
              const checked = strengths.includes(area.text);
              return (
                <button
                  key={area.id}
                  id={`checkbox-${area.id}`}
                  type="button"
                  onClick={() => toggleStrength(area.text)}
                  className={`flex items-center space-x-3.5 p-4 border rounded-2xl text-left cursor-pointer transition-all ${
                    checked
                      ? "bg-pink-100 border-pink-300 text-pink-900 font-medium scale-[1.01]"
                      : "bg-white border-pink-50 hover:bg-pink-50/50 text-stone-600"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center border font-mono text-xs ${
                    checked ? "bg-pink-600 border-pink-600 text-white" : "border-pink-200 bg-white text-transparent"
                  }`}>
                    ✓
                  </div>
                  <span className="text-sm">{area.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-2">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center space-x-2 border border-pink-200 text-pink-700 bg-white hover:bg-pink-50 px-6 py-3.5 rounded-2xl font-display font-bold text-sm transition-all shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Regresar página</span>
          </button>

          <button
            id="btn-avanzar-selfeval"
            type="submit"
            className="flex items-center space-x-2 bg-pink-500 hover:bg-pink-600 text-white shadow-xl shadow-pink-200/50 hover:shadow-pink-300 px-8 py-4 rounded-2xl font-display font-black text-base transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <span>Avanzar de página</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </form>
    </motion.div>
  );
}
