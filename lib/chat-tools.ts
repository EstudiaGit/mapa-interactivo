// lib/chat-tools.ts
import type { AddressEntry } from "@/hooks/useMapStore";

/**
 * Definición de una herramienta (tool) que la IA puede usar
 */
export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, {
      type: string;
      description: string;
      enum?: string[];
    }>;
    required: string[];
  };
}

/**
 * Resultado de ejecutar una herramienta
 */
export interface ToolResult {
  success: boolean;
  data?: any;
  error?: string;
  message?: string;
}

/**
 * Contexto de acciones disponibles para el chat
 */
export interface ChatActionsContext {
  addMarker: (name: string, lat: number, lng: number, address?: string, description?: string) => string;
  removeMarker: (id: string) => boolean;
  updateMarker: (id: string, updates: Partial<AddressEntry>) => boolean;
  listMarkers: () => AddressEntry[];
  searchLocation: (query: string) => Promise<any>;
  centerMap: (lat: number, lng: number, zoom?: number) => void;
}

/**
 * Definiciones de todas las herramientas disponibles para la IA
 */
export const AVAILABLE_TOOLS: ToolDefinition[] = [
  {
    name: "add_marker",
    description: "Agrega un nuevo marcador al mapa. Usa esta herramienta cuando el usuario pida agregar, guardar o marcar una ubicación.",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Nombre descriptivo del marcador (ej: 'Cafetería Central', 'Casa de María')",
        },
        latitude: {
          type: "number",
          description: "Latitud de la ubicación (entre -90 y 90)",
        },
        longitude: {
          type: "number",
          description: "Longitud de la ubicación (entre -180 y 180)",
        },
        address: {
          type: "string",
          description: "Dirección completa de la ubicación (opcional)",
        },
        description: {
          type: "string",
          description: "Descripción adicional o notas sobre el lugar (opcional)",
        },
      },
      required: ["name", "latitude", "longitude"],
    },
  },
  {
    name: "remove_marker",
    description: "Elimina un marcador del mapa. Usa esta herramienta cuando el usuario pida eliminar, borrar o quitar un marcador.",
    parameters: {
      type: "object",
      properties: {
        marker_id: {
          type: "string",
          description: "ID del marcador a eliminar. Debes obtenerlo primero con list_markers.",
        },
      },
      required: ["marker_id"],
    },
  },
  {
    name: "list_markers",
    description: "Lista todos los marcadores guardados en el mapa. Usa esta herramienta cuando el usuario pregunte qué marcadores tiene, cuántos son, o quiera ver la lista completa.",
    parameters: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "center_map",
    description: "Centra el mapa en unas coordenadas específicas. Usa esta herramienta cuando el usuario pida ir a una ubicación o centrar el mapa.",
    parameters: {
      type: "object",
      properties: {
        latitude: {
          type: "number",
          description: "Latitud donde centrar el mapa",
        },
        longitude: {
          type: "number",
          description: "Longitud donde centrar el mapa",
        },
        zoom: {
          type: "number",
          description: "Nivel de zoom (opcional, entre 1 y 18)",
        },
      },
      required: ["latitude", "longitude"],
    },
  },
  // DESACTIVADA TEMPORALMENTE - Causa errores 503
  // {
  //   name: "search_location",
  //   description: "Busca una ubicación por nombre o dirección usando geocoding. Usa esta herramienta cuando el usuario mencione un lugar pero no tengas las coordenadas.",
  //   parameters: {
  //     type: "object",
  //     properties: {
  //       query: {
  //         type: "string",
  //         description: "Nombre del lugar o dirección a buscar (ej: 'Torre Eiffel', 'Calle Mayor 5, Madrid')",
  //       },
  //     },
  //     required: ["query"],
  //   },
  // },
];

/**
 * Ejecuta una herramienta con los parámetros dados
 */
export async function executeTool(
  toolName: string,
  parameters: Record<string, any>,
  context: ChatActionsContext
): Promise<ToolResult> {
  try {
    switch (toolName) {
      case "add_marker": {
        const { name, latitude, longitude, address, description } = parameters;
        
        // Validar coordenadas
        if (latitude < -90 || latitude > 90) {
          return {
            success: false,
            error: "Latitud inválida (debe estar entre -90 y 90)",
          };
        }
        if (longitude < -180 || longitude > 180) {
          return {
            success: false,
            error: "Longitud inválida (debe estar entre -180 y 180)",
          };
        }
        
        const markerId = context.addMarker(name, latitude, longitude, address, description);
        return {
          success: true,
          data: { markerId, name, latitude, longitude },
          message: `Marcador "${name}" agregado exitosamente en [${latitude.toFixed(4)}, ${longitude.toFixed(4)}]`,
        };
      }

      case "remove_marker": {
        const { marker_id } = parameters;
        const success = context.removeMarker(marker_id);
        
        if (!success) {
          return {
            success: false,
            error: "No se encontró el marcador con ese ID",
          };
        }
        
        return {
          success: true,
          message: "Marcador eliminado exitosamente",
        };
      }

      case "list_markers": {
        const markers = context.listMarkers();
        return {
          success: true,
          data: markers,
          message: `Se encontraron ${markers.length} marcadores`,
        };
      }

      case "center_map": {
        const { latitude, longitude, zoom } = parameters;
        context.centerMap(latitude, longitude, zoom);
        return {
          success: true,
          message: `Mapa centrado en [${latitude.toFixed(4)}, ${longitude.toFixed(4)}]`,
        };
      }

      case "search_location": {
        const { query } = parameters;
        const result = await context.searchLocation(query);
        
        if (!result || result.length === 0) {
          return {
            success: false,
            error: `No se encontraron resultados para "${query}"`,
          };
        }
        
        return {
          success: true,
          data: result[0], // Primer resultado
          message: `Ubicación encontrada: ${result[0].display_name}`,
        };
      }

      default:
        return {
          success: false,
          error: `Herramienta desconocida: ${toolName}`,
        };
    }
  } catch (error) {
    console.error(`Error ejecutando tool ${toolName}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
