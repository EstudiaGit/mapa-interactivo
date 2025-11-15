// hooks/useModalStore.ts
"use client";

import { create } from "zustand";

/**
 * Tipos de modales disponibles
 */
export type ModalType = "confirm" | "prompt";

/**
 * Configuración base para un modal
 */
interface BaseModalConfig {
  id: string;
  type: ModalType;
  title: string;
}

/**
 * Configuración para un modal de confirmación
 */
export interface ConfirmModalConfig extends BaseModalConfig {
  type: "confirm";
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
  onConfirm: () => void;
  onCancel?: () => void;
}

/**
 * Configuración para un modal de prompt
 */
export interface PromptModalConfig extends BaseModalConfig {
  type: "prompt";
  message?: string;
  defaultValue?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  validate?: (value: string) => string | null;
  onConfirm: (value: string) => void;
  onCancel?: () => void;
}

/**
 * Union type de todas las configuraciones de modales
 */
export type ModalConfig = ConfirmModalConfig | PromptModalConfig;

/**
 * Estado del store de modales
 */
type ModalStoreState = {
  /** Stack de modales activos */
  modals: ModalConfig[];
  /** Agregar un modal al stack */
  addModal: (config: Omit<ModalConfig, "id">) => string;
  /** Remover un modal por ID */
  removeModal: (id: string) => void;
  /** Limpiar todos los modales */
  clearAll: () => void;
};

/**
 * Generar ID único para modales
 */
function generateId(): string {
  return `modal_${Math.random().toString(36).slice(2)}_${Date.now()}`;
}

/**
 * Store de Zustand para gestionar modales globalmente.
 * 
 * @description
 * Permite gestionar múltiples modales simultáneamente con un stack.
 * Los modales se pueden agregar y remover dinámicamente.
 * 
 * @example
 * ```tsx
 * const addModal = useModalStore((s) => s.addModal);
 * const id = addModal({
 *   type: "confirm",
 *   title: "Confirmar",
 *   message: "¿Estás seguro?",
 *   onConfirm: () => console.log("Confirmado"),
 * });
 * ```
 */
export const useModalStore = create<ModalStoreState>((set) => ({
  modals: [],

  addModal: (config) => {
    const id = generateId();
    const modal = { ...config, id } as ModalConfig;
    set((state) => ({ modals: [...state.modals, modal] }));
    return id;
  },

  removeModal: (id) => {
    set((state) => ({
      modals: state.modals.filter((modal) => modal.id !== id),
    }));
  },

  clearAll: () => {
    set({ modals: [] });
  },
}));
