
import { GoogleGenAI } from "@google/genai";
import { ReportData } from "../types";

const apiKey = process.env.API_KEY || '';

export const polishNotes = async (roughNotes: string): Promise<string> => {
  if (!apiKey) {
    console.warn("No API Key found for Gemini.");
    return roughNotes;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const prompt = `
      You are a construction site assistant.
      Refine the following site notes by correcting spelling and grammar, and formatting the text into a clean bulleted list.
      Do not change the underlying meaning or add new details.

      Rough Notes:
      "${roughNotes}"
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || roughNotes;
  } catch (error) {
    console.error("Error polishing notes with Gemini:", error);
    return roughNotes;
  }
};

export const generateReportSummary = async (data: ReportData): Promise<string> => {
  if (!apiKey) {
    console.warn("No API Key found for Gemini.");
    return "";
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Construct context from available data
    const context = `
      Project: ${data.projectName}
      Status: ${data.status}
      Location: ${data.location}
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
    console.error("Error generating summary with Gemini:", error);
    return "";
  }
};

export const identifyLocation = async (lat: number, lng: number): Promise<{ address: string; mapLink: string | null }> => {
  if (!apiKey) {
    console.warn("No API Key found for Gemini.");
    return { address: '', mapLink: null };
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

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

    // Extract Google Maps URI from grounding metadata
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      // Look for the chunk that contains map data
      for (const chunk of chunks) {
        if (chunk.maps?.uri) {
          mapLink = chunk.maps.uri;
          break;
        }
      }
    }

    return { address, mapLink };
  } catch (error) {
    console.error("Error identifying location with Gemini:", error);
    return { address: '', mapLink: null };
  }
};
