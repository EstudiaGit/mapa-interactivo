"use client";

import { type FC, type FormEvent } from "react";
import { motion } from "framer-motion";


/**
 * Clases de estilo reutilizables para el componente ChatWindow.
 */
const STYLES = {
  header:
    "bg-gray-700 p-3 rounded-t-lg cursor-pointer hover:bg-gray-600 transition-colors",
  headerTitle: "font-bold text-lg",
  messagesArea: "flex-grow p-4 overflow-y-auto",
  placeholder: "text-center text-gray-400 text-sm",
  exampleText: "text-xs mt-2 italic",
  form: "p-3 border-t border-gray-700 flex items-center bg-gray-800 rounded-b-lg",
  input:
    "flex-grow p-2 rounded-l-md bg-gray-600 border border-gray-500 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all",
  submitButton:
    "bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors",
  icon: "w-6 h-6",
} as const;

/**
 * Props para el componente ChatWindow, necesarias para el control responsive.
 */
interface ChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Componente ChatWindow - Ventana de chat adaptable para móvil y escritorio.
 * En móvil se comporta como un modal de pantalla completa, en escritorio como una ventana flotante.
 */
const ChatWindow: FC<ChatWindowProps> = ({ onClose }) => {
  /**
   * Maneja el envío del formulario de chat.
   * @param e - Evento del formulario
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // La lógica de envío de mensajes se implementará en el Hito 3
  };

  return (
    <motion.aside
      className={`
        fixed
        bg-gray-800 text-white shadow-xl flex flex-col
        rounded-t-2xl md:rounded-lg
        border-t border-gray-700
        z-50
        bottom-0 left-0 right-0
        h-[60vh]
        md:inset-auto md:bottom-5 md:right-5 md:w-96 md:h-[500px]
      `}
      role="dialog"
      aria-modal={true}
      aria-labelledby="chat-title"
      initial={{ opacity: 0, y: 40, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 40, scale: 0.98 }}
      transition={{ type: "spring", stiffness: 220, damping: 22, mass: 0.9 }}
    >
      {/* Cabecera del Chat con botón de cierre para móvil y minimizar en desktop */}
      <header className={`${STYLES.header} flex justify-between items-center`}>
        <h2 className={STYLES.headerTitle} id="chat-title">
          Chat con el Mapa
        </h2>
        <div className="flex items-center gap-2">
          {/* Minimizar (desktop) */}
          <button
            onClick={onClose}
            className="hidden md:inline-flex text-gray-300 hover:text-white text-sm px-2 py-1 rounded border border-gray-600 hover:border-gray-500"
            aria-label="Minimizar chat"
            title="Minimizar"
          >
            Minimizar
          </button>
          {/* Cerrar (móvil) */}
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white text-2xl leading-none"
            aria-label="Cerrar chat"
            title="Cerrar"
          >
            &times;
          </button>
        </div>
      </header>

      {/* Área de Mensajes */}
      <div className={STYLES.messagesArea} role="log">
        <div className={STYLES.placeholder}>
          <p>Pregúntale al mapa...</p>
          <p className={STYLES.exampleText}>
            Ejemplo: &quot;Busca cafeterías cerca de la playa de Las Canteras&quot;
          </p>
        </div>
      </div>

      {/* Formulario de Entrada */}
      <form
        className={STYLES.form}
        onSubmit={handleSubmit}
        aria-labelledby="chat-title"
      >
        <label htmlFor="chat-input" className="sr-only">
          Escribe tu mensaje
        </label>
        <input
          id="chat-input"
          type="text"
          placeholder="Escribe tu mensaje..."
          className={STYLES.input}
          autoComplete="off"
          aria-required="true"
        />
        <button
          type="submit"
          className={STYLES.submitButton}
          aria-label="Enviar mensaje"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className={STYLES.icon}
            aria-hidden="true"
          >
            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
          </svg>
        </button>
      </form>
    </motion.aside>
  );
};

export default ChatWindow;
