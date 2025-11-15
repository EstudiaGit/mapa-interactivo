// hooks/useChatActions.ts
"use client";

import { useCallback } from "react";
import { useMapStore } from "./useMapStore";
import { useToastStore } from "./useToastStore";
import type { ChatActionsContext } from "@/lib/chat-tools";
import type { AddressEntry } from "./useMapStore";

/**
 * Hook que proporciona acciones del mapa para que la IA las use
 */
export function useChatActions(): ChatActionsContext {
  const addMarkerToStore = useMapStore((s) => s.addMarker);
  const removeMarkerFromStore = useMapStore((s) => s.removeMarker);
  const updateMarkerInStore = useMapStore((s) => s.updateMarker);
  const markers = useMapStore((s) => s.markers);
  const setCenter = useMapStore((s) => s.setCenter);
  const setZoom = useMapStore((s) => s.setZoom);
  const toast = useToastStore((s) => s.enqueue);

  /**
   * Agrega un nuevo marcador al mapa
   */
  const addMarker = useCallback(
    (name: string, lat: number, lng: number, address?: string, description?: string): string => {
      const id = addMarkerToStore({
        name,
        coordinates: { lat, lng },
        address: address || "",
        description: description || "",
        CP: "",
      });

      toast({
        type: "success",
        message: `🤖 IA agregó: ${name}`,
        timeout: 3000,
      });

      return id;
    },
    [addMarkerToStore, toast]
  );

  /**
   * Elimina un marcador del mapa
   */
  const removeMarker = useCallback(
    (id: string): boolean => {
      const marker = markers.find((m) => m.id === id);
      if (!marker) return false;

      removeMarkerFromStore(id);
      
      toast({
        type: "info",
        message: `🤖 IA eliminó: ${marker.name}`,
        timeout: 3000,
      });

      return true;
    },
    [markers, removeMarkerFromStore, toast]
  );

  /**
   * Actualiza un marcador existente
   */
  const updateMarker = useCallback(
    (id: string, updates: Partial<AddressEntry>): boolean => {
      const marker = markers.find((m) => m.id === id);
      if (!marker) return false;

      updateMarkerInStore(id, updates);
      
      toast({
        type: "success",
        message: `🤖 IA actualizó: ${marker.name}`,
        timeout: 3000,
      });

      return true;
    },
    [markers, updateMarkerInStore, toast]
  );

  /**
   * Lista todos los marcadores
   */
  const listMarkers = useCallback((): AddressEntry[] => {
    return markers;
  }, [markers]);

  /**
   * Busca una ubicación usando Nominatim (OpenStreetMap)
   */
  const searchLocation = useCallback(async (query: string): Promise<any> => {
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
  }, []);

  /**
   * Centra el mapa en unas coordenadas
   */
  const centerMap = useCallback(
    (lat: number, lng: number, zoom?: number): void => {
      setCenter(lat, lng);
      if (zoom !== undefined) {
        setZoom(zoom);
      }
      
      toast({
        type: "info",
        message: `🤖 IA centró el mapa`,
        timeout: 2000,
      });
    },
    [setCenter, setZoom, toast]
  );

  return {
    addMarker,
    removeMarker,
    updateMarker,
    listMarkers,
    searchLocation,
    centerMap,
  };
}
