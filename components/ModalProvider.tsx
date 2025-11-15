// components/ModalProvider.tsx
"use client";

import { type FC } from "react";
import { AnimatePresence } from "framer-motion";
import { useModalStore } from "@/hooks/useModalStore";
import ConfirmDialog from "./ConfirmDialog";
import PromptDialog from "./PromptDialog";

/**
 * Componente ModalProvider - Renderiza los modales activos.
 * 
 * @component
 * @description
 * Lee el store de modales y renderiza los modales activos con AnimatePresence.
 * Debe incluirse una sola vez en el layout principal de la aplicación.
 * 
 * @example
 * ```tsx
 * // En app/layout.tsx
 * <body>
 *   {children}
 *   <ModalProvider />
 * </body>
 * ```
 */
const ModalProvider: FC = () => {
  const modals = useModalStore((s) => s.modals);
  const removeModal = useModalStore((s) => s.removeModal);

  return (
    <AnimatePresence mode="wait">
      {modals.map((modal) => {
        const handleClose = () => {
          if (modal.type === "confirm" && modal.onCancel) {
            modal.onCancel();
          } else if (modal.type === "prompt" && modal.onCancel) {
            modal.onCancel();
          }
          removeModal(modal.id);
        };

        // Renderizar ConfirmDialog
        if (modal.type === "confirm") {
          return (
            <ConfirmDialog
              key={modal.id}
              isOpen={true}
              onClose={handleClose}
              onConfirm={() => {
                modal.onConfirm();
                removeModal(modal.id);
              }}
              title={modal.title}
              message={modal.message}
              confirmText={modal.confirmText}
              cancelText={modal.cancelText}
              variant={modal.variant}
            />
          );
        }

        // Renderizar PromptDialog
        if (modal.type === "prompt") {
          return (
            <PromptDialog
              key={modal.id}
              isOpen={true}
              onClose={handleClose}
              onConfirm={(value) => {
                modal.onConfirm(value);
                removeModal(modal.id);
              }}
              title={modal.title}
              message={modal.message}
              defaultValue={modal.defaultValue}
              placeholder={modal.placeholder}
              confirmText={modal.confirmText}
              cancelText={modal.cancelText}
              validate={modal.validate}
            />
          );
        }

        return null;
      })}
    </AnimatePresence>
  );
};

export default ModalProvider;
