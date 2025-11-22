"use client";

import { type FC, useState, useEffect, useMemo } from "react";
import { X } from "lucide-react";
import { useMapStore } from "@/hooks/useMapStore";
import { getUniqueGroups, DEFAULT_GROUP, type Location } from "@/types";
import FocusTrap from "focus-trap-react";

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    description: string;
    address: string;
    CP: string;
    group: string;
    tags: string[];
    coordinates?: { lat: number; lng: number };
  }) => void;
  initialData?: Location | null; // Si existe, modo edición
  defaultCoordinates?: { lat: number; lng: number }; // Para modo creación
}

const LocationModal: FC<LocationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultCoordinates,
}) => {
  // Estados del formulario
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [CP, setCP] = useState("");
  const [group, setGroup] = useState<string>(DEFAULT_GROUP);
  const [tagsInput, setTagsInput] = useState("");
  const [lat, setLat] = useState<number | string>("");
  const [lng, setLng] = useState<number | string>("");
  
  // Errores
  const [errors, setErrors] = useState<{ name?: string; CP?: string }>({});

  // Obtener grupos para autocompletado
  const markers = useMapStore((s) => s.markers);
  const uniqueGroups = useMemo(() => getUniqueGroups(markers), [markers]);

  // Inicializar formulario al abrir o cambiar datos
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        // Modo Edición
        setName(initialData.name || "");
        setDescription(initialData.description || "");
        setAddress(initialData.address || "");
        setCP(initialData.CP || "");
        setGroup(initialData.group || DEFAULT_GROUP);
        setTagsInput((initialData.tags || []).join(", "));
        setLat(initialData.coordinates.lat);
        setLng(initialData.coordinates.lng);
      } else {
        // Modo Creación
        setName("");
        setDescription("");
        setAddress("");
        setCP("");
        setGroup(DEFAULT_GROUP);
        setTagsInput("");
        if (defaultCoordinates) {
          setLat(defaultCoordinates.lat);
          setLng(defaultCoordinates.lng);
        } else {
          setLat("");
          setLng("");
        }
      }
      setErrors({});
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  // Coordenadas a mostrar (del dato inicial o por defecto)
  const displayCoords = initialData?.coordinates || defaultCoordinates;

  const validate = () => {
    const newErrors: { name?: string; CP?: string } = {};
    if (!name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }
    if (CP.trim()) {
      const cpPattern = /^\d{5}(?:[\s-].+)?$/;
      if (!cpPattern.test(CP.trim())) {
        newErrors.CP = "El CP debe comenzar con 5 dígitos";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const finalTags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    onSave({
      name: name.trim(),
      description: description.trim(),
      address: address.trim(),
      CP: CP.trim(),
      group: group.trim() || DEFAULT_GROUP,
      tags: finalTags,
      coordinates: {
        lat: typeof lat === "number" ? lat : parseFloat(lat as string) || 0,
        lng: typeof lng === "number" ? lng : parseFloat(lng as string) || 0,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <FocusTrap active={isOpen}>
        <div className="bg-gray-800 text-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-gray-700">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold">
              {initialData ? "Editar Dirección" : "Nueva Dirección"}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            {/* Coordenadas (Editables) */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Latitud
                </label>
                <input
                  type="number"
                  step="any"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Longitud
                </label>
                <input
                  type="number"
                  step="any"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Nombre <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej: Mi casa, Oficina..."
                className={`w-full px-3 py-2 border rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.name ? "border-red-500" : "border-gray-600"
                }`}
                autoFocus
              />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Descripción */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalles adicionales..."
                rows={2}
                className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
              />
            </div>

            {/* Dirección */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Dirección
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Calle, número..."
                className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            {/* CP */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Código Postal
              </label>
              <input
                type="text"
                value={CP}
                onChange={(e) => setCP(e.target.value)}
                placeholder="Ej: 35001"
                className={`w-full px-3 py-2 border rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                  errors.CP ? "border-red-500" : "border-gray-600"
                }`}
              />
              {errors.CP && <p className="text-red-400 text-xs mt-1">{errors.CP}</p>}
            </div>

            {/* Grupo */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Carpeta
              </label>
              <input
                type="text"
                list="location-modal-groups"
                value={group}
                onChange={(e) => setGroup(e.target.value)}
                placeholder="Ej: Trabajo, Personal..."
                className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <datalist id="location-modal-groups">
                {uniqueGroups.map((g) => (
                  <option key={g} value={g} />
                ))}
              </datalist>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Etiquetas
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Ej: wifi, terraza (separar por comas)"
                className="w-full px-3 py-2 border border-gray-600 rounded bg-gray-700 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {/* Preview Pills */}
              {tagsInput.trim() && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {tagsInput
                    .split(",")
                    .map((t) => t.trim())
                    .filter((t) => t !== "")
                    .map((tag, idx) => (
                      <span
                        key={idx}
                        className="inline-block bg-gray-600 text-gray-200 text-xs px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                </div>
              )}
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-600 rounded text-gray-300 hover:bg-gray-700 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      </FocusTrap>
    </div>
  );
};

export default LocationModal;
