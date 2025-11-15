// lib/ai-service.ts
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AddressEntry } from "@/hooks/useMapStore";
import { AVAILABLE_TOOLS, executeTool, type ChatActionsContext, type ToolResult } from "./chat-tools";

/**
 * Servicio para interactuar con Google AI (Gemini)
 */

// Configuración del modelo
const MODEL_NAME = "gemini-2.5-flash";

/**
 * Obtiene la instancia de Google AI
 */
function getGoogleAI() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_AI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "API Key de Google AI no configurada. Por favor, agrega NEXT_PUBLIC_GOOGLE_AI_API_KEY en tu archivo .env.local",
    );
  }

  return new GoogleGenerativeAI(apiKey);
}

/**
 * Construye el contexto del mapa para incluir en los prompts
 */
export function buildMapContext(
  markers: AddressEntry[],
  center?: { lat: number; lng: number } | null,
): string {
  let context = "Contexto del mapa:\n";

  if (center) {
    context += `- Ubicación actual del mapa: ${center.lat.toFixed(4)}, ${center.lng.toFixed(4)}\n`;
  }

  if (markers.length === 0) {
    context += "- No hay marcadores guardados actualmente.\n";
  } else {
    context += `- Marcadores guardados (${markers.length}):\n`;
    markers.forEach((marker, index) => {
      context += `  ${index + 1}. "${marker.name}" en ${marker.address || marker.coordinates.lat + ", " + marker.coordinates.lng}`;
      if (marker.description) {
        context += ` - ${marker.description}`;
      }
      context += "\n";
    });
  }

  return context;
}

/**
 * Convierte las herramientas a formato de functionDeclarations de Gemini
 */
function convertToolsToFunctionDeclarations() {
  return AVAILABLE_TOOLS.map(tool => ({
    name: tool.name,
    description: tool.description,
    parameters: {
      type: "OBJECT",
      properties: Object.entries(tool.parameters.properties).reduce((acc, [key, value]) => {
        acc[key] = {
          type: value.type.toUpperCase(),
          description: value.description,
        };
        return acc;
      }, {} as any),
      required: tool.parameters.required,
    },
  }));
}

/**
 * Resultado extendido que incluye información sobre herramientas ejecutadas
 */
export interface SendMessageResult {
  text: string;
  toolsUsed?: Array<{
    name: string;
    parameters: Record<string, any>;
    result: ToolResult;
  }>;
}

/**
 * Envía un mensaje a Google AI y obtiene la respuesta
 * Soporta Function Calling para que la IA ejecute acciones en el mapa
 */
export async function sendMessage(
  userMessage: string,
  markers: AddressEntry[],
  center?: { lat: number; lng: number } | null,
  conversationHistory?: Array<{ role: string; parts: string }>,
  actionsContext?: ChatActionsContext
): Promise<SendMessageResult> {
  try {
    const genAI = getGoogleAI();

    // Construir contexto del mapa
    const mapContext = buildMapContext(markers, center);

    // Configurar modelo con o sin herramientas
    const modelConfig: any = {
      model: MODEL_NAME,
    };

    // Si hay contexto de acciones, agregar herramientas
    if (actionsContext) {
      modelConfig.tools = [
        {
          functionDeclarations: convertToolsToFunctionDeclarations(),
        },
      ];
    }

    const model = genAI.getGenerativeModel(modelConfig);

    // Construir historial del chat
    const chatHistory: any[] = [];

    // Mensaje del sistema con contexto
    chatHistory.push({
      role: "user",
      parts: [{
        text: `Eres un asistente virtual especializado en ayudar con mapas interactivos y ubicaciones.

${mapContext}

Tu función es:
1. Ayudar al usuario a gestionar marcadores en el mapa usando las herramientas disponibles
2. Proporcionar información sobre ubicaciones
3. Sugerir lugares según las necesidades del usuario
4. Responder preguntas sobre los marcadores existentes

IMPORTANTE: Cuando el usuario pida agregar, buscar o gestionar marcadores, DEBES usar las herramientas disponibles (add_marker, search_location, list_markers, etc.).
No solo describas lo que harías, EJECUTA las herramientas.

Responde de forma concisa, amigable y útil.`,
      }],
    });

    chatHistory.push({
      role: "model",
      parts: [{ text: "Entendido. Estoy listo para ayudarte con el mapa. Puedo agregar marcadores, buscar lugares, listar tus ubicaciones y más. ¿Qué necesitas?" }],
    });

    // Agregar historial previo
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.forEach((msg) => {
        chatHistory.push({
          role: msg.role === "model" ? "model" : "user",
          parts: [{ text: msg.parts }],
        });
      });
    }

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // Enviar mensaje del usuario
    let result = await chat.sendMessage(userMessage);
    let response = result.response;

    const toolsUsed: Array<{ name: string; parameters: Record<string, any>; result: ToolResult }> = [];

    // Verificar si hay function calls
    const functionCalls = response.functionCalls?.() || [];

    if (actionsContext && functionCalls.length > 0) {
      console.log("🔧 Function calls detectados:", functionCalls.length);

      for (const call of functionCalls) {
        console.log("  → Ejecutando:", call.name, call.args);

        // Ejecutar la herramienta
        const toolResult = await executeTool(call.name, call.args, actionsContext);
        toolsUsed.push({
          name: call.name,
          parameters: call.args,
          result: toolResult,
        });

        // Enviar resultado de vuelta a la IA
        const functionResponse = [{
          functionResponse: {
            name: call.name,
            response: toolResult,
          },
        }];

        // Continuar la conversación
        result = await chat.sendMessage(functionResponse);
        response = result.response;
      }
    }

    const responseText = response.text();

    return {
      text: responseText,
      toolsUsed: toolsUsed.length > 0 ? toolsUsed : undefined,
    };
  } catch (error) {
    console.error("Error al comunicarse con Google AI:", error);

    if (error instanceof Error) {
      if (error.message.includes("API") || error.message.includes("key")) {
        throw new Error(
          "Error de configuración: API Key no válida o no configurada",
        );
      }
      throw new Error(`Error al comunicarse con la IA: ${error.message}`);
    }

    throw new Error("Error desconocido al comunicarse con la IA");
  }
}

/**
 * Envía un mensaje con respuesta streaming (para futuras mejoras)
 * TODO: Implementar streaming con el SDK @google/generative-ai
 */
export async function* sendMessageStream(
  userMessage: string,
  markers: AddressEntry[],
  center?: { lat: number; lng: number } | null,
): AsyncGenerator<string, void, unknown> {
  try {
    const genAI = getGoogleAI();
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    const mapContext = buildMapContext(markers, center);
    const prompt = `Eres un asistente de mapas.\n\n${mapContext}\n\nUsuario: ${userMessage}\n\nAsistente:`;

    const result = await model.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        yield text;
      }
    }
  } catch (error) {
    console.error("Error en streaming:", error);
    throw error;
  }
}
