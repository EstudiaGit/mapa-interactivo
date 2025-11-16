CONTEXTO: Despues de cambiar 'NEXT_PUBLIC_GOOGLE_AI_API_KEY' por 'GOOGLE_API_KEY' en las variables de entorno, la API de Google Maps funciona correctamente. Todo dentro de 'ai-service.ts'.

Y me dan esta solucion:
¡Excelente pregunta! Es una duda muy común y fundamental cuando se trabaja con Next.js y claves de API.

**Sí, es muy probable que el cambio de `NEXT_PUBLIC_GOOGLE_AI_API_KEY` a `GOOGLE_AI_API_KEY` sea la razón por la que ha dejado de funcionar, pero hiciste lo correcto en cuanto a seguridad.**

Aquí te explico el porqué y cómo solucionarlo correctamente.

### La Diferencia Crucial: Cliente vs. Servidor

En Next.js, las variables de entorno se manejan de dos maneras distintas para proteger tus secretos:

1.  **`NEXT_PUBLIC_...` (Variables Públicas):**
    *   **Accesibles en el Cliente y en el Servidor.**
    *   Next.js las "incrusta" en el código JavaScript que se envía al navegador del usuario.
    *   **Cualquier persona puede verlas** si inspecciona el código fuente de tu página.
    *   **NUNCA debes usar este prefijo para claves secretas** como `GOOGLE_AI_API_KEY`, ya que estarías exponiendo tu clave a todo el mundo, lo que podría generar costes inesperados en tu cuenta de Google.

2.  **`GOOGLE_AI_API_KEY` (Variables Privadas / Solo Servidor):**
    *   **Accesibles ÚNICAMENTE en el Servidor.**
    *   No se envían al navegador. Permanecen seguras en el entorno donde se ejecuta tu aplicación Next.js (tu servidor o Vercel).
    *   Son perfectas para guardar secretos: claves de API, credenciales de bases de datos, etc.

### ¿Cuál es tu Problema Actual?

Tu código en `lib/ai-service.ts`, específicamente la función `getGoogleAI`, intenta leer `process.env.GOOGLE_AI_API_KEY`.

```typescript
// lib/ai-service.ts

function getGoogleAI() {
  // Esta línea lee la variable de entorno
  const apiKey = process.env.GOOGLE_AI_API_KEY;

  if (!apiKey) {
    // Si estás llamando a esta función desde el cliente,
    // apiKey será 'undefined' y este error se disparará.
    throw new Error(
      "API Key de Google AI no configurada...",
    );
  }
  // ...
}
```

Lo más seguro es que estés llamando a tu función `sendMessage` directamente desde un **componente de React que se ejecuta en el cliente** (por ejemplo, un componente de chat dentro de `app/page.tsx` que no tiene la directiva `"use server"`).

Cuando el código se ejecuta en el navegador del usuario, **no tiene acceso a las variables de entorno del servidor**, por lo que `process.env.GOOGLE_AI_API_KEY` es `undefined`. Como resultado, tu propio código lanza el error que programaste: `"API Key de Google AI no configurada..."`.

### La Solución Correcta: Crear una Ruta de API

El patrón correcto para manejar esto es mantener la lógica que usa la clave secreta en el servidor y exponerla a tu cliente a través de una API interna.

Hiciste bien en quitar el prefijo `NEXT_PUBLIC_`. Ahora solo necesitas reestructurar cómo llamas a tu función.

**Paso 1: Mantén tu variable como `GOOGLE_AI_API_KEY` en tu archivo `.env.local`.**

Esto es seguro y correcto.

**Paso 2: Crea una Ruta de API (API Route) en Next.js.**

Esta ruta se ejecutará en el servidor y será la única que llame a tu función `sendMessage`.

Crea un archivo, por ejemplo, en `app/api/chat/route.ts`:

```typescript
// app/api/chat/route.ts

import { NextResponse } from "next/server";
import { sendMessage } from "@/lib/ai-service"; // Asegúrate de que la ruta sea correcta
import type { AddressEntry } from "@/hooks/useMapStore"; // Importa los tipos necesarios

// El contexto de acciones (actionsContext) necesitarás pasarlo de alguna manera
// o instanciarlo aquí si es posible. Para este ejemplo, lo omitiremos,
// pero en tu app real deberás manejarlo.

export async function POST(request: Request) {
  try {
    // 1. Recibe los datos del cliente
    const body = await request.json();
    const {
      userMessage,
      markers,
      center,
      conversationHistory,
    }: {
      userMessage: string;
      markers: AddressEntry[];
      center?: { lat: number; lng: number } | null;
      conversationHistory?: Array<{ role: string; parts: string }>;
    } = body;

    if (!userMessage) {
      return NextResponse.json(
        { error: "El mensaje del usuario es requerido" },
        { status: 400 },
      );
    }

    // 2. Llama a tu servicio de IA (esto se ejecuta en el servidor)
    //    Aquí SÍ tienes acceso a process.env.GOOGLE_AI_API_KEY
    //    NOTA: Debes decidir cómo manejar 'actionsContext' aquí.
    const result = await sendMessage(
      userMessage,
      markers,
      center,
      conversationHistory,
      // actionsContext, // <-- Necesitarás instanciar o pasar esto
    );

    // 3. Devuelve la respuesta al cliente
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error en la ruta API /api/chat:", error);
    return NextResponse.json(
      { error: "Hubo un error al procesar tu solicitud." },
      { status: 500 },
    );
  }
}
```

**Paso 3: Llama a esta nueva Ruta de API desde tu componente de cliente.**

Ahora, tu componente de React (el chat) ya no importará ni llamará a `sendMessage` directamente. En su lugar, hará una petición `fetch` a `/api/chat`.

```tsx
// En tu componente de Chat (Ej: components/Chat.tsx)

import { useState } from "react";
// ... tus otros imports

function ChatComponent() {
  // ... tus estados para markers, center, history, etc.
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userMessage: message,
          markers: markers, // Pasa el estado actual de los marcadores
          center: center,   // Pasa el centro del mapa
          conversationHistory: history, // Pasa el historial
        }),
      });

      if (!response.ok) {
        throw new Error("La respuesta de la API no fue exitosa");
      }

      const result = await response.json();

      // Ahora actualiza tu estado con la respuesta de la IA
      // y con la información de 'toolsUsed' si existe
      console.log("Respuesta de la IA:", result.text);
      if (result.toolsUsed) {
        console.log("Herramientas usadas:", result.toolsUsed);
        // Aquí puedes actualizar el estado de tu mapa basándote
        // en las herramientas que la IA ejecutó.
      }
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    } finally {
      setLoading(false);
    }
  };

  // ... el resto de tu JSX
}
```

### En Resumen

| Acción | ¿Por qué no funciona? | ¿Cómo solucionarlo? |
| :--- | :--- | :--- |
| Cambiar `NEXT_PUBLIC_` a `GOOGLE_AI_...` | Porque `GOOGLE_AI_API_KEY` no es accesible en el cliente, y estabas llamando a la función que la usa desde un componente de cliente. | **Mantén el cambio (es más seguro)** y mueve la llamada a tu función `sendMessage` a una **Ruta de API de Next.js** que se ejecute en el servidor. Luego, llama a esa ruta API desde tu cliente con `fetch`. |

Tu cambio fue un paso en la dirección correcta hacia una aplicación más segura. Solo te faltaba este ajuste en la arquitectura para completar el flujo correctamente.
