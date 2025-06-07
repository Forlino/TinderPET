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

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center p-8 lg:p-12 bg-white/10 backdrop-blur-xl shadow-xl border-b border-white/20">
          <Button
            variant="ghost"
            size="lg"
            onClick={onBack}
            className="w-16 h-16 lg:w-20 lg:h-20 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-8 h-8 lg:w-10 lg:h-10" />
          </Button>
          <motion.h1
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl lg:text-5xl xl:text-6xl font-black text-white ml-6 drop-shadow-2xl"
          >
            ❤️ Mis Animales Favoritos
          </motion.h1>
        </div>

        <div className="p-8 lg:p-12">
          {likedPets.length === 0 ? (
            <div className="text-center py-32 lg:py-48">
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-xl rounded-3xl p-12 max-w-3xl mx-auto border border-white/20 shadow-2xl"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-[12rem] lg:text-[16rem] mb-12"
                >
                  💔
                </motion.div>
                <h2 className="text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-8 drop-shadow-2xl">
                  Aún no has dado "like" a ningún animal
                </h2>
                <p className="text-3xl lg:text-4xl xl:text-5xl text-white/90 mb-16">
                  ¡Empieza a explorar y encuentra tu compañero perfecto!
                </p>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={onBack}
                    className="bg-white/20 backdrop-blur-xl hover:bg-white/30 text-white text-2xl lg:text-3xl px-16 py-8 lg:px-20 lg:py-10 border border-white/30 rounded-2xl shadow-2xl"
                  >
                    Explorar mascotas
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-16 lg:mb-20"
              >
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 max-w-4xl mx-auto border border-white/20 shadow-2xl">
                  <h2 className="text-6xl lg:text-7xl xl:text-8xl font-black text-white mb-8 drop-shadow-2xl">
                    {likedPets.length} animal
                    {likedPets.length !== 1 ? "es" : ""} te{" "}
                    {likedPets.length !== 1 ? "han" : "ha"} conquistado
                  </h2>
                  <p className="text-3xl lg:text-4xl xl:text-5xl text-white/90">
                    ¡Estos son los animales que te han enamorado!
                  </p>
                </div>
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
                              duration: 2,
                              repeat: Infinity,
                              rotate: {
                                duration: 4,
                                repeat: Infinity,
                                ease: "linear",
                              },
                            }}
                            className="bg-gradient-to-r from-red-500 to-pink-600 text-white p-4 lg:p-5 rounded-full shadow-2xl backdrop-blur-md border border-white/30"
                          >
                            <Heart className="w-8 h-8 lg:w-10 lg:h-10 fill-current" />
                          </motion.div>
                        </div>
                      </div>

                      <div className="p-6 lg:p-8 text-white">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-2xl lg:text-3xl xl:text-4xl font-black drop-shadow-lg">
                            {pet.name}
                          </h3>
                          <span className="text-lg lg:text-xl text-white/80 capitalize bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                            {pet.age} {pet.age === 1 ? "año" : "años"}
                          </span>
                        </div>

                        <p className="text-lg lg:text-xl text-white/90 mb-4 font-medium">
                          {pet.breed}
                        </p>

                        <div className="flex items-center gap-2 text-base lg:text-lg text-white/80 mb-6">
                          <MapPin className="w-5 h-5 lg:w-6 lg:h-6 text-pink-300" />
                          <span>{pet.location}</span>
                        </div>

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            onClick={() => onViewProfile(pet)}
                            size="lg"
                            className="w-full bg-gradient-to-r from-pink-500 via-red-500 to-rose-600 hover:from-pink-600 hover:via-red-600 hover:to-rose-700 text-white text-lg lg:text-xl py-4 lg:py-6 font-black rounded-2xl shadow-2xl backdrop-blur-md border border-white/30"
                          >
                            Ver perfil completo
                          </Button>
                        </motion.div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
