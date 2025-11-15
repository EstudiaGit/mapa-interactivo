// components/PromptDialog.tsx
"use client";

import { type FC, type FormEvent, useState, useEffect } from "react";
import Modal from "./Modal";

/**
 * Props para el componente PromptDialog
 */
export interface PromptDialogProps {
  /** Si el diálogo está abierto */
  isOpen: boolean;
  /** Callback al cerrar sin confirmar */
  onClose: () => void;
  /** Callback al confirmar con el valor ingresado */
  onConfirm: (value: string) => void;
  /** Título del diálogo */
  title: string;
  /** Mensaje o descripción */
  message?: string;
  /** Valor inicial del input */
  defaultValue?: string;
  /** Placeholder del input */
  placeholder?: string;
  /** Texto del botón de confirmar */
  confirmText?: string;
  /** Texto del botón de cancelar */
  cancelText?: string;
  /** Función de validación personalizada */
  validate?: (value: string) => string | null;
}

/**
 * Componente PromptDialog - Diálogo con input de texto.
 * 
 * @component
 * @description
 * Reemplaza el prompt() nativo del navegador con un diálogo personalizado
 * que incluye validación, animaciones y accesibilidad.
 * 
 * @example
 * ```tsx
 * <PromptDialog
 *   isOpen={true}
 *   onClose={handleCancel}
 *   onConfirm={handleSubmit}
 *   title="Renombrar elemento"
 *   message="Ingresa el nuevo nombre"
 *   defaultValue="Nombre actual"
 *   validate={(value) => value.trim() ? null : "El nombre no puede estar vacío"}
 * />
 * ```
 */
const PromptDialog: FC<PromptDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  defaultValue = "",
  placeholder = "",
  confirmText = "Aceptar",
  cancelText = "Cancelar",
  validate,
}) => {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);

  // Resetear valor cuando se abre el diálogo
  useEffect(() => {
    if (isOpen) {
      setValue(defaultValue);
      setError(null);
    }
  }, [isOpen, defaultValue]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    // Validar
    if (validate) {
      const validationError = validate(value);
      if (validationError) {
        setError(validationError);
        return;
      }
    }

    onConfirm(value);
    onClose();
  };

  const handleChange = (newValue: string) => {
    setValue(newValue);
    // Limpiar error al escribir
    if (error) setError(null);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <form onSubmit={handleSubmit} className="p-6">
        {/* Título y Mensaje */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          {message && (
            <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
          )}
        </div>

        {/* Input */}
        <div className="mb-6">
          <input
            type="text"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full px-4 py-2.5 bg-gray-700 border ${
              error ? "border-red-500" : "border-gray-600"
            } rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
              error ? "focus:ring-red-500" : "focus:ring-blue-500"
            } transition-colors`}
            autoFocus
            aria-invalid={!!error}
            aria-describedby={error ? "input-error" : undefined}
          />
          {error && (
            <p
              id="input-error"
              className="mt-2 text-sm text-red-400"
              role="alert"
            >
              {error}
            </p>
          )}
        </div>

        {/* Botones */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {cancelText}
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          >
            {confirmText}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PromptDialog;
