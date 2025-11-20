"use client";

import { type FC, useState } from "react";
import { X } from "lucide-react";

interface AddMarkerModalProps {
  isOpen: boolean;
  coordinates: { lat: number; lng: number } | null;
  onConfirm: (data: {
    name: string;
    address: string;
    description: string;
    CP: string;
    coordinates: { lat: number; lng: number };
  }) => void;
  onCancel: () => void;
}

const AddMarkerModal: FC<AddMarkerModalProps> = ({
  isOpen,
  coordinates,
  onConfirm,
  onCancel,
}) => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [CP, setCP] = useState("");

  if (!isOpen || !coordinates) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("El nombre es obligatorio");
      return;
    }
    onConfirm({
      name: name.trim(),
      address: address.trim(),
      description: description.trim(),
      CP: CP.trim(),
      coordinates,
    });
    // Limpiar formulario
    setName("");
    setAddress("");
    setDescription("");
    setCP("");
  };

  const handleCancel = () => {
    // Limpiar formulario
    setName("");
    setAddress("");
    setDescription("");
    setCP("");
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">
            Añadir nuevo marcador
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Coordenadas (solo lectura) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Coordenadas
            </label>
            <input
              type="text"
              value={`${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}`}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 text-sm"
            />
          </div>

          {/* Nombre (obligatorio) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ej: Mi casa, Cafetería central..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              autoFocus
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Ej: Calle Fernando Guanarteme, 70"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Código Postal */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Código Postal
            </label>
            <input
              type="text"
              value={CP}
              onChange={(e) => setCP(e.target.value)}
              placeholder="Ej: 35907"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ej: Guanarteme, Las Palmas de Gran Canaria, Canarias, España"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Añadir marcador
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMarkerModal;
