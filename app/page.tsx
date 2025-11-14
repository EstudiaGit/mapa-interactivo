// app/page.tsx
"use client";

import { type FC, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";

import Sidebar from "@/components/Sidebar";
import Map from "@/components/Map";
import ChatWindow from "@/components/ChatWindow";
import MenuButton from "@/components/MenuButton";
import ChatBubble from "@/components/ChatBubble"; // 1. Importar ChatBubble
import ChatDock from "@/components/ChatDock";

const HomePage: FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  // 2. Añadir estado para el chat
  const [isChatOpen, setChatOpen] = useState(false);
  const chatDockRef = useRef<HTMLButtonElement | null>(null);

  return (
    <>
      {!isSidebarOpen && <MenuButton onClick={() => setSidebarOpen(true)} />}
      {/* 3. Mostrar el ChatBubble en móvil cuando el chat está cerrado */}
      {!isChatOpen && <ChatBubble onClick={() => setChatOpen(true)} />}
      {!isChatOpen && (
        <ChatDock
          onClick={() => {
            setChatOpen(true);
            // mover el foco al input del chat tras abrir
            setTimeout(() => {
              document.getElementById("chat-input")?.focus();
            }, 0);
          }}
          ref={chatDockRef as any}
        />
      )}

      <div
        className="flex h-screen bg-gray-900 overflow-hidden"
        role="application"
      >
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Map sidebarOpen={isSidebarOpen} />
      </div>

      {/* 4. Pasar el estado y el controlador de cierre al ChatWindow */}
      <AnimatePresence initial={false} mode="wait">
        {isChatOpen && (
          <ChatWindow
            isOpen={true}
            onClose={() => {
              setChatOpen(false);
              setTimeout(() => {
                chatDockRef.current?.focus?.();
              }, 200);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default HomePage;
