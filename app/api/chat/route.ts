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
          if (value.items) {
            acc[key].items = {
              type: value.items.type.toUpperCase() as any,
            };
          }
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

HERRAMIENTAS DISPONIBLES:
- Tienes acceso a una herramienta especial llamada 'search_web'. ÚSALA SIEMPRE que necesites información del mundo real, actual o que no esté en tu conocimiento base (ej: "restaurantes abiertos ahora", "dirección de X sitio", "eventos en Madrid").
- NO inventes direcciones ni lugares. Si no lo sabes, usa 'search_web'.

WORKFLOW DE BÚSQUEDA Y AGREGADO:
1. BÚSQUEDA: Cuando el usuario pregunte por lugares (ej: "farmacias de guardia", "restaurantes italianos"), PRIMERO usa la herramienta 'search_web' para encontrar información real.
2. PRESENTACIÓN: El sistema te devolverá un resumen con los lugares encontrados. Preséntalos al usuario.
3. AGREGADO: SI el usuario elige una opción para añadir (ej: "añade la primera"), ENTONCES:
   a. Usa la herramienta 'search_location'. IMPORTANTE: En el parámetro 'query', usa SOLO la calle y el número (ej: "Calle Fernando Guanarteme, 46"). ELIMINA el nombre del negocio, código postal, ciudad y provincia, o la búsqueda fallará.
   b. Usa la herramienta 'add_marker' con los datos obtenidos para guardarlo en el mapa.

IMPORTANTE: Cuando el usuario pida agregar, buscar o gestionar marcadores, DEBES usar las herramientas disponibles.
No solo describas lo que harías, EJECUTA las herramientas.

Responde de forma concisa, amigable y útil.`;

    // Configurar herramientas
    // Nota: googleSearch está disponible en versiones recientes de @google/generative-ai
    const tools: Tool[] = [
      {
        functionDeclarations: convertToolsToFunctionDeclarations(),
      },
      // {
      //   // @ts-ignore - googleSearch puede no estar en los tipos de la versión instalada pero es soportado por la API
      //   googleSearch: {},
      // },
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

    // Manejo de Function Calling (Iterativo para soportar secuencias como search -> add)
    let functionCalls = response.functionCalls();
    let depth = 0;
    const MAX_DEPTH = 5;

    while (functionCalls && functionCalls.length > 0 && depth < MAX_DEPTH) {
      depth++;
      console.log(
        `🔧 Function calls detectados en servidor (Profundidad ${depth}):`,
        functionCalls.length,
      );

      // Ejecutar todas las llamadas de este turno
      const functionResponses = [];
      
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

        // Preparar respuesta para la IA
        functionResponses.push({
          functionResponse: {
            name: call.name,
            response: toolResult,
          },
        });
      }

      // Enviar resultados de vuelta a la IA
      if (functionResponses.length > 0) {
        // Continuar la conversación con los resultados
        result = await chat.sendMessage(functionResponses);
        response = await result.response;
        
        // Verificar si hay NUEVAS llamadas a funciones en la respuesta
        functionCalls = response.functionCalls();
      } else {
        functionCalls = undefined;
      }
      
      // Actualizar texto final
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
