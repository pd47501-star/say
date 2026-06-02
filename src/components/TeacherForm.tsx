/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion } from "motion/react";
import { TeacherData } from "../types";
import { User, Mail, Phone, Calendar, Briefcase, GraduationCap, ChevronLeft, ChevronRight, BookOpen, Clock, Award } from "lucide-react";

interface TeacherFormProps {
  initialData: TeacherData;
  onNext: (data: TeacherData) => void;
  onBack: () => void;
}

export default function TeacherForm({ initialData, onNext, onBack }: TeacherFormProps) {
  const [formData, setFormData] = useState<TeacherData>(initialData);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.nombre.trim()) newErrors.nombre = "El nombre es obligatorio.";
    if (!formData.apellidoPaterno.trim()) newErrors.apellidoPaterno = "El apellido paterno es obligatorio.";
    if (!formData.licenciatura.trim()) newErrors.licenciatura = "La licenciatura es obligatoria.";
    
    // validate numeric age
    if (!formData.edad) {
      newErrors.edad = "La edad es obligatoria.";
    } else if (Number(formData.edad) < 18 || Number(formData.edad) > 80) {
      newErrors.edad = "Ingresa una edad válida (18 a 80 años).";
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio.";
    } else if (!/^\d{10}$/.test(formData.telefono.replace(/[^\d]/g, ""))) {
      newErrors.telefono = "Ingresa un número telefónico de 10 dígitos.";
    }

    if (!formData.correo.trim()) {
      newErrors.correo = "El correo electrónico es obligatorio.";
    } else if (!/\S+@\S+\.\S+/.test(formData.correo)) {
      newErrors.correo = "Ingresa un correo electrónico válido.";
    }

    if (!formData.nivelEducativo) newErrors.nivelEducativo = "Selecciona el nivel educativo que imparte.";
    if (!formData.tiempoExperiencia) newErrors.tiempoExperiencia = "Especifica el tiempo de experiencia.";
    if (!formData.tipoExperiencia) newErrors.tipoExperiencia = "Especifica el tipo de experiencia.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onNext(formData);
    }
  };

  const updateField = (field: keyof TeacherData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      {/* Header card with educational details */}
      <div className="bg-pink-600 rounded-3xl p-6 md:p-8 text-white shadow-lg mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <GraduationCap className="w-48 h-48" />
        </div>
        <h2 className="font-display font-extrabold text-2xl md:text-3xl">Datos generales del docente</h2>
        <p className="mt-2 text-pink-100 max-w-xl text-sm md:text-base">
          Por favor, rellena tu ficha de postulación educativa. Estos datos contextualizarán el reporte final y la sugerencia de capacitaciones para tu inducción.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 md:p-10 border border-pink-100 shadow-xl space-y-8 border-b-8 border-pink-400">
        
        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold font-display text-rose-950 mb-2">Nombre(s) *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-500 pointer-events-none">
                <User className="w-4 h-4" />
              </span>
              <input
                id="form-nombre"
                type="text"
                value={formData.nombre}
                onChange={(e) => updateField("nombre", e.target.value)}
                placeholder="Ingresa tu nombre"
                className={`w-full pl-10 pr-4 py-3 bg-pink-50/50 border rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-pink-400 focus:bg-white text-stone-800 text-sm transition-all ${
                  errors.nombre ? "border-red-400 ring-2 ring-red-100" : "border-pink-100"
                }`}
              />
            </div>
            {errors.nombre && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.nombre}</p>}
          </div>

          {/* Apellido Paterno */}
          <div>
            <label className="block text-sm font-semibold font-display text-rose-950 mb-2">Apellido Paterno *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-500 pointer-events-none">
                <User className="w-4 h-4" />
              </span>
              <input
                id="form-apellidoPaterno"
                type="text"
                value={formData.apellidoPaterno}
                onChange={(e) => updateField("apellidoPaterno", e.target.value)}
                placeholder="Primer apellido"
                className={`w-full pl-10 pr-4 py-3 bg-pink-50/50 border rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-pink-400 focus:bg-white text-stone-800 text-sm transition-all ${
                  errors.apellidoPaterno ? "border-red-400 ring-2 ring-red-100" : "border-pink-100"
                }`}
              />
            </div>
            {errors.apellidoPaterno && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.apellidoPaterno}</p>}
          </div>

          {/* Apellido Materno */}
          <div>
            <label className="block text-sm font-semibold font-display text-rose-950 mb-2">Apellido Materno</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-500 pointer-events-none">
                <User className="w-4 h-4" />
              </span>
              <input
                id="form-apellidoMaterno"
                type="text"
                value={formData.apellidoMaterno}
                onChange={(e) => updateField("apellidoMaterno", e.target.value)}
                placeholder="Segundo apellido"
                className="w-full pl-10 pr-4 py-3 bg-pink-50/50 border border-pink-100 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-pink-400 focus:bg-white text-stone-800 text-sm transition-all"
              />
            </div>
          </div>

          {/* Edad */}
          <div>
            <label className="block text-sm font-semibold font-display text-rose-950 mb-2">Edad *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-500 pointer-events-none">
                <Calendar className="w-4 h-4" />
              </span>
              <input
                id="form-edad"
                type="number"
                value={formData.edad}
                onChange={(e) => updateField("edad", e.target.value === "" ? "" : Number(e.target.value))}
                placeholder="Años"
                min="18"
                max="80"
                className={`w-full pl-10 pr-4 py-3 bg-pink-50/50 border rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-pink-400 focus:bg-white text-stone-800 text-sm transition-all ${
                  errors.edad ? "border-red-400 ring-2 ring-red-100" : "border-pink-100"
                }`}
              />
            </div>
            {errors.edad && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.edad}</p>}
          </div>

          {/* Licenciatura */}
          <div>
            <label className="block text-sm font-semibold font-display text-rose-950 mb-2">Formación Académica (Licenciatura) *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-500 pointer-events-none">
                <GraduationCap className="w-4 h-4" />
              </span>
              <input
                id="form-licenciatura"
                type="text"
                value={formData.licenciatura}
                onChange={(e) => updateField("licenciatura", e.target.value)}
                placeholder="Ej. Lic. en Educación Primaria"
                className={`w-full pl-10 pr-4 py-3 bg-pink-50/50 border rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-pink-400 focus:bg-white text-stone-800 text-sm transition-all ${
                  errors.licenciatura ? "border-red-400 ring-2 ring-red-100" : "border-pink-100"
                }`}
              />
            </div>
            {errors.licenciatura && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.licenciatura}</p>}
          </div>

          {/* Teléfono */}
          <div>
            <label className="block text-sm font-semibold font-display text-rose-950 mb-2">Número de Teléfono *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-500 pointer-events-none">
                <Phone className="w-4 h-4" />
              </span>
              <input
                id="form-telefono"
                type="tel"
                value={formData.telefono}
                onChange={(e) => updateField("telefono", e.target.value)}
                placeholder="10 dígitos"
                className={`w-full pl-10 pr-4 py-3 bg-pink-50/50 border rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-pink-400 focus:bg-white text-stone-800 text-sm transition-all ${
                  errors.telefono ? "border-red-400 ring-2 ring-red-100" : "border-pink-100"
                }`}
              />
            </div>
            {errors.telefono && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.telefono}</p>}
          </div>

          {/* Correo Electrónico */}
          <div className="md:col-span-1">
            <label className="block text-sm font-semibold font-display text-rose-950 mb-2">Correo Electrónico *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-500 pointer-events-none">
                <Mail className="w-4 h-4" />
              </span>
              <input
                id="form-correo"
                type="email"
                value={formData.correo}
                onChange={(e) => updateField("correo", e.target.value)}
                placeholder="ejemplo@correo.com"
                className={`w-full pl-10 pr-4 py-3 bg-pink-50/50 border rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-pink-400 focus:bg-white text-stone-800 text-sm transition-all ${
                  errors.correo ? "border-red-400 ring-2 ring-red-100" : "border-pink-100"
                }`}
              />
            </div>
            {errors.correo && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.correo}</p>}
          </div>

          {/* Nivel educativo que imparte */}
          <div>
            <label className="block text-sm font-semibold font-display text-rose-950 mb-2">Nivel educativo que imparte *</label>
            <div className="relative">
              <select
                id="form-nivelEducativo"
                value={formData.nivelEducativo}
                onChange={(e) => updateField("nivelEducativo", e.target.value)}
                className={`w-full px-4 py-3 bg-pink-50/50 border rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-pink-400 focus:bg-white text-stone-800 text-sm appearance-none transition-all ${
                  errors.nivelEducativo ? "border-red-400 ring-2 ring-red-100" : "border-pink-100"
                }`}
              >
                <option value="">Selecciona nivel</option>
                <option value="Preescolar / Kinder">Preescolar / Kinder</option>
                <option value="Primaria Escolar">Primaria Escolar</option>
                <option value="Secundaria / Media">Secundaria / Media</option>
                <option value="Educación Especial">Educación Especial</option>
                <option value="Otro">Otro nivel pedagógico</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-pink-500">
                <BookOpen className="w-4 h-4 animate-pulse" />
              </div>
            </div>
            {errors.nivelEducativo && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.nivelEducativo}</p>}
          </div>

          {/* Tiempo de experiencia */}
          <div>
            <label className="block text-sm font-semibold font-display text-rose-950 mb-2">Tiempo de experiencia *</label>
            <div className="relative">
              <select
                id="form-tiempoExperiencia"
                value={formData.tiempoExperiencia}
                onChange={(e) => updateField("tiempoExperiencia", e.target.value)}
                className={`w-full px-4 py-3 bg-pink-50/50 border rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-pink-400 focus:bg-white text-stone-800 text-sm appearance-none transition-all ${
                  errors.tiempoExperiencia ? "border-red-400 ring-2 ring-red-100" : "border-pink-100"
                }`}
              >
                <option value="">Selecciona tiempo</option>
                <option value="Sin experiencia previa">Sin experiencia previa</option>
                <option value="Menos de 1 año">Menos de 1 año</option>
                <option value="1 a 2 años">1 a 2 años</option>
                <option value="3 a 5 años">3 a 5 años</option>
                <option value="Más de 5 años">Más de 5 años</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-pink-500">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            {errors.tiempoExperiencia && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.tiempoExperiencia}</p>}
          </div>

        </div>

        {/* Secondary grid for more detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-pink-50">
          
          {/* Tipo de experiencia */}
          <div>
            <label className="block text-sm font-semibold font-display text-rose-950 mb-1">Experiencia (tipo de instituciones) *</label>
            <p className="text-xs text-stone-500 mb-2">Ej. Particular en preescolar, escuelas públicas, etc.</p>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-500 pointer-events-none">
                <Briefcase className="w-4 h-4" />
              </span>
              <input
                id="form-tipoExperiencia"
                type="text"
                value={formData.tipoExperiencia}
                onChange={(e) => updateField("tipoExperiencia", e.target.value)}
                placeholder="Ej. Primaria pública trilingüe"
                className={`w-full pl-10 pr-4 py-3 bg-pink-50/50 border rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-pink-400 focus:bg-white text-stone-800 text-sm transition-all ${
                  errors.tipoExperiencia ? "border-red-400 ring-2 ring-red-100" : "border-pink-100"
                }`}
              />
            </div>
            {errors.tipoExperiencia && <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.tipoExperiencia}</p>}
          </div>

          {/* Materias que enseña */}
          <div>
            <label className="block text-sm font-semibold font-display text-rose-950 mb-1">Materias o Áreas que imparte / enseña</label>
            <p className="text-xs text-stone-500 mb-2">Ej. Matemáticas, Español, Ciencias, Multigrado.</p>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-500 pointer-events-none">
                <BookOpen className="w-4 h-4" />
              </span>
              <input
                id="form-materias"
                type="text"
                value={formData.materiasEnseña}
                onChange={(e) => updateField("materiasEnseña", e.target.value)}
                placeholder="Ej. Matemáticas y Educación Artística"
                className="w-full pl-10 pr-4 py-3 bg-pink-50/50 border border-pink-100 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-pink-400 focus:bg-white text-stone-800 text-sm transition-all"
              />
            </div>
          </div>

          {/* Cursos o certificaciones recientes */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold font-display text-rose-950 mb-1">Cursos o Certificaciones recientes</label>
            <p className="text-xs text-stone-500 mb-2">Menciona diplomados, talleres o conferencias actualizadas (SEP, Google, etc.).</p>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-pink-500 pointer-events-none animate-bounce" style={{ animationDuration: "5s" }}>
                <Award className="w-4 h-4" />
              </span>
              <input
                id="form-cursos"
                type="text"
                value={formData.cursosRecientes}
                onChange={(e) => updateField("cursosRecientes", e.target.value)}
                placeholder="Ej. Diplomado SEP en Inclusión, Certificación en Inteligencia Emocional Aplicada"
                className="w-full pl-10 pr-4 py-3 bg-pink-50/50 border border-pink-100 rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-pink-400 focus:bg-white text-stone-800 text-sm transition-all"
              />
            </div>
          </div>

        </div>

        {/* Buttons / Navigation */}
        <div className="flex justify-between items-center pt-6 border-t border-pink-100">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center space-x-2 border border-pink-200 text-pink-700 hover:bg-pink-50 px-6 py-3.5 rounded-2xl font-display font-bold text-sm transition-all cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Regresar de página</span>
          </button>

          <button
            id="btn-avanzar-formulario"
            type="submit"
            className="flex items-center space-x-2 bg-pink-500 hover:bg-pink-600 text-white shadow-xl shadow-pink-200/50 hover:shadow-pink-300 px-8 py-4 rounded-2xl font-display font-black text-base transform hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <span>Iniciar tu evaluación</span>
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </form>
    </motion.div>
  );
}
