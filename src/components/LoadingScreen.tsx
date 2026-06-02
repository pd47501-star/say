/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, Sparkles } from "lucide-react";

const TIPS = [
  "Analizando formación académica y certificaciones...",
  "Evaluando indicadores de conocimiento pedagógico y didáctica...",
  "Ponderando habilidades blandas (empatía, autocontrol, escucha activa)...",
  "Midiendo estrategias de gestión escolar del aula y resolución de conflictos...",
  "Calibrando integración de tecnologías educativas y TIC en aula...",
  "Sintetizando veredicto escolar por IA y planeando cursos de inducción...",
  "Alistando reporte profesional de contratación..."
];

export default function LoadingScreen() {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] px-4 text-center max-w-xl mx-auto">
      {/* Animated big pink circle */}
      <div className="relative mb-8">
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-24 h-24 bg-pink-100 rounded-full flex items-center justify-center border-4 border-pink-200"
        >
          <GraduationCap className="w-12 h-12 text-pink-600" />
        </motion.div>
        
        {/* Sparkles */}
        <div className="absolute -top-1 -right-1 text-md animate-bounce" style={{ animationDuration: "1.5s" }}>
          ✨
        </div>
        <div className="absolute -bottom-2 -left-2 text-md animate-bounce" style={{ animationDuration: "2s" }}>
          💖
        </div>
      </div>

      <h2 className="font-display font-extrabold text-2xl text-rose-950 mb-3 animate-pulse">
        Procesando tu Postulación Docente
      </h2>
      <p className="text-stone-500 text-sm max-w-xs mb-8">
        Nuestra Inteligencia Artificial está evaluando tus respuestas y construyendo el perfil holístico docente.
      </p>

      {/* Progress Line */}
      <div className="w-64 bg-pink-100 h-1.5 rounded-full overflow-hidden mb-6 relative mx-auto">
        <motion.div
          animate={{ x: [-100, 260] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="w-16 bg-pink-600 h-full rounded-full absolute"
        />
      </div>

      {/* Rotating Tips with AnimatePresence */}
      <div className="min-h-[50px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={tipIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-pink-700 font-mono text-xs font-semibold uppercase tracking-wider"
          >
            {TIPS[tipIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}
