import { useState } from "react";
import { UserProfile } from "@/types/user";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Camera, Plus, X, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface UserProfileFormProps {
  profile?: UserProfile;
  onSave: (profile: UserProfile) => void;
  onCancel: () => void;
}

export const UserProfileForm = ({
  profile,
  onSave,
  onCancel,
}: UserProfileFormProps) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>(
    profile || {
      name: "",
      age: 25,
      location: "",
      photos: [],
      bio: "",
      preferences: {
        petTypes: [],
        ageRange: { min: 1, max: 10 },
        sizes: [],
        maxDistance: 50,
      },
      contact: {},
      experience: "",
      livingSpace: "apartment",
      hasYard: false,
      hasOtherPets: false,
      workSchedule: "full-time",
    },
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.age && formData.location) {
      onSave({
        ...formData,
        id: profile?.id || Date.now().toString(),
      } as UserProfile);
    }
  };

  const updatePreferences = (
    key: keyof UserProfile["preferences"],
    value: any,
  ) => {
    setFormData((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences!,
        [key]: value,
      },
    }));
  };

  const togglePetType = (type: "dog" | "cat" | "bird" | "other") => {
    const current = formData.preferences?.petTypes || [];
    const updated = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    updatePreferences("petTypes", updated);
  };

  const toggleSize = (size: "small" | "medium" | "large") => {
    const current = formData.preferences?.sizes || [];
    const updated = current.includes(size)
      ? current.filter((s) => s !== size)
      : [...current, size];
    updatePreferences("sizes", updated);
  };

  const addPhoto = () => {
    // En una app real, aquí abriríamos el selector de archivos
    const photoUrls = [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
    ];

    const randomPhoto = photoUrls[Math.floor(Math.random() * photoUrls.length)];
    const currentPhotos = formData.photos || [];

    if (currentPhotos.length < 6) {
      setFormData((prev) => ({
        ...prev,
        photos: [...currentPhotos, randomPhoto],
      }));
    }
  };

  const removePhoto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      photos: (prev.photos || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-violet-600 via-purple-700 to-indigo-800 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-600/30 via-violet-600/20 to-indigo-600/30"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-violet-400 to-purple-500 rounded-full opacity-15 blur-3xl animate-pulse delay-500"></div>

        {/* Floating icons */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-4xl opacity-20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -60, 0],
              opacity: [0.2, 0.5, 0.2],
              rotate: [0, 360],
            }}
            transition={{
              duration: 6 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            ✨
          </motion.div>
        ))}
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center mb-12">
          <Button
            variant="ghost"
            size="lg"
            onClick={onCancel}
            className="w-16 h-16 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-8 h-8" />
          </Button>
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-5xl lg:text-6xl font-black text-white ml-6 drop-shadow-2xl"
          >
            {profile ? "✏️ Editar Perfil" : "✨ Crear Perfil"}
          </motion.h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Fotos */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-8 bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-6 drop-shadow-lg">
                📸 Fotos
              </h2>
              <p className="text-xl text-white/90 mb-8">
                Añade hasta 6 fotos para mostrar quién eres
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {(formData.photos || []).map((photo, index) => (
                  <motion.div
                    key={index}
                    className="relative aspect-square rounded-2xl overflow-hidden group"
                    whileHover={{ scale: 1.05 }}
                  >
                    <img
                      src={photo}
                      alt={`Foto ${index + 1}`}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-md"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    {index === 0 && (
                      <div className="absolute bottom-2 left-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm backdrop-blur-md">
                        Principal
                      </div>
                    )}
                  </motion.div>
                ))}

                {(formData.photos?.length || 0) < 6 && (
                  <motion.button
                    type="button"
                    onClick={addPhoto}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="aspect-square border-2 border-dashed border-white/50 rounded-2xl flex flex-col items-center justify-center text-white/80 hover:border-white hover:text-white transition-colors bg-white/10 backdrop-blur-md"
                  >
                    <Plus className="w-12 h-12 mb-2" />
                    <span className="text-lg">Añadir foto</span>
                  </motion.button>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Información básica */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-8 bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-8 drop-shadow-lg">
                👤 Información Básica
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <Label
                    htmlFor="name"
                    className="text-xl font-medium text-white"
                  >
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={formData.name || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="mt-2 text-lg h-14 bg-white/20 backdrop-blur-md border-white/30 text-white placeholder:text-white/60"
                    placeholder="Tu nombre"
                    required
                  />
                </div>

                <div>
                  <Label
                    htmlFor="age"
                    className="text-xl font-medium text-white"
                  >
                    Edad
                  </Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        age: parseInt(e.target.value),
                      }))
                    }
                    className="mt-2 text-lg h-14 bg-white/20 backdrop-blur-md border-white/30 text-white placeholder:text-white/60"
                    min="18"
                    max="100"
                    required
                  />
                </div>
              </div>

              <div className="mt-8">
                <Label
                  htmlFor="location"
                  className="text-xl font-medium text-white"
                >
                  Ubicación
                </Label>
                <Input
                  id="location"
                  type="text"
                  value={formData.location || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      location: e.target.value,
                    }))
                  }
                  className="mt-2 text-lg h-14 bg-white/20 backdrop-blur-md border-white/30 text-white placeholder:text-white/60"
                  placeholder="Ciudad, País"
                  required
                />
              </div>

              <div className="mt-8">
                <Label
                  htmlFor="experience"
                  className="text-xl font-medium text-white"
                >
                  Experiencia con animales
                </Label>
                <Textarea
                  id="experience"
                  value={formData.experience || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      experience: e.target.value,
                    }))
                  }
                  className="mt-2 text-lg min-h-24 bg-white/20 backdrop-blur-md border-white/30 text-white placeholder:text-white/60"
                  placeholder="Describe tu experiencia con animales..."
                />
              </div>
            </Card>
          </motion.div>

          {/* Preferencias de mascotas */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-8 bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-8 drop-shadow-lg">
                🐾 Preferencias de Animales
              </h2>
              <div className="space-y-8">
                <div>
                  <Label className="text-xl font-medium text-white mb-4 block">
                    Tipos de animales
                  </Label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { id: "dog", label: "🐕 Perros" },
                      { id: "cat", label: "🐱 Gatos" },
                      { id: "bird", label: "🐦 Aves" },
                      { id: "other", label: "🐰 Otros" },
                    ].map((type) => (
                      <motion.button
                        key={type.id}
                        type="button"
                        onClick={() => togglePetType(type.id as any)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "px-6 py-3 rounded-full text-lg font-medium transition-all backdrop-blur-md border",
                          (formData.preferences?.petTypes || []).includes(
                            type.id as any,
                          )
                            ? "bg-pink-500/80 text-white border-pink-400/50"
                            : "bg-white/20 text-white/80 hover:bg-white/30 border-white/30",
                        )}
                      >
                        {type.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label className="text-xl font-medium text-white mb-4 block">
                    Tamaños
                  </Label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { id: "small", label: "Pequeño" },
                      { id: "medium", label: "Mediano" },
                      { id: "large", label: "Grande" },
                    ].map((size) => (
                      <motion.button
                        key={size.id}
                        type="button"
                        onClick={() => toggleSize(size.id as any)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className={cn(
                          "px-6 py-3 rounded-full text-lg font-medium transition-all backdrop-blur-md border",
                          (formData.preferences?.sizes || []).includes(
                            size.id as any,
                          )
                            ? "bg-purple-500/80 text-white border-purple-400/50"
                            : "bg-white/20 text-white/80 hover:bg-white/30 border-white/30",
                        )}
                      >
                        {size.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <Label
                      htmlFor="minAge"
                      className="text-xl font-medium text-white"
                    >
                      Edad mínima (años)
                    </Label>
                    <Input
                      id="minAge"
                      type="number"
                      value={formData.preferences?.ageRange?.min || ""}
                      onChange={(e) =>
                        updatePreferences("ageRange", {
                          ...formData.preferences?.ageRange,
                          min: parseInt(e.target.value),
                        })
                      }
                      className="mt-2 text-lg h-14 bg-white/20 backdrop-blur-md border-white/30 text-white"
                      min="0"
                    />
                  </div>

                  <div>
                    <Label
                      htmlFor="maxAge"
                      className="text-xl font-medium text-white"
                    >
                      Edad máxima (años)
                    </Label>
                    <Input
                      id="maxAge"
                      type="number"
                      value={formData.preferences?.ageRange?.max || ""}
                      onChange={(e) =>
                        updatePreferences("ageRange", {
                          ...formData.preferences?.ageRange,
                          max: parseInt(e.target.value),
                        })
                      }
                      className="mt-2 text-lg h-14 bg-white/20 backdrop-blur-md border-white/30 text-white"
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Información adicional */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-8 bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-8 drop-shadow-lg">
                🏠 Información Adicional
              </h2>

              <div className="space-y-8">
                <div>
                  <Label
                    htmlFor="experience"
                    className="text-xl font-medium text-white"
                  >
                    Experiencia con mascotas
                  </Label>
                  <Textarea
                    id="experience"
                    value={formData.experience || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        experience: e.target.value,
                      }))
                    }
                    className="mt-2 text-lg min-h-24 bg-white/20 backdrop-blur-md border-white/30 text-white placeholder:text-white/60"
                    placeholder="Describe tu experiencia con mascotas..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <Label className="text-xl font-medium text-white mb-4 block">
                      Tipo de vivienda
                    </Label>
                    <div className="space-y-3">
                      {[
                        { id: "apartment", label: "Apartamento" },
                        { id: "house", label: "Casa" },
                        { id: "farm", label: "Granja/Finca" },
                      ].map((living) => (
                        <label
                          key={living.id}
                          className="flex items-center bg-white/10 backdrop-blur-md rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-colors"
                        >
                          <input
                            type="radio"
                            name="livingSpace"
                            value={living.id}
                            checked={formData.livingSpace === living.id}
                            onChange={(e) =>
                              setFormData((prev) => ({
                                ...prev,
                                livingSpace: e.target.value as any,
                              }))
                            }
                            className="w-5 h-5 text-pink-500"
                          />
                          <span className="ml-3 text-lg text-white">
                            {living.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xl font-medium text-white mb-4 block">
                      Información adicional
                    </Label>
                    <div className="space-y-3">
                      <label className="flex items-center bg-white/10 backdrop-blur-md rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.hasYard || false}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              hasYard: e.target.checked,
                            }))
                          }
                          className="w-5 h-5 text-pink-500"
                        />
                        <span className="ml-3 text-lg text-white">
                          Tengo patio/jardín
                        </span>
                      </label>

                      <label className="flex items-center bg-white/10 backdrop-blur-md rounded-xl p-4 cursor-pointer hover:bg-white/20 transition-colors">
                        <input
                          type="checkbox"
                          checked={formData.hasOtherPets || false}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              hasOtherPets: e.target.checked,
                            }))
                          }
                          className="w-5 h-5 text-pink-500"
                        />
                        <span className="ml-3 text-lg text-white">
                          Tengo otros animales
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Botones */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex gap-6 justify-end"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="button"
                onClick={onCancel}
                className="text-xl px-12 py-6 bg-white/20 backdrop-blur-xl hover:bg-white/30 text-white border border-white/30 rounded-2xl shadow-2xl"
              >
                Cancelar
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                className="bg-gradient-to-r from-pink-500 via-purple-500 to-violet-600 hover:from-pink-600 hover:via-purple-600 hover:to-violet-700 text-white text-xl px-12 py-6 rounded-2xl shadow-2xl border-0"
              >
                {profile ? "Actualizar Perfil" : "Crear Perfil"}
              </Button>
            </motion.div>
          </motion.div>
        </form>
      </div>
    </div>
  );
};
