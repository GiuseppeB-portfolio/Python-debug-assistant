
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    has_errors: {
      type: Type.BOOLEAN,
      description: "Does the script contain any errors?",
    },
    summary: {
      type: Type.STRING,
      description: "A brief, one-paragraph summary of the findings and the overall quality of the code.",
    },
    errors: {
      type: Type.ARRAY,
      description: "A list of all identified errors in the script.",
      items: {
        type: Type.OBJECT,
        properties: {
          line: {
            type: Type.INTEGER,
            description: "The approximate line number where the error occurs. Use 0 if not applicable.",
          },
          error_type: {
            type: Type.STRING,
            description: "The type of error (e.g., SyntaxError, Logic Error, NameError, TypeError).",
          },
          description: {
            type: Type.STRING,
            description: "A detailed but concise explanation of what the error is.",
          },
          suggestion: {
            type: Type.STRING,
            description: "A clear suggestion on how to fix this specific error.",
          },
        },
        required: ["line", "error_type", "description", "suggestion"],
      },
    },
    corrected_code: {
      type: Type.STRING,
      description: "The complete, corrected Python script with all fixes applied.",
    },
  },
  required: ["has_errors", "summary", "errors", "corrected_code"],
};

export const debugPythonScript = async (script: string): Promise<AnalysisResponse> => {
  const systemInstruction = `
    You are an expert Python debugging assistant. Your task is to meticulously analyze the provided Python script.
    1.  Identify all syntax errors, logical flaws, potential runtime errors, and deviations from best practices.
    2.  For each error, provide the line number, a clear description, the type of error, and a specific suggestion for a fix.
    3.  If there are no errors, confirm that the code is clean.
    4.  Provide a fully corrected version of the entire script.
    5.  You MUST respond in the specified JSON format. Do not add any markdown formatting like \`\`\`json.
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          parts: [
            { text: `Here is the Python script to debug:\n\n\`\`\`python\n${script}\n\`\`\`` }
          ]
        }
      ],
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.2,
      },
    });

    const jsonText = response.text.trim();
    // Gemini sometimes wraps the JSON in markdown, so we strip it.
    const cleanJsonText = jsonText.replace(/^```json\s*|```\s*$/g, '');
    const parsedResponse = JSON.parse(cleanJsonText);
    return parsedResponse as AnalysisResponse;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get a valid response from the AI assistant. Please check your API key and the console for more details.");
  }
};
