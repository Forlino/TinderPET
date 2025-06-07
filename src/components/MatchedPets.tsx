import { Pet, SwipeAction } from "@/types/pet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Heart, MapPin } from "lucide-react";
import { motion } from "framer-motion";

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
    .filter(Boolean) as Pet[];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-pink-600 via-red-500 to-rose-600 relative overflow-hidden">
      {/* Static background - no animations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full opacity-15 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full opacity-15 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-12"
        >
          <Button
            onClick={onBack}
            size="lg"
            className="bg-white/20 backdrop-blur-md hover:bg-white/30 text-white border border-white/30 shadow-xl"
          >
            <ArrowLeft className="w-6 h-6 mr-2" />
            Volver
          </Button>
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-black text-white mb-2 drop-shadow-2xl">
              💖 Favoritos
            </h1>
            <p className="text-xl text-white font-medium drop-shadow-lg">
              Las mascotas que han conquistado tu corazón
            </p>
          </div>
          <div className="w-24"></div>
        </motion.div>

        {/* Content */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {likedPets.length === 0 ? (
            /* Empty State */
            <div className="text-center py-16 lg:py-24">
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <div className="text-8xl lg:text-9xl mb-8">💔</div>
                <h2 className="text-4xl lg:text-6xl font-black text-white mb-6 drop-shadow-xl">
                  ¡Aún no tienes favoritos!
                </h2>
                <p className="text-2xl lg:text-3xl text-white font-medium mb-12 drop-shadow-lg">
                  ¡Empieza a dar like para encontrar tu compañero perfecto!
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={onBack}
                    size="lg"
                    className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-xl px-12 py-6 font-bold rounded-2xl shadow-2xl"
                  >
                    <Heart className="w-8 h-8 mr-3" />
                    Explorar mascotas
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          ) : (
            /* Pets Grid */
            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl lg:text-5xl font-black text-white mb-4 drop-shadow-xl">
                  Tus Favoritos ({likedPets.length})
                </h2>
                <p className="text-xl lg:text-2xl text-white font-medium drop-shadow-lg">
                  ¡Estos son los animales que te han enamorado!
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 lg:gap-12 max-w-none mx-auto">
                {likedPets.map((pet, index) => (
                  <motion.div
                    key={pet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -10 }}
                  >
                    <Card className="overflow-hidden cursor-pointer hover:shadow-2xl transition-all bg-white/20 backdrop-blur-xl rounded-3xl transform border border-white/30 shadow-xl">
                      <div
                        className="relative"
                        onClick={() => onViewProfile(pet)}
                      >
                        <img
                          src={pet.photos[0]}
                          alt={pet.name}
                          className="w-full h-80 lg:h-96 xl:h-[400px] object-cover transition-transform duration-500 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        <div className="absolute top-4 right-4">
                          <motion.div
                            animate={{
                              scale: [1, 1.2, 1],
                              rotate: [0, 360],
                            }}
                            transition={{
                              duration: 4,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 lg:p-5 rounded-full shadow-2xl backdrop-blur-md border border-white/30"
                          >
                            <Heart className="w-8 h-8 lg:w-10 lg:h-10 fill-current" />
                          </motion.div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
                          <h3 className="text-2xl lg:text-3xl font-black text-white mb-2 drop-shadow-xl">
                            {pet.name}
                          </h3>
                          <span className="text-lg lg:text-xl text-white font-medium capitalize bg-white/20 backdrop-blur-md px-3 py-1 rounded-full drop-shadow-lg">
                            {pet.breed}
                          </span>
                        </div>
                        <p className="text-lg lg:text-xl text-white mb-4 font-medium drop-shadow-md p-6">
                          {pet.description}
                        </p>

                        <div className="flex items-center gap-2 text-base lg:text-lg text-white mb-6 p-6">
                          <MapPin className="w-5 h-5 lg:w-6 lg:h-6" />
                          <span className="font-medium">{pet.location}</span>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Action button */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-16"
              >
                <Button
                  onClick={onBack}
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 hover:from-pink-600 hover:via-rose-600 hover:to-pink-700 text-white text-xl px-16 py-8 font-bold rounded-2xl shadow-2xl"
                >
                  <Heart className="w-10 h-10 mr-4" />
                  Seguir explorando
                </Button>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
