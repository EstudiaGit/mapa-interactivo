// Esqueleto de store para el mapa (Zustand)
// Nota: instala la dependencia antes de usarlo:
//   npm install zustand

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { 
  MarkerId, 
  Location, 
  LocationInput, 
  LocationPatch 
} from "@/types";
import { normalizeLocation, DEFAULT_GROUP } from "@/types";

// Alias para retrocompatibilidad: AddressEntry ahora es Location
export type { Location as AddressEntry, MarkerId };


export type MapState = {
  markers: Location[];
  selectedId: MarkerId | null;
  // view state (opcional)
  center: { lat: number; lng: number } | null;
  zoom: number | null;

  // actions
  addMarker: (entry: LocationInput) => MarkerId;
  removeMarker: (id: MarkerId) => void;
  renameMarker: (id: MarkerId, name: string) => void; // renombrar por "name"
  updateMarker: (id: MarkerId, patch: LocationPatch) => void;
  setCenter: (lat: number, lng: number) => void;
  setZoom: (zoom: number) => void;
  selectMarker: (id: MarkerId | null) => void;
  clear: () => void;
};

function genId(): MarkerId {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Fallback
  return `m_${Math.random().toString(36).slice(2)}_${Date.now().toString(36)}`;
}

export const useMapStore = create<MapState>()(
  persist(
    (set) => ({
      markers: [],
      selectedId: null,
      center: null,
      zoom: null,

      addMarker: (entry) => {
        const id = entry.id ?? genId();
        // Normalizar entrada para asegurar group y tags existan
        const normalized = normalizeLocation({ ...entry, id });
        const newEntry: Location = {
          ...normalized,
          id, // Asegurar ID correcto
        };
        set((s) => ({ markers: [...s.markers, newEntry] }));
        return id;
      },

      removeMarker: (id) => set((s) => ({
        markers: s.markers.filter((m) => m.id !== id),
        selectedId: s.selectedId === id ? null : s.selectedId,
      })),

      renameMarker: (id, name) => set((s) => ({
        markers: s.markers.map((m) => (m.id === id ? { ...m, name } : m)),
      })),

      updateMarker: (id, patch) => set((s) => ({
        markers: s.markers.map((m) => (m.id === id ? { ...m, ...patch } : m)),
      })),

      setCenter: (lat, lng) => set({ center: { lat, lng } }),
      setZoom: (zoom) => set({ zoom }),
      selectMarker: (id) => set({ selectedId: id }),
      clear: () => set({ markers: [], selectedId: null }),
    }),
    {
      name: "map-store",
      version: 4,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        markers: state.markers,
        selectedId: state.selectedId,
        center: state.center,
        zoom: state.zoom,
      }),
      migrate: (persistedState: unknown, version) => {
        if (!persistedState || typeof persistedState !== 'object') return persistedState as MapState;
        const state = persistedState as Record<string, unknown>;
        
        // v1 -> v2: Migración del esquema antiguo {id, lat, lng, title?} a AddressEntry
        if (version < 2 && Array.isArray(state.markers)) {
          const migrated = {
            ...state,
            markers: state.markers.map((m: Record<string, unknown>) => normalizeLocation({
              id: (m.id as string) ?? genId(),
              name: (m.title as string) ?? "(Sin título)",
              description: "",
              address: "",
              CP: "",
              coordinates: { lat: m.lat as number, lng: m.lng as number },
              // group y tags se añadirán por normalizeLocation
            })),
          };
          return migrated;
        }
        
        // v2/v3 -> v4: Añadir group y tags a datos existentes
        if (version < 4 && Array.isArray(state.markers)) {
          const migrated = {
            ...state,
            markers: state.markers.map((m: Record<string, unknown>) => 
              normalizeLocation(m as Partial<Location>)
            ),
          };
          return migrated;
        }
        
        return persistedState as MapState;
      },
    }
  )
);

// Sugerencias de integración (próxima sesión):
// - En MapLeaflet: usar useMapEvents para onClick añadir marker con addMarker.
// - En Sidebar: leer markers desde useMapStore((s) => s.markers) y togglear selectMarker.
// - Para centrar el mapa al seleccionar: en MapLeaflet, usar un efecto que observe selectedId/center.
