// hooks/useModal.ts
"use client";

import { useCallback } from "react";
import { useModalStore, type ConfirmModalConfig, type PromptModalConfig } from "./useModalStore";

/**
 * Opciones para showConfirm
 */
export interface ShowConfirmOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

/**
 * Opciones para showPrompt
 */
export interface ShowPromptOptions {
  title: string;
  message?: string;
  defaultValue?: string;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
  validate?: (value: string) => string | null;
}

/**
 * Hook useModal - API imperativa para mostrar modales.
 * 
 * @description
 * Proporciona funciones para mostrar modales de forma imperativa,
 * similar a window.confirm() y window.prompt(), pero retornando Promises.
 * 
 * @example
 * ```tsx
 * const { showConfirm, showPrompt } = useModal();
 * 
 * // Confirmación
 * const confirmed = await showConfirm({
 *   title: "Eliminar elemento",
 *   message: "¿Estás seguro?",
 *   variant: "danger",
 * });
 * if (confirmed) {
 *   // hacer algo
 * }
 * 
 * // Prompt
 * const value = await showPrompt({
 *   title: "Ingresa tu nombre",
 *   defaultValue: "Juan",
 *   validate: (v) => v.trim() ? null : "Requerido",
 * });
 * if (value !== null) {
 *   console.log("Valor ingresado:", value);
 * }
 * ```
 */
export function useModal() {
  const addModal = useModalStore((s) => s.addModal);
  const removeModal = useModalStore((s) => s.removeModal);

  /**
   * Muestra un diálogo de confirmación.
   * @returns Promise que resuelve a true si se confirma, false si se cancela.
   */
  const showConfirm = useCallback(
    (options: ShowConfirmOptions): Promise<boolean> => {
      return new Promise((resolve) => {
        const config: Omit<ConfirmModalConfig, "id"> = {
          type: "confirm",
          title: options.title,
          message: options.message,
          confirmText: options.confirmText,
          cancelText: options.cancelText,
          variant: options.variant,
          onConfirm: () => {
            resolve(true);
          },
          onCancel: () => {
            resolve(false);
          },
        };

        addModal(config);
      });
    },
    [addModal]
  );

  /**
   * Muestra un diálogo de prompt con input de texto.
   * @returns Promise que resuelve al valor ingresado, o null si se cancela.
   */
  const showPrompt = useCallback(
    (options: ShowPromptOptions): Promise<string | null> => {
      return new Promise((resolve) => {
        const config: Omit<PromptModalConfig, "id"> = {
          type: "prompt",
          title: options.title,
          message: options.message,
          defaultValue: options.defaultValue,
          placeholder: options.placeholder,
          confirmText: options.confirmText,
          cancelText: options.cancelText,
          validate: options.validate,
          onConfirm: (value) => {
            resolve(value);
          },
          onCancel: () => {
            resolve(null);
          },
        };

        addModal(config);
      });
    },
    [addModal]
  );

  return {
    showConfirm,
    showPrompt,
    removeModal,
  };
}
