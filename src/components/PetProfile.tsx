import { Pet } from "@/types/pet";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Heart,
  Users,
  Zap,
  Shield,
  Scissors,
  ArrowLeft,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { motion } from "framer-motion";

interface PetProfileProps {
  pet: Pet;
  onBack?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  className?: string;
}

export const PetProfile = ({
  pet,
  onBack,
  onLike,
  onDislike,
  className,
}: PetProfileProps) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const getEnergyColor = (energy: Pet["energy"]) => {
    switch (energy) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
    }
  };

  const getSizeColor = (size: Pet["size"]) => {
    switch (size) {
      case "small":
        return "bg-blue-100 text-blue-800";
      case "medium":
        return "bg-purple-100 text-purple-800";
      case "large":
        return "bg-orange-100 text-orange-800";
    }
  };

  const nextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % pet.photos.length);
  };

  const prevPhoto = () => {
    setCurrentPhotoIndex(
      (prev) => (prev - 1 + pet.photos.length) % pet.photos.length,
    );
  };

  return (
    <div
      className={cn(
        "w-full min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 relative overflow-hidden",
        className,
      )}
    >
      {/* Animated background similar to main app */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Header */}
      {onBack && (
        <div className="flex items-center p-6 bg-black/30 backdrop-blur-xl border-b border-white/20 sticky top-0 z-20 shadow-2xl">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="ghost"
              size="lg"
              onClick={onBack}
              className="w-16 h-16 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-8 h-8" />
            </Button>
          </motion.div>
          <h2 className="text-3xl lg:text-4xl font-bold ml-4 text-white drop-shadow-2xl">
            Perfil de {pet.name}
          </h2>
        </div>
      )}
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Photo Gallery */}
        <div className="relative">
          <img
            src={pet.photos[currentPhotoIndex]}
            alt={`${pet.name} - Foto ${currentPhotoIndex + 1}`}
            className="w-full h-[700px] lg:h-[800px] xl:h-[900px] object-cover cursor-pointer"
            onClick={nextPhoto}
          />

          {/* Photo indicators */}
          {pet.photos.length > 1 && (
            <div className="absolute top-8 left-8 right-8">
              <div className="flex gap-2">
                {pet.photos.map((_, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex-1 h-2 rounded-full",
                      index === currentPhotoIndex ? "bg-white" : "bg-white/50",
                    )}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Photo count */}
          {pet.photos.length > 1 && (
            <div className="absolute bottom-8 right-8 bg-black/70 text-white px-6 py-3 rounded-full text-xl flex items-center gap-2">
              <Camera className="w-6 h-6" />
              {currentPhotoIndex + 1}/{pet.photos.length}
            </div>
          )}

          {/* Size and Energy badges */}
          <div className="absolute top-8 right-8 flex gap-4">
            <Badge
              variant="secondary"
              className={cn(getSizeColor(pet.size), "text-xl px-6 py-3")}
            >
              {pet.size === "small"
                ? "Pequeño"
                : pet.size === "medium"
                  ? "Mediano"
                  : "Grande"}
            </Badge>
            <Badge
              variant="secondary"
              className={cn(getEnergyColor(pet.energy), "text-xl px-6 py-3")}
            >
              <Zap className="w-5 h-5 mr-2" />
              {pet.energy === "low"
                ? "Tranquilo"
                : pet.energy === "medium"
                  ? "Activo"
                  : "Muy Activo"}
            </Badge>
          </div>

          {/* Navigation arrows */}
          {pet.photos.length > 1 && (
            <>
              <button
                onClick={prevPhoto}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-black/50 text-white rounded-full flex items-center justify-center text-2xl hover:bg-black/70 transition-colors"
              >
                ←
              </button>
              <button
                onClick={nextPhoto}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-black/50 text-white rounded-full flex items-center justify-center text-2xl hover:bg-black/70 transition-colors"
              >
                →
              </button>
            </>
          )}
        </div>

        {/* Content */}
        <div className="p-12 lg:p-16">
          {/* Basic Info */}
          <div className="flex items-center justify-between mb-12">
            <div>
              <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold text-gray-900">
                {pet.name}
              </h1>
              <p className="text-3xl lg:text-4xl text-gray-600 mt-4">
                {pet.age} {pet.age === 1 ? "año" : "años"} • {pet.breed}
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl lg:text-4xl text-gray-500 capitalize font-medium">
                {pet.gender === "male" ? "Macho" : "Hembra"}
              </p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-center gap-4 mb-12 text-2xl lg:text-3xl text-gray-600">
            <MapPin className="w-10 h-10 lg:w-12 lg:h-12" />
            <span>{pet.location}</span>
          </div>

          {/* Description */}
          <div className="mb-12">
            <h3 className="text-4xl lg:text-5xl font-semibold text-gray-900 mb-6">
              Sobre {pet.name}
            </h3>
            <p className="text-2xl lg:text-3xl text-gray-700 leading-relaxed">
              {pet.description}
            </p>
          </div>

          {/* Personality */}
          <div className="mb-12">
            <h3 className="text-4xl lg:text-5xl font-semibold text-gray-900 mb-6">
              Personalidad
            </h3>
            <div className="flex flex-wrap gap-4">
              {pet.personality.map((trait) => (
                <Badge
                  key={trait}
                  variant="outline"
                  className="text-2xl lg:text-3xl py-3 px-6"
                >
                  {trait}
                </Badge>
              ))}
            </div>
          </div>

          {/* Health & Compatibility */}
          <div className="space-y-8 mb-16">
            <h3 className="text-4xl lg:text-5xl font-semibold text-gray-900">
              Información adicional
            </h3>

            <div className="grid grid-cols-2 gap-8">
              <div className="flex items-center gap-4">
                <Shield
                  className={cn(
                    "w-10 h-10",
                    pet.vaccinated ? "text-green-600" : "text-gray-400",
                  )}
                />
                <span
                  className={cn(
                    "text-xl lg:text-2xl",
                    pet.vaccinated ? "text-green-600" : "text-gray-500",
                  )}
                >
                  {pet.vaccinated ? "Vacunado" : "No vacunado"}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Scissors
                  className={cn(
                    "w-10 h-10",
                    pet.neutered ? "text-blue-600" : "text-gray-400",
                  )}
                />
                <span
                  className={cn(
                    "text-xl lg:text-2xl",
                    pet.neutered ? "text-blue-600" : "text-gray-500",
                  )}
                >
                  {pet.neutered ? "Esterilizado" : "No esterilizado"}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Users
                  className={cn(
                    "w-10 h-10",
                    pet.goodWithKids ? "text-purple-600" : "text-gray-400",
                  )}
                />
                <span
                  className={cn(
                    "text-xl lg:text-2xl",
                    pet.goodWithKids ? "text-purple-600" : "text-gray-500",
                  )}
                >
                  {pet.goodWithKids
                    ? "Bueno con niños"
                    : "No recomendado con niños"}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <Heart
                  className={cn(
                    "w-10 h-10",
                    pet.goodWithPets ? "text-pink-600" : "text-gray-400",
                  )}
                />
                <span
                  className={cn(
                    "text-xl lg:text-2xl",
                    pet.goodWithPets ? "text-pink-600" : "text-gray-500",
                  )}
                >
                  {pet.goodWithPets
                    ? "Sociable con mascotas"
                    : "Prefiere ser único"}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {(onLike || onDislike) && (
            <div className="flex gap-8">
              {onDislike && (
                <Button
                  onClick={onDislike}
                  variant="outline"
                  size="lg"
                  className="flex-1 border-red-200 hover:border-red-300 hover:bg-red-50 text-red-600 text-2xl py-6"
                >
                  No me gusta
                </Button>
              )}
              {onLike && (
                <Button
                  onClick={onLike}
                  size="lg"
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white text-2xl py-6"
                >
                  ¡Me gusta!
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
