// hooks/useServerActions.ts
"use client";

import { useCallback } from "react";
import { useMapStore } from "./useMapStore";
import { useToastStore } from "./useToastStore";
import type { AddressEntry } from "./useMapStore";
import type { ToolResult } from "@/lib/chat-tools";

/**
 * Hook para procesar acciones retornadas por el servidor
 * y aplicarlas al store local del cliente
 */
export function useServerActions() {
  const addMarker = useMapStore((s) => s.addMarker);
  const removeMarker = useMapStore((s) => s.removeMarker);
  const setCenter = useMapStore((s) => s.setCenter);
  const setZoom = useMapStore((s) => s.setZoom);
  const toast = useToastStore((s) => s.enqueue);

  /**
   * Procesa una acción individual del servidor
   */
  const processAction = useCallback(
    (
      toolName: string,
      parameters: Record<string, any>,
      result: ToolResult
    ): boolean => {
      if (!result.success) {
        // Mostrar error si la acción falló
        toast({
          type: "error",
          message: result.error || "Error al ejecutar acción",
          timeout: 5000,
        });
        return false;
      }

      // Ejecutar la acción según el tipo
      switch (toolName) {
        case "add_marker": {
          // El servidor retorna el marcador completo con ID
          const markerData = result.data as AddressEntry;
          addMarker(markerData);

          toast({
            type: "success",
            message: `🤖 IA agregó: ${markerData.name}`,
            timeout: 3000,
          });
          return true;
        }

        case "remove_marker": {
          // El servidor retorna el ID del marcador a eliminar
          const { id } = result.data as { id: string };
          removeMarker(id);

          toast({
            type: "info",
            message: `🤖 IA eliminó marcador`,
            timeout: 3000,
          });
          return true;
        }

        case "center_map": {
          // El servidor retorna las coordenadas
          const { latitude, longitude, zoom } = result.data as {
            latitude: number;
            longitude: number;
            zoom?: number;
          };

          setCenter(latitude, longitude);
          if (zoom !== undefined) {
            setZoom(zoom);
          }

          toast({
            type: "info",
            message: `🤖 IA centró el mapa`,
            timeout: 2000,
          });
          return true;
        }

        case "list_markers":
        case "search_location": {
          // Estas acciones solo retornan datos, no modifican el estado
          // La IA usa los datos para responder al usuario
          return true;
        }

        default:
          console.warn(`Acción desconocida: ${toolName}`);
          return false;
      }
    },
    [addMarker, removeMarker, setCenter, setZoom, toast]
  );

  /**
   * Procesa múltiples acciones del servidor
   */
  const processServerActions = useCallback(
    (
      actions: Array<{
        name: string;
        parameters: Record<string, any>;
        result: ToolResult;
      }>
    ): { success: boolean; processed: number; failed: number } => {
      let processed = 0;
      let failed = 0;

      actions.forEach((action) => {
        const success = processAction(
          action.name,
          action.parameters,
          action.result
        );
        if (success) {
          processed++;
        } else {
          failed++;
        }
      });

      return { success: failed === 0, processed, failed };
    },
    [processAction]
  );

  return {
    processAction,
    processServerActions,
  };
}
