// components/Sidebar.tsx

"use client";

import { type FC, useEffect, useMemo, useState } from "react";
import { useMapStore } from "@/hooks/useMapStore";
import { useToastStore } from "@/hooks/useToastStore";

// Nuevas props para controlar la visibilidad en dispositivos móviles
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, onClose }) => {
  // Evitar acceso a window en SSR: detectar móvil en cliente
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Estado local para búsqueda en lista
  const [query, setQuery] = useState("");

  // Store global (Zustand)
  const markers = useMapStore((s) => s.markers);
  const selectedId = useMapStore((s) => s.selectedId);
  const selectMarker = useMapStore((s) => s.selectMarker);
  const removeMarker = useMapStore((s) => s.removeMarker);
  const renameMarker = useMapStore((s) => s.renameMarker);
  const updateMarker = useMapStore((s) => s.updateMarker);

  // Filtrado por título o coordenadas
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return markers;
    return markers.filter((m) => {
      const name = (m.name ?? "").toLowerCase();
      const desc = (m.description ?? "").toLowerCase();
      const addr = (m.address ?? "").toLowerCase();
      const cp = (m.CP ?? "").toLowerCase();
      const coords = `${m.coordinates.lat.toFixed(5)},${m.coordinates.lng.toFixed(5)}`;
      return name.includes(q) || desc.includes(q) || addr.includes(q) || cp.includes(q) || coords.includes(q);
    });
  }, [markers, query]);

  const toast = useToastStore((s) => s.enqueue);

  const onAddClick = () => {
    toast({ type: "info", message: "Para añadir una nueva dirección, haz click en el mapa." });
  };
  // Importar/Exportar JSON con el esquema AddressEntry
  const onImportClick = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json";
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!Array.isArray(data)) throw new Error("JSON no es un array");
        // Validación y normalización mínima
        const entries = data
          .map((d) => {
            if (!d) return null;
            const id = typeof d.id === "string" && d.id ? d.id : undefined;
            const name = typeof d.name === "string" ? d.name : "(Sin título)";
            const description = typeof d.description === "string" ? d.description : "";
            const address = typeof d.address === "string" ? d.address : "";
            const CP = typeof d.CP === "string" ? d.CP : "";
            const lat = d.coordinates?.lat;
            const lng = d.coordinates?.lng;
            if (typeof lat !== "number" || typeof lng !== "number") return null;
            return { id, name, description, address, CP, coordinates: { lat, lng } };
          })
          .filter(Boolean);
        if (entries.length === 0) throw new Error("No hay entradas válidas");
        // Añadir a la store
        entries.forEach((e) => useMapStore.getState().addMarker(e as any));
        alert(`Importadas ${entries.length} direcciones correctamente.`);
      } catch (err: any) {
        alert(`Error al importar: ${err?.message ?? String(err)}`);
      }
    };
    input.click();
  };
  const onExportClick = () => {
    const data = markers.map((m) => ({
      id: m.id,
      name: m.name,
      description: m.description,
      address: m.address,
      CP: m.CP,
      coordinates: { lat: m.coordinates.lat, lng: m.coordinates.lng },
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "direcciones.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({ type: "success", message: "Exportación completada (direcciones.json)" });
  };

  const onDeleteClick = (id: string, name?: string) => {
    const ok = confirm(`¿Eliminar "${name ?? "Marcador"}"?`);
    if (ok) {
      removeMarker(id);
      toast({ type: "success", message: `Eliminada: ${name ?? "Marcador"}` });
    }
  };

  const onRenameClick = (id: string, current?: string) => {
    const next = prompt("Nuevo nombre para la dirección:", current ?? "");
    if (next != null) renameMarker(id, next.trim());
  };

  // Edición inline por campo
  type InlineField = "name" | "description" | "address" | "CP";
  const [inlineEdit, setInlineEdit] = useState<{ id: string | null; field: InlineField | null; value: string }>(
    { id: null, field: null, value: "" }
  );

  const startInline = (m: (typeof markers)[number], field: InlineField) => {
    // Si hay otra edición inline abierta, la cerramos sin guardar
    setInlineEdit({ id: m.id, field, value: String(m[field] ?? "") });
  };

  const cancelInline = () => setInlineEdit({ id: null, field: null, value: "" });

  const commitInline = () => {
    const { id, field, value } = inlineEdit;
    if (!id || !field) return;
    // Validaciones mínimas: name obligatorio, CP patrón opcional
    if (field === "name" && value.trim().length === 0) {
      toast({ type: "error", message: "El nombre no puede estar vacío" });
      return;
    }
    if (field === "CP" && value.trim().length > 0) {
      const cpPattern = /^\d{5}(?:[\s-].+)?$/;
      if (!cpPattern.test(value.trim())) {
        toast({ type: "error", message: "El CP debe comenzar con 5 dígitos" });
        return;
      }
    }
    updateMarker(id, { [field]: value } as any);
    toast({ type: "success", message: "Cambios guardados" });
    cancelInline();
  };

  const onInlineKey = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      commitInline();
    } else if (e.key === "Escape") {
      e.preventDefault();
      cancelInline();
    }
  };

  // Modal de edición completa con validaciones y accesibilidad
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", description: "", address: "", CP: "" });
  const [originalForm, setOriginalForm] = useState({ name: "", description: "", address: "", CP: "" });
  const [errors, setErrors] = useState<{ name?: string; CP?: string }>({});
  const [announce, setAnnounce] = useState(""); // aria-live
  const nameInputRef = useState<HTMLInputElement | null>(null)[0];

  const computeErrors = (data = form) => {
    const errs: { name?: string; CP?: string } = {};
    if (!data.name || data.name.trim().length === 0) {
      errs.name = "El nombre es obligatorio";
    }
    if (data.CP && data.CP.trim().length > 0) {
      // Acepta "35005" o "35005 Las Palmas ..."
      const cpPattern = /^\d{5}(?:[\s-].+)?$/;
      if (!cpPattern.test(data.CP.trim())) {
        errs.CP = "El CP debe comenzar con 5 dígitos (p.ej. 35005 o 35005 Ciudad)";
      }
    }
    return errs;
  };

  // Mantener errores y anuncio sincronizados en vivo
  useEffect(() => {
    if (!editingId) return;
    const errs = computeErrors(form);
    setErrors(errs);
    setAnnounce(Object.keys(errs).length ? "Hay errores en el formulario" : "");
  }, [form, editingId]);

  const isDirty = () =>
    form.name !== originalForm.name ||
    form.description !== originalForm.description ||
    form.address !== originalForm.address ||
    form.CP !== originalForm.CP;

  const openEdit = (m: (typeof markers)[number]) => {
    const init = { name: m.name || "", description: m.description || "", address: m.address || "", CP: m.CP || "" };
    setEditingId(m.id);
    setForm(init);
    setOriginalForm(init);
    setErrors({});
    setAnnounce("");
    // focus se gestionará en el render con autoFocus
  };

  const requestClose = () => {
    if (isDirty()) {
      const ok = confirm("Tienes cambios sin guardar. ¿Cerrar sin guardar?");
      if (!ok) return;
    }
    setEditingId(null);
  };

  const saveEdit = () => {
    if (!editingId) return;
    const errs = computeErrors();
    if (Object.keys(errs).length > 0) {
      // Enfocar primer error
      setTimeout(() => {
        const firstError = document.querySelector("[data-error='true']") as HTMLElement | null;
        firstError?.focus?.();
      }, 0);
      return;
    }
    updateMarker(editingId, { ...form });
    setEditingId(null);
    toast({ type: "success", message: "Dirección actualizada" });
  };

  return (
    <aside
      className={`
        absolute top-0 left-0 h-full bg-gray-800 text-white
        ${isOpen ? "p-4 z-40 pointer-events-auto" : "p-0 z-0 pointer-events-none"}
        flex flex-col flex-shrink-0
        transform transition-transform duration-300 ease-in-out
        // Mobile width
        w-80 ${isOpen ? "translate-x-0" : "-translate-x-full"}
        // Desktop behavior: occupy layout only when open
        ${isOpen ? "md:relative md:w-96 md:translate-x-0" : "md:absolute md:w-0 md:-translate-x-full md:p-0"}
      `}
      aria-hidden={!isOpen}
    >
      {/* Encabezado con título y botón de cierre para móvil */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Mis Direcciones</h2>
        <div className="flex items-center gap-2">
          {/* Botón de ocultar para escritorio */}
          <button
            onClick={onClose}
            className="hidden md:inline-flex text-gray-300 hover:text-white text-sm px-2 py-1 rounded border border-gray-600 hover:border-gray-500"
            aria-label="Ocultar barra lateral"
            title="Ocultar"
          >
            Ocultar
          </button>
          {/* Botón de cierre para móvil */}
          <button
            onClick={onClose}
            className="md:hidden text-gray-400 hover:text-white text-2xl"
            aria-label="Cerrar menú"
          >
            &times;
          </button>
        </div>
      </div>

      {/* Campo de Búsqueda */}
      <input
        type="text"
        placeholder="Buscar por nombre o coordenadas (lat,lng)..."
        className="w-full p-2 rounded bg-gray-700 border border-gray-600 placeholder-gray-400"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {/* Lista de Ubicaciones */}
      <div className="mt-4 flex-grow overflow-y-auto pr-2">
        <ul className="space-y-3">
          {filtered.map((m) => (
            <li
              key={m.id}
              className={`bg-gray-700 p-3 rounded-lg flex justify-between items-start border ${
                selectedId === m.id ? "border-blue-500" : "border-transparent"
              }`}
            >
              <button
                className="text-left"
                onClick={() => selectMarker(m.id)}
                title="Seleccionar en el mapa"
              >
                {/* Name inline */}
                {inlineEdit.id === m.id && inlineEdit.field === "name" ? (
                  <input
                    className="font-semibold w-full bg-gray-700 border border-blue-500 rounded px-2 py-1"
                    value={inlineEdit.value}
                    onChange={(e) => setInlineEdit((s) => ({ ...s, value: e.target.value }))}
                    onBlur={commitInline}
                    onKeyDown={onInlineKey}
                    autoFocus
                  />
                ) : (
                  <h3
                    className="font-semibold hover:underline cursor-text"
                    title="Editar nombre"
                    onClick={() => startInline(m, "name")}
                  >
                    {m.name || "(Sin título)"}
                  </h3>
                )}

                {/* Description inline */}
                {inlineEdit.id === m.id && inlineEdit.field === "description" ? (
                  <textarea
                    className="mt-1 w-full bg-gray-700 border border-blue-500 rounded px-2 py-1 text-sm text-gray-200"
                    value={inlineEdit.value}
                    onChange={(e) => setInlineEdit((s) => ({ ...s, value: e.target.value }))}
                    onBlur={commitInline}
                    onKeyDown={onInlineKey}
                    rows={2}
                    autoFocus
                  />
                ) : (
                  <p
                    className="text-sm text-gray-400 hover:underline cursor-text"
                    title="Editar descripción"
                    onClick={() => startInline(m, "description")}
                  >
                    {m.description || <span className="italic text-gray-500">Añade una descripción</span>}
                  </p>
                )}

                {/* Address inline */}
                {inlineEdit.id === m.id && inlineEdit.field === "address" ? (
                  <input
                    className="mt-1 w-full bg-gray-700 border border-blue-500 rounded px-2 py-1 text-xs text-gray-200"
                    value={inlineEdit.value}
                    onChange={(e) => setInlineEdit((s) => ({ ...s, value: e.target.value }))}
                    onBlur={commitInline}
                    onKeyDown={onInlineKey}
                    autoFocus
                  />
                ) : (
                  <p
                    className="text-xs text-gray-500 hover:underline cursor-text"
                    title="Editar dirección"
                    onClick={() => startInline(m, "address")}
                  >
                    {m.address || <span className="italic text-gray-600">Añade una dirección</span>}
                  </p>
                )}

                {/* CP inline */}
                {inlineEdit.id === m.id && inlineEdit.field === "CP" ? (
                  <input
                    className="mt-1 w-full bg-gray-700 border border-blue-500 rounded px-2 py-1 text-xs text-gray-200"
                    value={inlineEdit.value}
                    onChange={(e) => setInlineEdit((s) => ({ ...s, value: e.target.value }))}
                    onBlur={commitInline}
                    onKeyDown={onInlineKey}
                    autoFocus
                  />
                ) : (
                  <p
                    className="text-xs text-gray-500 hover:underline cursor-text"
                    title="Editar CP"
                    onClick={() => startInline(m, "CP")}
                  >
                    {m.CP || <span className="italic text-gray-600">Añade CP</span>}
                  </p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  {m.coordinates.lat.toFixed(5)}, {m.coordinates.lng.toFixed(5)}
                </p>
              </button>
              <div className="flex gap-2 items-center">
                <button
                  className="text-gray-300 hover:text-white text-sm px-2 py-1 rounded border border-gray-600 hover:border-gray-500"
                  onClick={() => openEdit(m)}
                  title="Editar"
                >
                  Editar
                </button>
                <button
                  className="text-gray-400 hover:text-white text-xl"
                  aria-label={`Eliminar ${m.name ?? "Marcador"}`}
                  onClick={() => onDeleteClick(m.id, m.name)}
                  title="Eliminar"
                >
                  &times;
                </button>
              </div>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="text-sm text-gray-400">No hay resultados para "{query}"</li>
          )}
        </ul>
      </div>

      {/* Botones de Acción */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <button
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2"
          onClick={onAddClick}
        >
          + Añadir Nueva Dirección
        </button>
        <div className="flex space-x-2">
          <button
            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
            onClick={onImportClick}
          >
            Importar
          </button>
          <button
            className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
            onClick={onExportClick}
          >
            Exportar
          </button>
        </div>
      </div>

      {/* Modal de edición */}
      {editingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-title"
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              e.stopPropagation();
              requestClose();
            }
          }}
        >
          <div className="w-full max-w-md bg-gray-800 text-white rounded-lg p-4 border border-gray-700 shadow-lg" onClick={(e) => e.stopPropagation()}>
            <h3 id="edit-title" className="text-xl font-semibold mb-2">Editar dirección</h3>
            <p className="sr-only" aria-live="assertive">{announce}</p>

            <label className="block text-sm mb-2">
              Nombre
              <input
                className={`mt-1 w-full p-2 rounded bg-gray-700 border ${errors.name ? "border-red-500" : "border-gray-600"}`}
                placeholder="Ej.: Ayuntamiento de Las Palmas de Gran Canaria"
                value={form.name}
                data-error={!!errors.name}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "error-name" : undefined}
                autoFocus
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
              {errors.name && <span id="error-name" className="text-red-400 text-xs">{errors.name}</span>}
            </label>

            <label className="block text-sm mb-2">
              Descripción
              <textarea
                className="mt-1 w-full p-2 rounded bg-gray-700 border border-gray-600"
                placeholder="Ej.: Sede principal del Ayuntamiento"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </label>

            <label className="block text-sm mb-2">
              Dirección
              <input
                className="mt-1 w-full p-2 rounded bg-gray-700 border border-gray-600"
                placeholder="Ej.: Calle León y Castillo, 270"
                value={form.address}
                onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              />
            </label>

            <label className="block text-sm mb-4">
              CP
              <input
                className={`mt-1 w-full p-2 rounded bg-gray-700 border ${errors.CP ? "border-red-500" : "border-gray-600"}`}
                placeholder="Ej.: 35005 o 35005 Las Palmas de Gran Canaria"
                value={form.CP}
                data-error={!!errors.CP}
                aria-invalid={!!errors.CP}
                aria-describedby={errors.CP ? "error-cp" : undefined}
                onChange={(e) => setForm((f) => ({ ...f, CP: e.target.value }))}
              />
              {errors.CP && <span id="error-cp" className="text-red-400 text-xs">{errors.CP}</span>}
            </label>

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded border border-gray-600 hover:border-gray-500 text-gray-300 hover:text-white"
                onClick={requestClose}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold disabled:opacity-60"
                onClick={saveEdit}
                disabled={Object.keys(errors).length > 0 || form.name.trim().length === 0}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
