
import { GoogleGenAI } from "@google/genai";
import { ReportData } from "../types";

const getAiClient = () => {
  if (!process.env.API_KEY) {
    // Graceful fallback or error, but let's just log and throw to be handled by caller
    console.warn("API Key not found in process.env");
    throw new Error("API Key not found");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const polishNotes = async (roughNotes: string): Promise<string> => {
  if (!roughNotes) return "";
  try {
    const ai = getAiClient();
    const prompt = `
      You are a construction site assistant.
      Refine the following site notes by correcting spelling and grammar, and formatting the text into a clean bulleted list if appropriate.
      Do not change the underlying meaning or add new details.

      Rough Notes:
      "${roughNotes}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || roughNotes;
  } catch (error) {
    console.error("Error polishing notes:", error);
    return roughNotes;
  }
};

export const generateReportSummary = async (data: ReportData): Promise<string> => {
  try {
    const ai = getAiClient();

    const context = `
      Project: ${data.projectName}
      Status: ${data.status}
      Location: ${data.propertyAddress}
      Contractor: ${data.clientName}
      Foreman: ${data.foreman}
      Manpower: ${data.manpower.map(m => `${m.trade} (${m.count})`).join(', ') || 'None'}
      Checklist: ${data.checklist.filter(c => c.completed).length}/${data.checklist.length} items completed
      Weather: ${data.weather.condition}, ${data.weather.temp}
      Site Notes: ${data.notes || 'None'}
      Incidents: ${data.incidents || 'None'}
    `;

    const prompt = `
      You are a construction site manager. Write a concise executive summary (max 3 sentences) for this daily field report.
      Focus on the overall progress, key activities performed, and highlight any incidents if they exist.
      Keep it professional and factual. Do not use markdown formatting.

      Report Data:
      ${context}
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text?.trim() || "";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "";
  }
};

export const identifyLocation = async (lat: number, lng: number): Promise<{ address: string; mapLink: string | null }> => {
  try {
    const ai = getAiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "What is the street address of this location? Return only the address string.",
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      }
    });

    const address = response.text?.trim() || "";
    let mapLink = null;

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      for (const chunk of chunks) {
        if (chunk.maps?.uri) {
          mapLink = chunk.maps.uri;
          break;
        }
      }
    }

    return { address, mapLink };
  } catch (error) {
    console.error("Error identifying location:", error);
    return { address: '', mapLink: null };
  }
};
