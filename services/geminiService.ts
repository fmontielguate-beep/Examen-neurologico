
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse, GroundingSource, StructureInfo } from "../types";

const SYSTEM_INSTRUCTION = `
  Eres un neurólogo experto basado estrictamente en el atlas de Hal Blumenfeld "Neuroanatomy through Clinical Cases".
  Tu objetivo es desglosar el examen neurológico exhaustivo.
  
  REGLAS DE RESPUESTA:
  1. Para Pares Craneales: Detalla el origen aparente, el núcleo en el tronco encefálico (Mesencéfalo, Puente o Bulbo) y el foramen de salida del cráneo.
  2. Para Motor: Diferencia UMN vs LMN usando signos como Babinski, Hoffman, Clonus o Fasciculaciones.
  3. Estructuras: Siempre que menciones una estructura (ej. [[Fascículo Longitudinal Medial]], [[Núcleo de Edinger-Westphal]]), rodéala con [[ ]].
  4. Formato: Usa Markdown elegante, tablas para comparaciones y negritas para términos clave.
`;

export const analyzeClinicalFinding = async (testName: string, region: string, type: string): Promise<AnalysisResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Análisis Exhaustivo del Protocolo: ${testName}
    
    Proporciona:
    1. PROCEDIMIENTO: Cómo realizar correctamente la maniobra.
    2. CORRELACIÓN ANATÓMICA: Qué vías y núcleos estamos probando. Usa [[Estructura]].
    3. LOCALIZACIÓN: Si la prueba es anormal, ¿dónde está el daño? (ej. Corteza, Cápsula Interna, Tronco, Nervio Periférico).
    4. PERLA CLÍNICA: Un dato de alta relevancia médica de Blumenfeld.
  `;

  return queryGemini(ai, prompt);
};

export const searchClinicalKnowledge = async (query: string): Promise<AnalysisResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Realiza un análisis profundo sobre: "${query}".
    Incluye anatomía funcional, semiología clínica y localización. Marca las estructuras con [[Estructura]].
  `;

  return queryGemini(ai, prompt);
};

export const getStructureDeepDive = async (structureName: string): Promise<StructureInfo> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Desglosa la estructura: "${structureName}" para un estudiante de medicina avanzado.`,
    config: {
      systemInstruction: "Proporciona info técnica sobre embriología (ej. Prosencéfalo), localización exacta y función clínica.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          embryology: { type: Type.STRING },
          localization: { type: Type.STRING },
          function: { type: Type.STRING }
        },
        required: ["name", "embryology", "localization", "function"]
      }
    }
  });

  return JSON.parse(response.text || "{}");
};

async function queryGemini(ai: any, prompt: string): Promise<AnalysisResponse> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "Error en el sistema experto.";
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((chunk: any) => ({
        title: chunk.web?.title || "Fuente Médica",
        uri: chunk.web?.uri || ""
      }))
      .filter((s: GroundingSource) => s.uri !== "") || [];

    return { content: text, sources };
  } catch (error) {
    console.error(error);
    return { content: "Error de conexión con el Atlas Digital.", sources: [] };
  }
}
