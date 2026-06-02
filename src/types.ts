/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TeacherData {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  edad: number | "";
  tipoExperiencia: string;
  tiempoExperiencia: string; // e.g. "2 años", "6 meses"
  licenciatura: string;
  telefono: string;
  correo: string;
  nivelEducativo: string; // p.ej. "Preescolar", "Primaria", "Secundaria"
  cursosRecientes: string;
  materiasEnseña: string;
}

export interface LikertQuestion {
  id: string;
  text: string;
}

export interface LikertSection {
  title: string;
  description: string;
  questions: LikertQuestion[];
}

export interface OpenQuestion {
  id: string;
  text: string;
}

export interface PracticeEvidence {
  tipo: string; // "planeacion" | "video_clase" | "portafolio" | "entrevista" | "otro"
  titulo: string;
  descripcion: string;
  urlSimulada?: string;
  fileName?: string;
}

export interface EvaluationResult {
  scoresByCategory: { [key: string]: number }; // average scores out of 5
  overallScore: number;
  softSkillsAnalysis: string;
  pedagogicalInsights: string;
  classroomManagementTips: string;
  strengtheningNeedsAnalysis: string;
  generalVerdict: string;
  recommendedCertifications: string[];
  suggestedActionPlan: string[];
}

export const SECTIONS: { [key: string]: LikertSection } = {
  pedagogia: {
    title: "Conocimiento Pedagógico y Disciplinar",
    description: "Evalúa el dominio de contenidos curriculares, planeación didáctica y estrategias de enseñanza.",
    questions: [
      { id: "ped_1", text: "Explica los temas con claridad." },
      { id: "ped_2", text: "Relaciona los contenidos con ejemplos cotidianos." },
      { id: "ped_3", text: "Diseña actividades adecuadas para el nivel de los alumnos." },
      { id: "ped_4", text: "Utiliza diferentes estrategias de enseñanza." },
      { id: "ped_5", text: "Evalúa de manera justa y objetiva." },
      { id: "ped_6", text: "Retroalimenta a los estudiantes oportunamente." }
    ]
  },
  gestion: {
    title: "Gestión del Aula",
    description: "Evalúa la organización del grupo, disciplina, manejo del tiempo y ambiente respetuoso.",
    questions: [
      { id: "ges_1", text: "Mantiene el orden sin recurrir a gritos o humillaciones." },
      { id: "ges_2", text: "Fomenta la participación de todos los estudiantes." },
      { id: "ges_3", text: "Aprovecha adecuadamente el tiempo de clase." },
      { id: "ges_4", text: "Establece reglas claras de convivencia." },
      { id: "ges_5", text: "Resuelve conflictos de manera adecuada." }
    ]
  },
  softSkills: {
    title: "Habilidades Blandas (Socioemocionales)",
    description: "Aspecto fundamental que evalúa comunicación, empatía, inteligencia emocional, liderazgo y adaptabilidad.",
    questions: [
      { id: "soft_1", text: "Escucha las opiniones de los estudiantes con respeto." },
      { id: "soft_2", text: "Muestra empatía ante las necesidades de los alumnos." },
      { id: "soft_3", text: "Mantiene una actitud positiva frente a situaciones difíciles." },
      { id: "soft_4", text: "Trabaja colaborativamente con otros docentes." },
      { id: "soft_5", text: "Acepta sugerencias y críticas constructivas." },
      { id: "soft_6", text: "Se adapta a cambios o nuevas metodologías." },
      { id: "soft_7", text: "Promueve un ambiente inclusivo." },
      { id: "soft_8", text: "Controla adecuadamente sus emociones frente al grupo." },
      { id: "soft_9", text: "Motiva a los estudiantes a participar." },
      { id: "soft_10", text: "Tiene disposición para apoyar a compañeros y padres de familia." }
    ]
  },
  inclusion: {
    title: "Inclusión y Atención a la Diversidad",
    description: "Mide el respeto a las diferencias e igualdad de oportunidades de aprendizaje.",
    questions: [
      { id: "inc_1", text: "Adapta actividades para diferentes estilos de aprendizaje." },
      { id: "inc_2", text: "Trata a todos los estudiantes con igualdad." },
      { id: "inc_3", text: "Promueve el respeto entre compañeros." },
      { id: "inc_4", text: "Identifica dificultades de aprendizaje oportunamente." },
      { id: "inc_5", text: "Favorece la inclusión de estudiantes con discapacidad o rezago." }
    ]
  },
  tecnologia: {
    title: "Uso de Tecnología Educativa",
    description: "Mide la incorporación de herramientas y plataformas digitales en el proceso educativo.",
    questions: [
      { id: "tec_1", text: "Utiliza herramientas digitales en sus clases." },
      { id: "tec_2", text: "Emplea recursos audiovisuales para apoyar el aprendizaje." },
      { id: "tec_3", text: "Usa plataformas educativas adecuadamente." },
      { id: "tec_4", text: "Integra actividades interactivas o tecnológicas." }
    ]
  },
  relacionComunidad: {
    title: "Relación con Padres y Comunidad",
    description: "Mide la comunicación con padres de familia, directivos y el compromiso escolar.",
    questions: [
      { id: "rel_1", text: "Mantiene comunicación respetuosa con padres de familia." },
      { id: "rel_2", text: "Informa oportunamente sobre el desempeño de los alumnos." },
      { id: "rel_3", text: "Participa en actividades escolares." },
      { id: "rel_4", text: "Colabora con directivos y compañeros." }
    ]
  },
  etica: {
    title: "Ética y Profesionalismo",
    description: "Evalúa la responsabilidad, ética y el compromiso institucional del docente.",
    questions: [
      { id: "eti_1", text: "Cumple con horarios y responsabilidades." },
      { id: "eti_2", text: "Actúa con ética profesional." },
      { id: "eti_3", text: "Respeta la confidencialidad de los estudiantes." },
      { id: "eti_4", text: "Muestra compromiso con la mejora continua." }
    ]
  }
};

export const AUTO_OPEN_QUESTIONS: OpenQuestion[] = [
  { id: "auto_1", text: "¿Cuál considera que es su mayor fortaleza como docente?" },
  { id: "auto_2", text: "¿Qué aspecto necesita mejorar?" },
  { id: "auto_3", text: "¿Qué capacitación le gustaría recibir?" },
  { id: "auto_4", text: "¿Qué dificultades enfrenta en el aula?" }
];

export const FORTALECIMIENTO_AREAS = [
  { id: "fort_1", text: "Manejo de grupo" },
  { id: "fort_2", text: "Planeación didáctica" },
  { id: "fort_3", text: "Evaluación del aprendizaje" },
  { id: "fort_4", text: "Tecnología educativa" },
  { id: "fort_5", text: "Educación inclusiva y diversidad" },
  { id: "fort_6", text: "Inteligencia emocional" },
  { id: "fort_7", text: "Comunicación efectiva" },
  { id: "fort_8", text: "Trabajo colaborativo" }
];
