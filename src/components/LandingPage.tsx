/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { GraduationCap, Award, Brain, MessageCircleHeart, ArrowRight } from "lucide-react";

const docenteIllustration = "/src/assets/images/docente_illustration_1780440955382.png";

interface LandingPageProps {
  onStart: () => void;
}

export default function LandingPage({ onStart }: LandingPageProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] px-4 md:px-8 py-12 max-w-6xl mx-auto">
      {/* Decorative school doodle shapes in pink */}
      <div className="absolute top-20 left-10 w-24 h-24 bg-pink-100 rounded-full blur-2xl opacity-65 -z-10" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-rose-100 rounded-full blur-3xl opacity-60 -z-10" />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center w-full">
        {/* Content Section (Left) */}
        <div className="md:col-span-7 flex flex-col space-y-6 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-pink-50 border border-pink-200 px-3 py-1.5 rounded-full self-center md:self-start"
          >
            <GraduationCap className="w-5 h-5 text-pink-500" />
            <span className="text-pink-700 font-mono text-xs font-semibold uppercase tracking-wider">
              Admisión Docente de Educación Básica
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display font-extrabold text-4xl md:text-5xl lg:text-5.51xl leading-none text-rose-950"
          >
            Evalúa tu vocación y <span className="text-pink-600 underline decoration-pink-300 decoration-wavy">habilidades blandas</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-stone-600 text-lg md:text-xl font-sans leading-relaxed"
          >
            Diseñamos esta plataforma como un puente interactivo para conocer tu dominio educativo y,
            sobre todo, tu <strong className="text-rose-900">empatía, inteligencia emocional y adaptabilidad</strong> como docente en nuestra comunidad de educación básica.
          </motion.p>

          {/* Value Highlights */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2"
          >
            <div className="flex items-center space-x-3 p-3 bg-white/70 border border-pink-100 rounded-xl shadow-xs">
              <div className="p-2 bg-pink-100 rounded-lg text-pink-600 shrink-0">
                <Brain className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-display font-bold text-xs text-stone-800">Pedagogía Activa</h3>
                <p className="text-[11px] text-stone-500">Estrategias y planeación</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-white/70 border border-pink-100 rounded-xl shadow-xs">
              <div className="p-2 bg-pink-100 rounded-lg text-pink-600 shrink-0">
                <MessageCircleHeart className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-display font-bold text-xs text-stone-800">Socioemocional</h3>
                <p className="text-[11px] text-stone-500">Habilidades blandas clave</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-white/70 border border-pink-100 rounded-xl shadow-xs">
              <div className="p-2 bg-pink-100 rounded-lg text-pink-600 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h3 className="font-display font-bold text-xs text-stone-800">Reporte IA</h3>
                <p className="text-[11px] text-stone-500">Veredicto y plan de acción</p>
              </div>
            </div>
          </motion.div>

          {/* Action Button */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="pt-4 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 justify-center md:justify-start"
          >
            <button
              id="btn-comenzar-evaluacion"
              onClick={onStart}
              className="group flex items-center justify-center space-x-3 bg-pink-600 hover:bg-pink-700 active:bg-pink-800 text-white font-display font-bold text-lg px-8 py-4.5 rounded-2xl shadow-lg hover:shadow-pink-200/50 hover:shadow-xl transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
            >
              <span>Comenzar tu evaluación</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
            </button>
            
            <div className="flex items-center justify-center space-x-2 text-stone-500 font-mono text-xs">
              <span>●</span>
              <span>Completamente gratuito</span>
              <span>●</span>
              <span>~15 Minutos</span>
            </div>
          </motion.div>
        </div>

        {/* Illustration Section (Right) */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="md:col-span-5 flex justify-center relative"
        >
          {/* Heart / Sparkle decoration */}
          <div className="absolute -top-5 -left-5 bg-pink-400 text-white p-3 rounded-full shadow-lg z-15 animate-bounce" style={{ animationDuration: '3s' }}>
            💖
          </div>
          <div className="absolute -bottom-4 -right-2 bg-yellow-400 text-white p-2.5 rounded-full shadow-lg z-15 animate-pulse">
            📚
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-pink-50 border-4 border-pink-200 p-6 shadow-xl max-w-sm md:max-w-md">
            <img 
              src={docenteIllustration} 
              alt="Docente interactivo" 
              className="w-full h-auto object-cover rounded-2xl"
              referrerPolicy="no-referrer"
            />
            
            {/* Overlay banner */}
            <div className="mt-4 p-4 bg-white/90 border border-pink-100 rounded-xl flex items-center justify-between text-left">
              <div>
                <p className="text-[11px] text-pink-600 font-mono font-bold uppercase">Retroalimentación Instantánea</p>
                <h4 className="font-display font-extrabold text-stone-800 text-sm">Validado con inteligencias educativas</h4>
              </div>
              <span className="text-xl">👩‍🏫</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
