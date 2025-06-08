import { Pet } from "@/types/pet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Heart,
  X,
  MapPin,
  Calendar,
  Users,
  Star,
  Shield,
  Camera,
  Info,
} from "lucide-react";
import { OptimizedBackground } from "./OptimizedBackground";

interface PetProfileProps {
  pet: Pet;
  onBack: () => void;
  onLike: () => void;
  onDislike: () => void;
}

export const PetProfile = ({
  pet,
  onBack,
  onLike,
  onDislike,
}: PetProfileProps) => {
  const getAgeText = (age: number) => {
    if (age < 1) return "Cachorro";
    if (age === 1) return "1 año";
    return `${age} años`;
  };

  return (
    <OptimizedBackground variant="purple" intensity="medium">
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            size="lg"
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 shadow-xl"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Volver
          </Button>
          <h1 className="text-3xl lg:text-5xl font-black text-white">
            Perfil de {pet.name}
          </h1>
          <div></div>
        </div>

        {/* Main content */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Pet image */}
          <div className="relative">
            <div className="aspect-[3/4] bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
              <img
                src={pet.image}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className="bg-black/40 text-white border-0 shadow-lg">
                  <Camera className="w-4 h-4 mr-1" />1 de{" "}
                  {pet.images?.length || 1}
                </Badge>
              </div>
            </div>
          </div>

          {/* Pet info */}
          <div className="space-y-6">
            {/* Basic info card */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-3xl font-bold text-white">{pet.name}</h2>
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="text-white font-semibold">4.9</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-white/90">
                    <Calendar className="w-5 h-5" />
                    <span>{getAgeText(pet.age)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Users className="w-5 h-5" />
                    <span className="capitalize">{pet.gender}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <MapPin className="w-5 h-5" />
                    <span>{pet.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/90">
                    <Shield className="w-5 h-5" />
                    <span className="capitalize">{pet.size}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-gradient-to-r from-pink-500 to-rose-600 text-white border-0">
                    {pet.breed}
                  </Badge>
                  <Badge className="bg-gradient-to-r from-purple-500 to-violet-600 text-white border-0">
                    {pet.type}
                  </Badge>
                  {pet.isVaccinated && (
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                      Vacunado
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Description */}
            {pet.description && (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    Sobre {pet.name}
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    {pet.description}
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Personality traits */}
            {pet.personalityTraits && pet.personalityTraits.length > 0 && (
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-white mb-4">
                    Personalidad
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {pet.personalityTraits.map((trait, index) => (
                      <Badge
                        key={index}
                        className="bg-white/20 text-white border border-white/30"
                      >
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-12">
          <Button
            onClick={onDislike}
            size="lg"
            className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-md border-4 border-red-400/50 hover:border-red-400 hover:bg-red-500/20 shadow-2xl transition-all duration-300 group"
          >
            <X
              className="w-20 h-20 text-red-500 group-hover:text-red-400 transition-colors"
              strokeWidth={3}
            />
          </Button>

          <Button
            onClick={onLike}
            size="lg"
            className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-md border-4 border-green-400/50 hover:border-green-400 hover:bg-green-500/20 shadow-2xl transition-all duration-300 group"
          >
            <Heart
              className="w-20 h-20 text-green-500 group-hover:text-green-400 transition-colors fill-current"
              strokeWidth={3}
            />
          </Button>
        </div>
      </div>
    </OptimizedBackground>
  );
};
