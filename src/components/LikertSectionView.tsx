/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { LikertSection } from "../types";
import { ChevronLeft, ChevronRight, AlertCircle, Heart, Notebook } from "lucide-react";

interface LikertSectionViewProps {
  key?: string;
  sectionKey: string;
  section: LikertSection;
  savedAnswers: { [key: string]: number };
  onNext: (answersToSave: { [key: string]: number }) => void;
  onBack: () => void;
  currentStep: number;
  totalSteps: number;
}

export default function LikertSectionView({
  sectionKey,
  section,
  savedAnswers,
  onNext,
  onBack,
  currentStep,
  totalSteps
}: LikertSectionViewProps) {
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state if savedAnswers changes or section changes
  useEffect(() => {
    const initialAnswers: { [key: string]: number } = {};
    section.questions.forEach((q) => {
      initialAnswers[q.id] = savedAnswers[q.id] || 0;
    });
    setAnswers(initialAnswers);
    setErrorMsg(null);
  }, [section, savedAnswers]);

  const selectOption = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setErrorMsg(null);
  };

  const handleNextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate that all questions are answered
    const unanswered = section.questions.filter((q) => !answers[q.id]);
    if (unanswered.length > 0) {
      setErrorMsg("Por favor, selecciona una respuesta para cada una de las afirmaciones para continuar.");
      return;
    }
    onNext(answers);
  };

  const options = [
    { value: 1, text: "Nunca", emoji: "❌", color: "hover:bg-red-50 hover:border-red-200 active:bg-red-100", activeBg: "bg-red-100 border-red-300 text-red-800" },
    { value: 2, text: "Casi nunca", emoji: "⚠️", color: "hover:bg-amber-50 hover:border-amber-200 active:bg-amber-100", activeBg: "bg-amber-100 border-amber-300 text-amber-800" },
    { value: 3, text: "A veces", emoji: "💬", color: "hover:bg-yellow-50 hover:border-yellow-200 active:bg-yellow-101", activeBg: "bg-yellow-100 border-yellow-300 text-yellow-800" },
    { value: 4, text: "Frecuentemente", emoji: "✨", color: "hover:bg-pink-50 hover:border-pink-200 active:bg-pink-101", activeBg: "bg-pink-100 border-pink-300 text-pink-800" },
    { value: 5, text: "Siempre", emoji: "💖", color: "hover:bg-rose-50 hover:border-rose-200 active:bg-rose-101", activeBg: "bg-rose-100 border-rose-300 text-rose-800" }
  ];

  const overallProgress = Math.round((currentStep / totalSteps) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      {/* Progress indicators wrapper */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
        <div>
          <span className="text-xs font-mono font-bold text-pink-600 bg-pink-50 px-2.5 py-1 rounded-md">
            PÁGINA DE EVALUACIÓN {currentStep} DE {totalSteps}
          </span>
          <h2 className="font-display font-extrabold text-2xl text-rose-950 mt-1">{section.title}</h2>
        </div>
        <div className="w-full md:w-48">
          <div className="flex justify-between text-[11px] font-mono text-stone-500 mb-1">
            <span>Progreso Total</span>
            <span>{overallProgress}%</span>
          </div>
          <div className="w-full bg-pink-100 rounded-full h-2.5 overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 0.5 }}
              className="bg-pink-600 h-full rounded-full" 
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 md:p-8 border border-pink-100 border-b-8 border-pink-400 shadow-xl space-y-6">
        <p className="text-stone-600 text-sm md:text-base italic bg-pink-50/40 p-4 rounded-2xl border-l-4 border-pink-400">
          📍 {section.description} Selecciona la frecuencia con la que cumples cada indicador o afirmación.
        </p>

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

        <form onSubmit={handleNextSubmit} className="space-y-8">
          
          <div className="space-y-6">
            {section.questions.map((q, idx) => {
              const currentVal = answers[q.id] || 0;
              return (
                <div 
                  key={q.id} 
                  id={`ques-${q.id}`}
                  className="p-5 md:p-6 bg-pink-50/15 border border-pink-100/50 rounded-2xl hover:border-pink-200 transition-all shadow-xs"
                >
                  <div className="flex items-start space-x-3.5 mb-4">
                    <span className="flex items-center justify-center bg-pink-100 text-pink-700 text-xs font-mono font-semibold w-6 h-6 rounded-lg pt-0.5 select-none shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="font-display font-bold text-stone-800 text-base leading-snug">
                      {q.text}
                    </h3>
                  </div>

                  {/* Likert Scale Row */}
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {options.map((opt) => {
                      const isActive = currentVal === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => selectOption(q.id, opt.value)}
                          className={`flex flex-col items-center justify-center p-3.5 border rounded-xl text-center cursor-pointer transition-all ${
                            isActive ? opt.activeBg + " shadow-inner scale-[1.02]" : "border-stone-100 bg-white text-stone-600 " + opt.color
                          }`}
                        >
                          <span className="text-xl mb-1.5">{opt.emoji}</span>
                          <span className="font-display font-bold text-[11px] uppercase tracking-wide">
                            {opt.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-pink-100">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center space-x-2 border border-pink-200 text-pink-700 hover:bg-pink-50 px-6 py-3.5 rounded-2xl font-display font-bold text-sm transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Regresar página</span>
            </button>

            <button
              id="btn-avanzar-likert"
              type="submit"
              className="flex items-center space-x-2 bg-pink-500 hover:bg-pink-600 text-white shadow-xl shadow-pink-200/50 hover:shadow-pink-300 px-8 py-4 rounded-2xl font-display font-black text-base transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
            >
              <span>Avanzar página</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

        </form>
      </div>
    </motion.div>
  );
}
