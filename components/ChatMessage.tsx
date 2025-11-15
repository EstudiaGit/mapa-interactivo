// components/ChatMessage.tsx
"use client";

import { motion } from "framer-motion";
import { type FC } from "react";
import ReactMarkdown from "react-markdown";

type ChatMessageProps = {
  message: string;
  sender: "user" | "assistant";
  timestamp?: number;
};

/**
 * Componente ChatMessage - Renderiza un mensaje individual del chat.
 * 
 * @component
 * @description
 * Muestra mensajes del usuario o del asistente con estilos diferentes.
 * Los mensajes del asistente soportan formato Markdown.
 */
const ChatMessage: FC<ChatMessageProps> = ({ message, sender, timestamp }) => {
  const isAssistant = sender === "assistant";

  return (
    <motion.div
      className={`flex ${isAssistant ? "justify-start" : "justify-end"} mb-4`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        className={`
          max-w-[80%] px-4 py-3 rounded-lg shadow-md
          ${
            isAssistant
              ? "bg-gray-700 text-gray-100"
              : "bg-blue-600 text-white"
          }
        `}
      >
        {isAssistant ? (
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                ul: ({ children }) => <ul className="list-disc ml-4 mb-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal ml-4 mb-2">{children}</ol>,
                li: ({ children }) => <li className="mb-1">{children}</li>,
                strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                code: ({ children }) => (
                  <code className="bg-gray-800 px-1.5 py-0.5 rounded text-sm">{children}</code>
                ),
              }}
            >
              {message}
            </ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        )}
        {timestamp && (
          <p className="text-xs opacity-60 mt-1">
            {new Date(timestamp).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ChatMessage;
