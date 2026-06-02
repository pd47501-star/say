/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Reutilizar cliente de Gemini con User-Agent de AI Studio para telemetría
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

app.use(express.json({ limit: '10mb' }));

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Endpoint para Evaluar Docente con Gemini AI
app.post("/api/evaluate", async (req, res) => {
  try {
    const { teacherData, responses, openAnswers, evidence, strengthsNeeded } = req.body;

    if (!teacherData) {
      return res.status(400).json({ error: "Faltan datos generales del docente." });
    }

    const payloadText = `
      Analiza la siguiente evaluación de un docente de educación básica y genera un reporte profesional exhaustivo centrado y haciendo énfasis prioritario en sus Habilidades Blandas (soft skills), así como en sus conocimientos pedagógicos, éticos, y áreas de oportunidad.

      DATOS GENERALES DEL DOCENTE:
      - Nombre Completo: ${teacherData.nombre} ${teacherData.apellidoPaterno} ${teacherData.apellidoMaterno}
      - Edad: ${teacherData.edad} años
      - Correo Electrónico: ${teacherData.correo}
      - Teléfono: ${teacherData.telefono}
      - Licenciatura/Formación Académica: ${teacherData.licenciatura}
      - Años de Experiencia: ${teacherData.tiempoExperiencia}
      - Tipo de Experiencia: ${teacherData.tipoExperiencia}
      - Nivel Educativo que imparte: ${teacherData.nivelEducativo}
      - Cursos o Certificaciones recientes: ${teacherData.cursosRecientes || "Ninguno declarado"}
      - Materias que enseña: ${teacherData.materiasEnseña || "No especificadas"}

      RESPUESTAS A EVALUACIÓN (Escala 1 a 5: 1=Nunca, 2=Casi nunca, 3=A veces, 4=Frecuentemente, 5=Siempre):
      ${JSON.stringify(responses, null, 2)}

      AUTOEVALUACIÓN DOCENTE (Respuestas abiertas):
      - Mayor Fortaleza: ${openAnswers?.auto_1 || "No declarada"}
      - Aspecto a Mejorar: ${openAnswers?.auto_2 || "No declarado"}
      - Capacitación que le gustaría recibir: ${openAnswers?.auto_3 || "No declarada"}
      - Dificultades enfrentadas en el aula: ${openAnswers?.auto_4 || "No declaradas"}

      ÁREAS SELECCIONADAS QUE REQUIEREN FORTALECIMIENTO (Declarado de forma externa u observada):
      ${JSON.stringify(strengthsNeeded || [], null, 2)}

      EVIDENCIAS DE EVALUACIÓN PRÁCTICA:
      ${JSON.stringify(evidence || [], null, 2)}

      CRITERIO DE ANÁLISIS:
      1. Calificaciones promedio cuantitativas para cada categoría (del 1 al 5).
         - pedagogia (preguntas ped_*)
         - gestion (preguntas ges_*)
         - softSkills (preguntas soft_*)
         - inclusion (preguntas inc_*)
         - tecnologia (preguntas tec_*)
         - relacionComunidad (preguntas rel_*)
         - etica (preguntas eti_*)
      2. Análisis holístico cualitativo de las habilidades socioemocionales e interpersonales (empatía, control emocional frente al grupo, escucha activa, liderazgo, trabajo colaborativo). Sé riguroso y constructivo. El análisis de habilidades blandas debe de ser el foco del veredicto. En base a su edad y experiencia, valora el nivel que proyecta.
      3. Recomendaciones específicas de capacitación fundamentadas en las insuficiencias (pajes menos de 4) o en las necesidades expresadas en la autoevaluación.
      4. Veredicto final estructurado: "Altamente Recomendado", "Recomendado con Capacitación obligatoria", o "No Recomendado por el momento".
    `;

    // LLamada al SDK @google/genai con gemini-3.5-flash y schema estructurado
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: payloadText,
      config: {
        systemInstruction: "Eres un experto en reclutamiento, mentoría y evaluación de docentes para educación infantil, primaria y secundaria básica en México y Latinoamérica. Analizas encuestas con escala Likert, currículums y respuestas abiertas de autoevaluación de manera asertiva, profesional y humana.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            scoresByCategory: {
              type: Type.OBJECT,
              properties: {
                pedagogia: { type: Type.NUMBER, description: "Puntuación de 1.0 a 5.0 calculada o estimada de acuerdo al dominio didáctico del docente." },
                gestion: { type: Type.NUMBER, description: "Puntuación de 1.0 a 5.0 para el manejo de orden y disciplina en el aula." },
                softSkills: { type: Type.NUMBER, description: "Puntuación de 1.0 a 5.0 enfocada rigurosamente en sus competencias socioemocionales." },
                inclusion: { type: Type.NUMBER, description: "Puntuación de 1.0 a 5.0 en atención a necesidades especiales e inclusión." },
                tecnologia: { type: Type.NUMBER, description: "Puntuación de 1.0 a 5.0 en destrezas digitales aplicadas a clases." },
                relacionComunidad: { type: Type.NUMBER, description: "Puntuación de 1.0 a 5.0 en vinculación respetuosa con padres y directiva." },
                etica: { type: Type.NUMBER, description: "Puntuación de 1.0 a 5.0 en puntualidad, responsabilidad y ética profesional." }
              },
              required: ["pedagogia", "gestion", "softSkills", "inclusion", "tecnologia", "relacionComunidad", "etica"]
            },
            overallScore: { type: Type.NUMBER, description: "Puntuación general calculada con base en los promedios anteriores." },
            softSkillsAnalysis: { type: Type.STRING, description: "Un párrafo robusto de 4-5 renglones detallando la inteligencia emocional, escucha respetuosa, trabajo colaborativo, empatía y motivación del docente, relacionando sus respuestas." },
            pedagogicalInsights: { type: Type.STRING, description: "Análisis cualitativo del nivel planeación didáctica y dominio de contenidos curriculares que se proyecta." },
            classroomManagementTips: { type: Type.STRING, description: "Consejos valiosos y técnicos para manejar mejor la convivencia escolar, resolver conflictos en aula y optimizar el tiempo pedagógico." },
            strengtheningNeedsAnalysis: { type: Type.STRING, description: "Comentario del porqué requiere fortalecer ciertas áreas basándose en lo seleccionado y en sus dudas o frustraciones expresadas." },
            generalVerdict: { type: Type.STRING, description: "Veredicto resumido (p.ej. Altamente Recomendado / Recomendado con Capacitación / No Recomendado por el momento) con una breve síntesis justificadora." },
            recommendedCertifications: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Títulos de 3 o 4 certificaciones, cursos o talleres ideales para complementar su perfil (p.ej. Especialidad en Educación Inclusiva, Certificación Google Educator, Inteligencia Emocional SEP, etc.)"
            },
            suggestedActionPlan: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "4 pasos continuos e interactivos enlistando metas claras para su inducción al puesto."
            }
          },
          required: [
            "scoresByCategory",
            "overallScore",
            "softSkillsAnalysis",
            "pedagogicalInsights",
            "classroomManagementTips",
            "strengtheningNeedsAnalysis",
            "generalVerdict",
            "recommendedCertifications",
            "suggestedActionPlan"
          ]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("No se obtuvo respuesta de procesamiento del análisis.");
    }

    const evaluationResultsObj = JSON.parse(resultText);
    res.json(evaluationResultsObj);

  } catch (error: any) {
    console.error("Error al procesar la evaluación:", error);
    res.status(500).json({ error: "Sucedió un error al analizar la evaluación del docente con Inteligencia Artificial: " + (error?.message || error) });
  }
});

// Integración de Vite Middleware para desarrollo
async function bootstrap() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express server running on http://localhost:${PORT}`);
  });
}

bootstrap();
