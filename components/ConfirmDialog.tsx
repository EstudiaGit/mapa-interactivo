// components/ConfirmDialog.tsx
"use client";

import { type FC } from "react";
import Modal from "./Modal";

/**
 * Variantes del diálogo de confirmación
 */
export type ConfirmVariant = "danger" | "warning" | "info";

/**
 * Props para el componente ConfirmDialog
 */
export interface ConfirmDialogProps {
  /** Si el diálogo está abierto */
  isOpen: boolean;
  /** Callback al cerrar sin confirmar */
  onClose: () => void;
  /** Callback al confirmar */
  onConfirm: () => void;
  /** Título del diálogo */
  title: string;
  /** Mensaje del diálogo */
  message: string;
  /** Texto del botón de confirmar */
  confirmText?: string;
  /** Texto del botón de cancelar */
  cancelText?: string;
  /** Variante visual del diálogo */
  variant?: ConfirmVariant;
}

/**
 * Componente ConfirmDialog - Diálogo de confirmación personalizado.
 * 
 * @component
 * @description
 * Reemplaza el confirm() nativo del navegador con un diálogo personalizado
 * que incluye animaciones, accesibilidad y variantes visuales.
 * 
 * @example
 * ```tsx
 * <ConfirmDialog
 *   isOpen={true}
 *   onClose={handleCancel}
 *   onConfirm={handleConfirm}
 *   title="Confirmar eliminación"
 *   message="¿Estás seguro de que deseas eliminar este elemento?"
 *   variant="danger"
 * />
 * ```
 */
const ConfirmDialog: FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  variant = "info",
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  // Estilos según variante
  const variantStyles = {
    danger: {
      icon: "⚠️",
      confirmButton: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      iconBg: "bg-red-600/20",
    },
    warning: {
      icon: "⚡",
      confirmButton: "bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500",
      iconBg: "bg-yellow-600/20",
    },
    info: {
      icon: "ℹ️",
      confirmButton: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      iconBg: "bg-blue-600/20",
    },
  };

  const styles = variantStyles[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="p-6">
        {/* Icono y Título */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`flex-shrink-0 w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center text-2xl`}
            aria-hidden="true"
          >
            {styles.icon}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            <p className="text-gray-300 text-sm leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Botones */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            type="button"
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className={`flex-1 px-4 py-2.5 text-white rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 ${styles.confirmButton}`}
            type="button"
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
