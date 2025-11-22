// lib/colors.ts
// Sistema de color-coding determinista para grupos

/**
 * Paleta de colores para grupos (tomada de Tailwind CSS)
 * Se usa un hash del nombre del grupo para seleccionar un color de forma consistente
 */
export const GROUP_COLORS = [
  '#ef4444', // red-500 - Rojo vibrante
  '#f97316', // orange-500 - Naranja energético
  '#84cc16', // lime-500 - Verde lima
  '#10b981', // emerald-500 - Verde esmeralda
  '#06b6d4', // cyan-500 - Cyan brillante
  '#3b82f6', // blue-500 - Azul eléctrico
  '#8b5cf6', // violet-500 - Violeta
  '#d946ef', // fuchsia-500 - Fucsia
  '#ec4899', // pink-500 - Rosa
  '#f59e0b', // amber-500 - Ámbar
] as const;

/**
 * Color especial para el grupo "Inbox" (gris neutro)
 */
export const INBOX_COLOR = '#6b7280'; // gray-500

/**
 * Función hash simple para convertir un string a un número
 * Suma los códigos ASCII de todos los caracteres
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
  }
  return hash;
}

/**
 * Obtiene un color consistente para un nombre de grupo
 * 
 * @param groupName - Nombre del grupo
 * @returns Color hex (ej: "#ef4444")
 * 
 * @example
 * getGroupColor("Inbox") // "#6b7280" (siempre gris)
 * getGroupColor("Farmacia") // "#84cc16" (siempre el mismo verde)
 * getGroupColor("Trabajo") // "#8b5cf6" (siempre el mismo violeta)
 */
export function getGroupColor(groupName: string): string {
  // Caso especial: Inbox siempre es gris
  if (groupName === 'Inbox') {
    return INBOX_COLOR;
  }

  // Para otros grupos, usar hash determinista
  const hash = hashString(groupName);
  const colorIndex = hash % GROUP_COLORS.length;
  return GROUP_COLORS[colorIndex];
}

/**
 * Variante más oscura del color (útil para hover states)
 * Reduce ligeramente el brillo del color
 */
export function getDarkerShade(hexColor: string): string {
  // Convertir hex a RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Reducir brillo en 20%
  const darkerR = Math.floor(r * 0.8);
  const darkerG = Math.floor(g * 0.8);
  const darkerB = Math.floor(b * 0.8);

  // Convertir de vuelta a hex
  return `#${darkerR.toString(16).padStart(2, '0')}${darkerG.toString(16).padStart(2, '0')}${darkerB.toString(16).padStart(2, '0')}`;
}

/**
 * Obtiene todos los colores únicos usados en un array de grupos
 * Útil para leyendas o filtros visuales
 */
export function getUsedColors(groupNames: string[]): Map<string, string> {
  const colorMap = new Map<string, string>();
  groupNames.forEach(group => {
    colorMap.set(group, getGroupColor(group));
  });
  return colorMap;
}
