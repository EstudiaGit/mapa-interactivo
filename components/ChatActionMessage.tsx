// components/ChatActionMessage.tsx
"use client";

import { motion } from "framer-motion";
import { type FC } from "react";
import type { ActionMetadata } from "@/hooks/useChatStore";

interface ChatActionMessageProps {
  metadata: ActionMetadata;
  timestamp?: number;
}

/**
 * Componente ChatActionMessage - Renderiza mensajes de acciones ejecutadas por la IA.
 * 
 * @component
 * @description
 * Muestra de forma visual cuando la IA ejecuta una acción (agregar marcador, centrar mapa, etc.)
 * con iconos y estilos distintivos.
 */
const ChatActionMessage: FC<ChatActionMessageProps> = ({ metadata, timestamp }) => {
  const { toolName, parameters, result } = metadata;

  // Iconos según el tipo de herramienta
  const getToolIcon = (tool: string): string => {
    switch (tool) {
      case "add_marker":
        return "📍";
      case "remove_marker":
        return "🗑️";
      case "list_markers":
        return "📋";
      case "center_map":
        return "🎯";
      case "search_location":
        return "🔍";
      default:
        return "🤖";
    }
  };

  // Nombre legible de la herramienta
  const getToolLabel = (tool: string): string => {
    switch (tool) {
      case "add_marker":
        return "Agregar Marcador";
      case "remove_marker":
        return "Eliminar Marcador";
      case "list_markers":
        return "Listar Marcadores";
      case "center_map":
        return "Centrar Mapa";
      case "search_location":
        return "Buscar Ubicación";
      default:
        return tool;
    }
  };

  // Descripción de los parámetros
  const getParametersDescription = (): string => {
    if (toolName === "add_marker") {
      return `"${parameters.name}" en [${parameters.latitude?.toFixed(4)}, ${parameters.longitude?.toFixed(4)}]`;
    }
    if (toolName === "center_map") {
      return `[${parameters.latitude?.toFixed(4)}, ${parameters.longitude?.toFixed(4)}]`;
    }
    if (toolName === "search_location") {
      return `"${parameters.query}"`;
    }
    return JSON.stringify(parameters, null, 2);
  };

  return (
    <motion.div
      className="flex justify-start mb-4"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`
          max-w-[80%] px-4 py-3 rounded-lg shadow-md border-l-4
          ${
            result.success
              ? "bg-green-900/30 border-green-500 text-green-100"
              : "bg-red-900/30 border-red-500 text-red-100"
          }
        `}
      >
        {/* Encabezado de la acción */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl" role="img" aria-label={getToolLabel(toolName)}>
            {getToolIcon(toolName)}
          </span>
          <span className="font-semibold text-sm">
            {getToolLabel(toolName)}
          </span>
          {result.success ? (
            <span className="text-xs bg-green-700 px-2 py-0.5 rounded-full">Éxito</span>
          ) : (
            <span className="text-xs bg-red-700 px-2 py-0.5 rounded-full">Error</span>
          )}
        </div>

        {/* Detalles de los parámetros */}
        <div className="text-sm mb-2 opacity-90">
          <strong>Parámetros:</strong> {getParametersDescription()}
        </div>

        {/* Resultado */}
        <div className="text-sm">
          {result.success ? (
            <div className="text-green-200">
              ✓ {result.message || "Acción completada exitosamente"}
            </div>
          ) : (
            <div className="text-red-200">
              ✗ {result.error || "Error al ejecutar la acción"}
            </div>
          )}
        </div>

        {/* Timestamp */}
        {timestamp && (
          <p className="text-xs opacity-60 mt-2">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ChatActionMessage;
