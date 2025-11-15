// components/Modal.tsx
"use client";

import { type FC, type ReactNode, useEffect } from "react";
import { motion } from "framer-motion";
import FocusTrap from "focus-trap-react";

/**
 * Props para el componente Modal base.
 */
export interface ModalProps {
  /** Si el modal está abierto */
  isOpen: boolean;
  /** Callback al cerrar el modal */
  onClose: () => void;
  /** Contenido del modal */
  children: ReactNode;
  /** Título del modal (para accesibilidad) */
  title: string;
  /** Tamaño del modal */
  size?: "sm" | "md" | "lg";
  /** Si se puede cerrar haciendo click fuera o presionando ESC */
  closeable?: boolean;
  /** Clase CSS adicional para el contenedor */
  className?: string;
}

/**
 * Componente Modal base - Componente reutilizable para diálogos modales.
 * 
 * @component
 * @description
 * Modal accesible con:
 * - Focus trap (el foco queda atrapado dentro del modal)
 * - Cierre con tecla ESC
 * - Overlay con click para cerrar
 * - Animaciones suaves con framer-motion
 * - Accesibilidad completa (ARIA)
 * 
 * @example
 * ```tsx
 * <Modal isOpen={true} onClose={handleClose} title="Mi Modal">
 *   <p>Contenido del modal</p>
 * </Modal>
 * ```
 */
const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  closeable = true,
  className = "",
}) => {
  // Manejar tecla ESC
  useEffect(() => {
    if (!isOpen || !closeable) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose, closeable]);

  // Prevenir scroll del body cuando el modal está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };

  return (
    <div
      className="fixed inset-0 z-[9998] flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Overlay */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={closeable ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <FocusTrap
        focusTrapOptions={{
          allowOutsideClick: true,
          escapeDeactivates: closeable,
        }}
      >
        <motion.div
          className={`relative bg-gray-800 rounded-lg shadow-2xl w-full ${sizeClasses[size]} ${className}`}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* Título oculto para accesibilidad */}
          <h2 id="modal-title" className="sr-only">
            {title}
          </h2>
          {children}
        </motion.div>
      </FocusTrap>
    </div>
  );
};

export default Modal;
