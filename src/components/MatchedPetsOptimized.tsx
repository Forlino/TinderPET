import { Pet } from "@/types/pet";
import { SwipeAction } from "@/types/pet";
import { PetCard } from "./PetCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart } from "lucide-react";
import { OptimizedBackground } from "./OptimizedBackground";

interface MatchedPetsProps {
  likedActions: SwipeAction[];
  allPets: Pet[];
  onBack: () => void;
  onViewProfile: (pet: Pet) => void;
}

export const MatchedPets = ({
  likedActions,
  allPets,
  onBack,
  onViewProfile,
}: MatchedPetsProps) => {
  const likedPets = likedActions
    .map((action) => allPets.find((pet) => pet.id === action.petId))
    .filter((pet): pet is Pet => pet !== undefined);

  return (
    <OptimizedBackground variant="pink" intensity="medium">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8">
        {/* Simplified header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBack}
            size="lg"
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 shadow-xl"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Volver
          </Button>
          <h1 className="text-4xl lg:text-6xl font-black text-white">
            💖 Mis Favoritos
          </h1>
          <div></div>
        </div>

        {/* Content */}
        {likedPets.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">💔</div>
            <h2 className="text-4xl font-bold text-white mb-4">
              Aún no tienes favoritos
            </h2>
            <p className="text-xl text-white/80 mb-8">
              ¡Empieza a dar "like" a las mascotas que te gusten!
            </p>
            <Button
              onClick={onBack}
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-xl px-8 py-4 font-bold shadow-xl"
            >
              Explorar mascotas
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-12">
              <p className="text-2xl text-white/90">
                Has dado "like" a {likedPets.length} mascota
                {likedPets.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Grid of liked pets */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {likedPets.map((pet) => (
                <div
                  key={pet.id}
                  className="relative group cursor-pointer hover-scale"
                  onClick={() => onViewProfile(pet)}
                >
                  <div className="aspect-[3/4] bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                    <PetCard pet={pet} className="w-full h-full" />
                  </div>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <Heart className="w-12 h-12 mx-auto mb-4 text-red-400 fill-current" />
                      <p className="text-xl font-bold">Ver perfil</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action button */}
            <div className="text-center mt-16">
              <Button
                onClick={onBack}
                size="lg"
                className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 text-white text-xl px-12 py-6 font-bold rounded-2xl shadow-2xl"
              >
                Seguir explorando
              </Button>
            </div>
          </>
        )}
      </div>
    </OptimizedBackground>
  );
};
