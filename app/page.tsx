// app/page.tsx
"use client";

import { type FC, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Map from "@/components/Map";
import ChatWindow from "@/components/ChatWindow";
import MenuButton from "@/components/MenuButton";
import ChatBubble from "@/components/ChatBubble"; // 1. Importar ChatBubble

const HomePage: FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  // 2. Añadir estado para el chat
  const [isChatOpen, setChatOpen] = useState(false);

  return (
    <>
      {!isSidebarOpen && <MenuButton onClick={() => setSidebarOpen(true)} />}
      {/* 3. Mostrar el ChatBubble en móvil cuando el chat está cerrado */}
      {!isChatOpen && <ChatBubble onClick={() => setChatOpen(true)} />}

      <div
        className="flex h-screen bg-gray-900 overflow-hidden"
        role="application"
      >
        <Sidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
        <Map />
      </div>

      {/* 4. Pasar el estado y el controlador de cierre al ChatWindow */}
      <ChatWindow isOpen={isChatOpen} onClose={() => setChatOpen(false)} />
    </>
  );
};

export default HomePage;
