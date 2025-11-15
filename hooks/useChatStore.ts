// hooks/useChatStore.ts
"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

/**
 * Tipo de mensaje en el chat
 */
export type MessageRole = "user" | "assistant" | "system" | "action";

/**
 * Metadata de una acción ejecutada por la IA
 */
export interface ActionMetadata {
  toolName: string;
  parameters: Record<string, any>;
  result: {
    success: boolean;
    data?: any;
    error?: string;
    message?: string;
  };
}

/**
 * Estructura de un mensaje en el chat
 */
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  metadata?: ActionMetadata; // Metadata adicional para mensajes de tipo "action"
}

/**
 * Estado del chat
 */
export interface ChatState {
  /** Mensajes del chat */
  messages: ChatMessage[];
  /** Si está cargando una respuesta */
  isLoading: boolean;
  /** Error actual, si hay alguno */
  error: string | null;
  
  /** Agregar un mensaje al chat */
  addMessage: (role: MessageRole, content: string, metadata?: ActionMetadata) => string;
  /** Establecer estado de carga */
  setLoading: (loading: boolean) => void;
  /** Establecer error */
  setError: (error: string | null) => void;
  /** Limpiar historial de chat */
  clearChat: () => void;
  /** Obtener historial formateado para la IA */
  getHistory: () => Array<{ role: string; parts: string }>;
}

/**
 * Generar ID único para mensajes
 */
function generateMessageId(): string {
  return `msg_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

/**
 * Store de Zustand para gestionar el estado del chat
 */
export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [],
      isLoading: false,
      error: null,

      addMessage: (role, content, metadata) => {
        const id = generateMessageId();
        const message: ChatMessage = {
          id,
          role,
          content,
          timestamp: Date.now(),
          metadata,
        };
        
        set((state) => ({
          messages: [...state.messages, message],
          error: null, // Limpiar error al agregar mensaje
        }));
        
        return id;
      },

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      clearChat: () => set({ messages: [], error: null, isLoading: false }),

      getHistory: () => {
        const messages = get().messages;
        // Filtrar solo mensajes de usuario, asistente y action para el historial
        return messages
          .filter((msg) => msg.role === "user" || msg.role === "assistant" || msg.role === "action")
          .map((msg) => ({
            role: msg.role === "assistant" || msg.role === "action" ? "model" : "user",
            parts: msg.content,
          }));
      },
    }),
    {
      name: "chat-store",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        messages: state.messages,
      }),
    }
  )
);
