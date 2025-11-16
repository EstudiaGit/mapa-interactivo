// app/api/chat/actions.ts
import type { AddressEntry } from "@/hooks/useMapStore";
import type { ToolResult } from "@/lib/chat-tools";

/**
 * Genera un ID único para marcadores
 */
function generateId(): string {
  return `marker_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

/**
 * Busca una ubicación usando Nominatim (OpenStreetMap)
 */
async function searchLocation(query: string): Promise<any> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
    );

    if (!response.ok) {
      throw new Error("Error en la búsqueda");
    }

    const results = await response.json();
    return results;
  } catch (error) {
    console.error("Error buscando ubicación:", error);
    return [];
  }
}

/**
 * Ejecuta una acción en el servidor y retorna el resultado
 * Las acciones NO modifican el store directamente (está en el cliente)
 * En su lugar, retornan datos para que el cliente los aplique
 */
export async function executeServerAction(
  toolName: string,
  parameters: Record<string, any>,
  currentMarkers: AddressEntry[]
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

        // Generar ID para el nuevo marcador
        const markerId = generateId();

        // Retornar datos del marcador para que el cliente lo agregue
        return {
          success: true,
          data: {
            id: markerId,
            name,
            coordinates: { lat: latitude, lng: longitude },
            address: address || "",
            description: description || "",
            CP: "",
          },
          message: `Marcador "${name}" creado exitosamente en [${latitude.toFixed(4)}, ${longitude.toFixed(4)}]`,
        };
      }

      case "remove_marker": {
        const { marker_id } = parameters;

        // Verificar que el marcador existe
        const markerExists = currentMarkers.some((m) => m.id === marker_id);

        if (!markerExists) {
          return {
            success: false,
            error: "No se encontró el marcador con ese ID",
          };
        }

        // Retornar ID para que el cliente lo elimine
        return {
          success: true,
          data: { id: marker_id },
          message: "Marcador eliminado exitosamente",
        };
      }

      case "list_markers": {
        // Retornar la lista actual de marcadores
        return {
          success: true,
          data: currentMarkers,
          message: `Se encontraron ${currentMarkers.length} marcadores`,
        };
      }

      case "center_map": {
        const { latitude, longitude, zoom } = parameters;

        // Retornar coordenadas para que el cliente centre el mapa
        return {
          success: true,
          data: {
            latitude,
            longitude,
            zoom: zoom || undefined,
          },
          message: `Mapa centrado en [${latitude.toFixed(4)}, ${longitude.toFixed(4)}]`,
        };
      }

      case "search_location": {
        const { query } = parameters;

        // Buscar ubicación
        const result = await searchLocation(query);

        if (!result || result.length === 0) {
          return {
            success: false,
            error: `No se encontraron resultados para "${query}"`,
          };
        }

        // Retornar primer resultado
        return {
          success: true,
          data: result[0],
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
    console.error(`Error ejecutando tool ${toolName} en servidor:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
