import { Pet } from "@/types/pet";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Heart, Users, Zap, Shield, Scissors, Eye } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PetCardProps {
  pet: Pet;
  className?: string;
}

export const PetCard = ({ pet, className }: PetCardProps) => {
  const getEnergyColor = (energy: Pet["energy"]) => {
    switch (energy) {
      case "low":
        return "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg border border-green-300/50";
      case "medium":
        return "bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg border border-yellow-300/50";
      case "high":
        return "bg-gradient-to-r from-red-400 to-pink-500 text-white shadow-lg border border-red-300/50";
    }
  };

  const getSizeColor = (size: Pet["size"]) => {
    switch (size) {
      case "small":
        return "bg-gradient-to-r from-blue-400 to-cyan-500 text-white shadow-lg border border-blue-300/50";
      case "medium":
        return "bg-gradient-to-r from-purple-400 to-violet-500 text-white shadow-lg border border-purple-300/50";
      case "large":
        return "bg-gradient-to-r from-orange-400 to-red-500 text-white shadow-lg border border-orange-300/50";
    }
  };

  return (
    <Card
      className={cn(
        "overflow-hidden bg-white shadow-2xl border-0 rounded-3xl relative group hover:shadow-3xl transition-all duration-300 cursor-pointer",
        className,
      )}
    >
      {/* Image container with gradient overlay */}
      <div className="relative overflow-hidden group-hover:scale-[1.02] transition-transform duration-300">
        <img
          src={pet.photos[0]}
          alt={pet.name}
          className="w-full h-[600px] lg:h-[700px] xl:h-[750px] object-cover transition-transform duration-500"
        />

        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent"></div>

        {/* Floating badges with glassmorphism */}
        <div className="absolute top-6 right-6 flex flex-col gap-3">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge
              className={cn(
                getSizeColor(pet.size),
                "text-lg px-5 py-2 backdrop-blur-md",
              )}
            >
              {pet.size === "small"
                ? "Pequeño"
                : pet.size === "medium"
                  ? "Mediano"
                  : "Grande"}
            </Badge>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Badge
              className={cn(
                getEnergyColor(pet.energy),
                "text-lg px-5 py-2 backdrop-blur-md flex items-center gap-2",
              )}
            >
              <Zap className="w-4 h-4" />
              {pet.energy === "low"
                ? "Tranquilo"
                : pet.energy === "medium"
                  ? "Activo"
                  : "Muy Activo"}
            </Badge>
          </motion.div>
        </div>

        {/* Age badge in top left */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-6 left-6"
        >
          <div className="bg-white/20 backdrop-blur-xl text-white px-6 py-3 rounded-2xl font-bold text-lg border border-white/30 shadow-xl">
            {pet.age} {pet.age === 1 ? "año" : "años"}
          </div>
        </motion.div>
      </div>

      {/* Content section with glassmorphism */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent backdrop-blur-md p-8 lg:p-10 text-white">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Name and breed */}
          <div className="flex items-end justify-between mb-4">
            <div>
              <h3 className="text-4xl lg:text-5xl xl:text-6xl font-black text-white drop-shadow-2xl mb-2">
                {pet.name}
              </h3>
              <p className="text-xl lg:text-2xl text-white/90 font-semibold">
                {pet.breed}
              </p>
            </div>
            <div className="text-right">
              <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-xl border border-white/30">
                <p className="text-lg lg:text-xl text-white/90 capitalize font-semibold">
                  {pet.gender === "male" ? "♂ Macho" : "♀ Hembra"}
                </p>
              </div>
            </div>
          </div>

          {/* Location */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-3 mb-6 text-xl lg:text-2xl text-white/90"
          >
            <MapPin className="w-6 h-6 lg:w-7 lg:h-7 text-pink-400" />
            <span className="font-medium">{pet.location}</span>
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg lg:text-xl text-white/90 mb-6 leading-relaxed font-medium"
          >
            {pet.description}
          </motion.p>

          {/* Personality traits */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-3 mb-6"
          >
            {pet.personality.slice(0, 3).map((trait, index) => (
              <motion.div
                key={trait}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Badge
                  variant="outline"
                  className="text-base lg:text-lg px-4 py-2 bg-white/20 backdrop-blur-md border-white/30 text-white hover:bg-white/30 transition-all duration-300"
                >
                  {trait}
                </Badge>
              </motion.div>
            ))}
          </motion.div>

          {/* Pet care info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex items-center justify-between text-base lg:text-lg mb-6"
          >
            <div className="flex items-center gap-6">
              {pet.vaccinated && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center gap-2 bg-green-500/20 backdrop-blur-md px-4 py-2 rounded-xl border border-green-400/30"
                >
                  <Shield className="w-5 h-5 lg:w-6 lg:h-6 text-green-400" />
                  <span className="text-green-300 font-semibold">Vacunado</span>
                </motion.div>
              )}
              {pet.neutered && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center gap-2 bg-blue-500/20 backdrop-blur-md px-4 py-2 rounded-xl border border-blue-400/30"
                >
                  <Scissors className="w-5 h-5 lg:w-6 lg:h-6 text-blue-400" />
                  <span className="text-blue-300 font-semibold">
                    Esterilizado
                  </span>
                </motion.div>
              )}
            </div>

            <div className="flex items-center gap-4">
              {pet.goodWithKids && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center gap-2 bg-purple-500/20 backdrop-blur-md px-4 py-2 rounded-xl border border-purple-400/30"
                >
                  <Users className="w-5 h-5 lg:w-6 lg:h-6 text-purple-400" />
                  <span className="text-purple-300 font-semibold">Niños</span>
                </motion.div>
              )}
              {pet.goodWithPets && (
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="flex items-center gap-2 bg-pink-500/20 backdrop-blur-md px-4 py-2 rounded-xl border border-pink-400/30"
                >
                  <Heart className="w-5 h-5 lg:w-6 lg:h-6 text-pink-400" />
                  <span className="text-pink-300 font-semibold">Animales</span>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Subtle sparkle effects */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full opacity-60"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </Card>
  );
};
