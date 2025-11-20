// app/api/chat/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, type FunctionDeclaration, type Tool } from "@google/generative-ai";
import type { AddressEntry } from "@/hooks/useMapStore";
import { AVAILABLE_TOOLS, type ToolResult } from "@/lib/chat-tools";
import { executeServerAction } from "./actions";

/**
 * Convierte las herramientas a formato de functionDeclarations de Gemini
 */
function convertToolsToFunctionDeclarations(): FunctionDeclaration[] {
  return AVAILABLE_TOOLS.map((tool) => ({
    name: tool.name,
    description: tool.description,
    parameters: {
      type: "OBJECT" as any, // Usamos any para evitar problemas de tipos estrictos por ahora
      properties: Object.entries(tool.parameters.properties).reduce(
        (acc, [key, value]) => {
          acc[key] = {
            type: value.type.toUpperCase() as any,
            description: value.description,
          };
          return acc;
        },
        {} as any,
      ),
      required: tool.parameters.required,
    },
  }));
}

/**
 * Construye el contexto del mapa para incluir en los prompts
 */
function buildMapContext(
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
 * POST /api/chat
 * Endpoint para comunicación segura con Google AI
 */
export async function POST(request: NextRequest) {
  try {
    // Parsear el body
    const body = await request.json();
    const {
      userMessage,
      markers = [],
      center = null,
      conversationHistory = [],
    } = body;

    // Validar inputs
    if (!userMessage || typeof userMessage !== "string") {
      return NextResponse.json(
        { error: "userMessage es requerido" },
        { status: 400 },
      );
    }

    // Obtener API key del servidor (segura)
    const apiKey = process.env.GOOGLE_AI_API_KEY;

    if (!apiKey) {
      console.error("❌ GOOGLE_AI_API_KEY no está configurada");
      return NextResponse.json(
        {
          error:
            "Configuración del servidor incorrecta. Falta GOOGLE_AI_API_KEY",
        },
        { status: 500 },
      );
    }

    // Inicializar Google AI
    const genAI = new GoogleGenerativeAI(apiKey);

    // Construir contexto del mapa
    const mapContext = buildMapContext(markers, center);

    // Mensaje del sistema
    const systemInstruction = `Eres un asistente virtual especializado en ayudar con mapas interactivos y ubicaciones.

${mapContext}

Tu función es:
1. Ayudar al usuario a gestionar marcadores en el mapa usando las herramientas disponibles
2. Proporcionar información sobre ubicaciones
3. Sugerir lugares según las necesidades del usuario
4. Responder preguntas sobre los marcadores existentes

WORKFLOW DE BÚSQUEDA Y AGREGADO:
- Cuando el usuario pregunte por lugares (ej: "farmacias de guardia", "restaurantes italianos"), PRIMERO usa tu capacidad de búsqueda (Google Search) para encontrar información real y actualizada.
- Presenta las opciones encontradas al usuario con sus direcciones.
- SI el usuario elige una opción para añadir (ej: "añade la primera"), ENTONCES:
  1. Usa la herramienta 'search_location' con el nombre/dirección para obtener las coordenadas precisas.
  2. Usa la herramienta 'add_marker' con los datos obtenidos para guardarlo en el mapa.

IMPORTANTE: Cuando el usuario pida agregar, buscar o gestionar marcadores, DEBES usar las herramientas disponibles.
No solo describas lo que harías, EJECUTA las herramientas.

Responde de forma concisa, amigable y útil.`;

    // Configurar herramientas
    // Nota: googleSearch está disponible en versiones recientes de @google/generative-ai
    const tools: Tool[] = [
      {
        functionDeclarations: convertToolsToFunctionDeclarations(),
      },
      {
        // @ts-ignore - googleSearch puede no estar en los tipos de la versión instalada pero es soportado por la API
        googleSearch: {},
      },
    ];

    // Obtener modelo
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash", // IMPERATIVO: Usar gemini-2.5-flash
      systemInstruction: systemInstruction,
      tools: tools,
    });

    // Preparar historial
    const history = conversationHistory.map((msg: any) => ({
      role: msg.role === "assistant" ? "model" : "user", // Mapeo correcto para old SDK
      parts: [{ text: msg.parts }],
    }));

    // Iniciar chat
    const chat = model.startChat({
      history: history,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // Enviar mensaje
    let result = await chat.sendMessage(userMessage);
    let response = await result.response;
    let responseText = response.text();

    const toolsUsed: Array<{
      name: string;
      parameters: Record<string, any>;
      result: ToolResult;
    }> = [];

    // Manejo de Function Calling
    const functionCalls = response.functionCalls();

    if (functionCalls && functionCalls.length > 0) {
      console.log(
        "🔧 Function calls detectados en servidor:",
        functionCalls.length,
      );

      for (const call of functionCalls) {
        console.log("  → Ejecutando:", call.name, call.args);

        // Ejecutar la acción en el servidor
        const toolResult = await executeServerAction(
          call.name,
          call.args || {},
          markers,
        );

        toolsUsed.push({
          name: call.name,
          parameters: call.args || {},
          result: toolResult,
        });

        // Enviar resultado de vuelta a la IA
        const functionResponse = [
          {
            functionResponse: {
              name: call.name,
              response: toolResult,
            },
          },
        ];

        // Continuar la conversación con el resultado
        result = await chat.sendMessage(functionResponse);
        response = await result.response;
      }
      
      // Actualizar texto final después de las herramientas
      responseText = response.text();
    }

    // Retornar respuesta
    return NextResponse.json({
      text: responseText,
      toolsUsed: toolsUsed.length > 0 ? toolsUsed : undefined,
    });
  } catch (error) {
    console.error("❌ Error en API Route /api/chat:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Error al procesar el mensaje",
      },
      { status: 500 },
    );
  }
}
