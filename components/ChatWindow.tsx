// components/ChatWindow.tsx

"use client";

import { type FC, type FormEvent } from "react";

/**
 * Clases de estilo reutilizables para el componente ChatWindow.
 */
const STYLES = {
  container:
    "fixed bottom-5 right-5 w-96 bg-gray-800 text-white rounded-lg shadow-xl flex flex-col h-[500px] z-10",
  header:
    "bg-gray-700 p-3 rounded-t-lg cursor-pointer hover:bg-gray-650 transition-colors",
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
 * Componente ChatWindow - Ventana flotante de chat con el asistente de IA.
 *
 * @component
 * @description
 * Interfaz de chat flotante que permite al usuario interactuar con el asistente de IA
 * para realizar búsquedas y gestionar ubicaciones en el mapa.
 *
 * Características:
 * - Posicionamiento fixed en la esquina inferior derecha
 * - Área de mensajes scrolleable
 * - Input con validación visual
 * - Icono SVG optimizado para el botón de envío
 *
 * @example
 * ```tsx
 * <ChatWindow />
 * ```
 *
 * @remarks
 * - Fase actual: UI estática (Hito 1)
 * - Próxima fase: Integración con API de OpenAI y gestión de estado (Hito 3)
 *
 * @todo Hito 3:
 * - Implementar useState para mensajes
 * - Conectar con API de OpenAI
 * - Añadir indicador de "escribiendo..."
 * - Implementar scroll automático al último mensaje
 * - Añadir funcionalidad de minimizar/maximizar
 */
const ChatWindow: FC = () => {
  /**
   * Maneja el envío del formulario de chat.
   * @param e - Evento del formulario
   * @todo Implementar lógica de envío de mensajes en Hito 3
   */
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Preparado para: sendMessage(inputValue)
  };

  return (
    <aside
      className={STYLES.container}
      role="complementary"
      aria-label="Ventana de chat con asistente"
    >
      {/* Cabecera del Chat */}
      <header className={STYLES.header} role="banner">
        <h2 className={STYLES.headerTitle} id="chat-title">
          Chat con el Mapa
        </h2>
      </header>

      {/* Área de Mensajes */}
      <div
        className={STYLES.messagesArea}
        role="log"
        aria-live="polite"
        aria-label="Historial de mensajes"
      >
        <div className={STYLES.placeholder}>
          <p>Pregúntale al mapa...</p>
          <p className={STYLES.exampleText}>
            Ejemplo: "Busca cafeterías cerca de la playa de Las Canteras"
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
    </aside>
  );
};

export default ChatWindow;
