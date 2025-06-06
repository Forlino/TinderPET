import { UserProfile } from "@/types/user";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Edit,
  MapPin,
  Camera,
  Home,
  Heart,
  Users,
  Briefcase,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

interface UserProfileViewProps {
  profile: UserProfile;
  onEdit: () => void;
  onBack: () => void;
}

export const UserProfileView = ({
  profile,
  onEdit,
  onBack,
}: UserProfileViewProps) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % profile.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex(
      (prev) => (prev - 1 + profile.photos.length) % profile.photos.length,
    );
  };

  const getPetTypeEmoji = (type: string) => {
    const emojis = { dog: "🐕", cat: "🐱", bird: "🐦", other: "🐰" };
    return emojis[type as keyof typeof emojis] || "🐾";
  };

  const getLivingSpaceLabel = (space: string) => {
    const labels = {
      apartment: "Apartamento",
      house: "Casa",
      farm: "Granja/Finca",
    };
    return labels[space as keyof typeof labels] || space;
  };

  const getWorkScheduleLabel = (schedule: string) => {
    const labels = {
      "full-time": "Tiempo completo",
      "part-time": "Tiempo parcial",
      remote: "Remoto",
      retired: "Jubilado",
      student: "Estudiante",
    };
    return labels[schedule as keyof typeof labels] || schedule;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/30 via-purple-600/20 to-indigo-600/30"></div>
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-violet-400 to-purple-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-purple-400 to-violet-500 rounded-full opacity-15 blur-3xl animate-pulse delay-500"></div>

        {/* Floating particles */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-3xl opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -80, 0],
              opacity: [0.3, 0.7, 0.3],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 5 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          >
            👤
          </motion.div>
        ))}
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-8 bg-white/10 backdrop-blur-xl shadow-xl border-b border-white/20">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="lg"
              onClick={onBack}
              className="w-16 h-16 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-8 h-8" />
            </Button>
            <motion.h1
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl lg:text-5xl font-black text-white ml-6 drop-shadow-2xl"
            >
              👤 Mi Perfil
            </motion.h1>
          </div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={onEdit}
              size="lg"
              className="bg-white/20 backdrop-blur-xl hover:bg-white/30 text-white text-xl px-8 py-4 border border-white/30 rounded-2xl shadow-2xl"
            >
              <Edit className="w-6 h-6 mr-3" />
              Editar
            </Button>
          </motion.div>
        </div>

        <div className="max-w-6xl mx-auto p-8">
          {/* Fotos */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="mb-8 overflow-hidden bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
              <div className="relative">
                {profile.photos.length > 0 ? (
                  <>
                    <img
                      src={profile.photos[currentPhotoIndex]}
                      alt={`${profile.name} - Foto ${currentPhotoIndex + 1}`}
                      className="w-full h-[600px] lg:h-[700px] object-cover cursor-pointer transition-transform duration-500 hover:scale-105"
                      onClick={nextPhoto}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>

                    {/* Photo indicators */}
                    {profile.photos.length > 1 && (
                      <div className="absolute top-8 left-8 right-8">
                        <div className="flex gap-2">
                          {profile.photos.map((_, index) => (
                            <div
                              key={index}
                              className={`flex-1 h-2 rounded-full backdrop-blur-md ${
                                index === currentPhotoIndex
                                  ? "bg-white"
                                  : "bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Photo count */}
                    {profile.photos.length > 1 && (
                      <div className="absolute bottom-8 right-8 bg-black/70 backdrop-blur-md text-white px-6 py-3 rounded-2xl text-xl flex items-center gap-2 border border-white/30">
                        <Camera className="w-6 h-6" />
                        {currentPhotoIndex + 1}/{profile.photos.length}
                      </div>
                    )}

                    {/* Navigation arrows */}
                    {profile.photos.length > 1 && (
                      <>
                        <button
                          onClick={prevPhoto}
                          className="absolute left-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-black/50 backdrop-blur-md text-white rounded-full flex items-center justify-center text-2xl hover:bg-black/70 transition-colors border border-white/30"
                        >
                          ←
                        </button>
                        <button
                          onClick={nextPhoto}
                          className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-black/50 backdrop-blur-md text-white rounded-full flex items-center justify-center text-2xl hover:bg-black/70 transition-colors border border-white/30"
                        >
                          →
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="h-[600px] bg-white/10 backdrop-blur-md flex items-center justify-center">
                    <div className="text-center text-white/80">
                      <Camera className="w-20 h-20 mx-auto mb-4" />
                      <p className="text-2xl">No hay fotos</p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Información básica */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-10 mb-8 bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-6xl lg:text-7xl font-black text-white drop-shadow-2xl">
                    {profile.name}
                  </h2>
                  <p className="text-3xl lg:text-4xl text-white/90 mt-4 font-bold">
                    {profile.age} años
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-8 text-2xl lg:text-3xl text-white/90">
                <MapPin className="w-10 h-10 text-blue-300" />
                <span className="font-medium">{profile.location}</span>
              </div>

              {profile.bio && (
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-white mb-4 drop-shadow-lg">
                    Sobre mí
                  </h3>
                  <p className="text-2xl text-white/90 leading-relaxed">
                    {profile.bio}
                  </p>
                </div>
              )}
            </Card>
          </motion.div>

          {/* Preferencias de mascotas */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card className="p-10 mb-8 bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
              <h3 className="text-4xl font-bold text-white mb-8 drop-shadow-lg">
                Preferencias de Animales
              </h3>
              <div className="space-y-8">
                <div>
                  <h4 className="text-2xl font-medium text-white/90 mb-4">
                    Tipos de animales que me interesan
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {profile.preferences.petTypes.map((type) => (
                      <Badge
                        key={type}
                        className="text-xl px-6 py-3 bg-white/20 backdrop-blur-md border-white/30 text-white"
                      >
                        {getPetTypeEmoji(type)}{" "}
                        {type === "dog"
                          ? "Perros"
                          : type === "cat"
                            ? "Gatos"
                            : type === "bird"
                              ? "Aves"
                              : "Otros"}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-2xl font-medium text-white/90 mb-4">
                    Tamaños preferidos
                  </h4>
                  <div className="flex flex-wrap gap-4">
                    {profile.preferences.sizes.map((size) => (
                      <Badge
                        key={size}
                        className="text-xl px-6 py-3 bg-white/20 backdrop-blur-md border-white/30 text-white"
                      >
                        {size === "small"
                          ? "Pequeño"
                          : size === "medium"
                            ? "Mediano"
                            : "Grande"}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <h4 className="text-2xl font-medium text-white/90 mb-2">
                      Rango de edad
                    </h4>
                    <p className="text-xl text-white/80">
                      {profile.preferences.ageRange.min} -{" "}
                      {profile.preferences.ageRange.max} años
                    </p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <h4 className="text-2xl font-medium text-white/90 mb-2">
                      Distancia máxima
                    </h4>
                    <p className="text-xl text-white/80">
                      {profile.preferences.maxDistance} km
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Información del hogar */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card className="p-10 mb-8 bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
              <h3 className="text-4xl font-bold text-white mb-8 drop-shadow-lg">
                Información del Hogar
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <Home className="w-8 h-8 text-blue-400" />
                  <div>
                    <h4 className="text-xl font-medium text-white/90">
                      Tipo de vivienda
                    </h4>
                    <p className="text-lg text-white/80">
                      {getLivingSpaceLabel(profile.livingSpace)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                  <Briefcase className="w-8 h-8 text-green-400" />
                  <div>
                    <h4 className="text-xl font-medium text-white/90">
                      Horario de trabajo
                    </h4>
                    <p className="text-lg text-white/80">
                      {getWorkScheduleLabel(profile.workSchedule)}
                    </p>
                  </div>
                </div>

                {profile.hasYard && (
                  <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <div className="w-8 h-8 text-green-400 flex items-center justify-center text-2xl">
                      🌳
                    </div>
                    <div>
                      <h4 className="text-xl font-medium text-white/90">
                        Patio/Jardín
                      </h4>
                      <p className="text-lg text-white/80">Disponible</p>
                    </div>
                  </div>
                )}

                {profile.hasOtherPets && (
                  <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                    <Heart className="w-8 h-8 text-pink-400" />
                    <div>
                      <h4 className="text-xl font-medium text-white/90">
                        Otros animales
                      </h4>
                      <p className="text-lg text-white/80">
                        Tengo otros animales en casa
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Experiencia */}
          {profile.experience && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
            >
              <Card className="p-10 bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl">
                <h3 className="text-4xl font-bold text-white mb-6 drop-shadow-lg">
                  Experiencia con Animales
                </h3>
                <p className="text-2xl text-white/90 leading-relaxed">
                  {profile.experience}
                </p>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
