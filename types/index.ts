// ============================================================
// TIPOS CENTRALIZADOS - Sistema de Gestión de Ubicaciones
// ============================================================

export type MarkerId = string;

export type Coordinates = {
  lat: number;
  lng: number;
};

/**
 * DEFAULT_GROUP es el grupo por defecto para ubicaciones sin categorizar
 * Se usa en la migración de datos legacy
 */
export const DEFAULT_GROUP = 'Inbox' as const;

/**
 * Location (antes AddressEntry)
 * Representa una ubicación guardada con sus metadatos
 * 
 * NUEVO en esta versión:
 * - group: Carpeta/categoría a la que pertenece
 * - tags: Etiquetas descriptivas opcionales
 */
export interface Location {
  id: MarkerId;
  name: string;
  description: string;
  address: string;
  CP: string;
  coordinates: Coordinates;
  
  // NUEVOS CAMPOS - v4
  group: string;      // Obligatorio (Default: "Inbox")
  tags?: string[];    // Opcional
}

/**
 * Tipo helper para creación de ubicaciones (sin id)
 * group es opcional en la entrada, normalizeLocation lo añadirá
 */
export type LocationInput = Omit<Location, 'id' | 'group'> & { 
  id?: MarkerId;
  group?: string;
};

/**
 * Tipo helper para actualizaciones parciales
 */
export type LocationPatch = Partial<Pick<Location, 'name' | 'description' | 'address' | 'CP' | 'group' | 'tags'>>;

/**
 * Helper para normalizar ubicaciones legacy
 * Asegura que todos los campos requeridos existan
 */
export const normalizeLocation = (loc: Partial<Location>): Location => ({
  id: loc.id || '',
  name: loc.name || '(Sin título)',
  description: loc.description || '',
  address: loc.address || '',
  CP: loc.CP || '',
  coordinates: loc.coordinates || { lat: 0, lng: 0 },
  group: loc.group || DEFAULT_GROUP,
  tags: loc.tags || [],
});

/**
 * Helper para obtener grupos únicos de un array de ubicaciones
 */
export const getUniqueGroups = (locations: Location[]): string[] => {
  const groups = new Set<string>();
  locations.forEach((loc) => groups.add(loc.group));
  return Array.from(groups).sort((a, b) => {
    // "Inbox" siempre primero
    if (a === DEFAULT_GROUP) return -1;
    if (b === DEFAULT_GROUP) return 1;
    return a.localeCompare(b);
  });
};

/**
 * Helper para obtener estadísticas de grupos
 * Retorna un objeto con el conteo de ubicaciones por grupo
 */
export const getGroupStats = (locations: Location[]): Record<string, number> => {
  return locations.reduce((acc, loc) => {
    acc[loc.group] = (acc[loc.group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
};

/**
 * Helper para agrupar ubicaciones por grupo
 * Usado para renderizado jerárquico en el Sidebar
 */
export const groupLocations = (locations: Location[]): Record<string, Location[]> => {
  return locations.reduce((acc, loc) => {
    (acc[loc.group] = acc[loc.group] || []).push(loc);
    return acc;
  }, {} as Record<string, Location[]>);
};
