import { PremiumPlan } from "@/types/premium";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Crown, Check, Sparkles, Heart, Star } from "lucide-react";
import { motion } from "framer-motion";

interface PremiumSuccessProps {
  plan: PremiumPlan;
  onContinue: () => void;
}

export const PremiumSuccess = ({ plan, onContinue }: PremiumSuccessProps) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-purple-900 via-pink-900 to-red-900 flex items-center justify-center p-8 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400 rounded-full opacity-10 blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Confetti animation */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-yellow-400"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -500],
              rotate: [0, 360],
              opacity: [1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <Card className="bg-white/10 backdrop-blur-lg border border-white/30 p-12 text-center max-w-2xl">
          {/* Success animation */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="mb-8"
          >
            <div className="relative inline-block">
              <Crown className="w-32 h-32 text-yellow-400 mx-auto" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4"
              >
                <Sparkles className="w-12 h-12 text-yellow-300" />
              </motion.div>
            </div>
          </motion.div>

          {/* Success message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
              ¡Bienvenido a Premium!
            </h1>
            <p className="text-2xl text-yellow-400 mb-8">
              Tu suscripción a {plan.name} está activa
            </p>
          </motion.div>

          {/* Plan details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white/20 rounded-2xl p-6 mb-8"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <Star className="w-8 h-8 text-yellow-400" />
              <h3 className="text-2xl font-bold text-white">{plan.name}</h3>
              <Star className="w-8 h-8 text-yellow-400" />
            </div>
            <p className="text-lg text-white/80 mb-4">
              Duración: {plan.duration}
            </p>
            <p className="text-3xl font-bold text-yellow-400">€{plan.price}</p>
          </motion.div>

          {/* Premium features unlocked */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mb-8"
          >
            <h3 className="text-2xl font-bold text-white mb-6">
              Funciones Desbloqueadas:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              {plan.features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <Check className="w-6 h-6 text-green-400 flex-shrink-0" />
                  <span className="text-white text-lg">{feature}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Special premium message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8 }}
            className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-400/50 rounded-2xl p-6 mb-8"
          >
            <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
            <p className="text-xl text-white">
              ¡Ahora puedes encontrar a tu compañero perfecto más rápido que
              nunca!
            </p>
          </motion.div>

          {/* Continue button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.1 }}
          >
            <Button
              onClick={onContinue}
              size="lg"
              className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-black font-bold text-2xl px-12 py-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Crown className="w-8 h-8 mr-4" />
              ¡Empezar a Explorar Premium!
              <Sparkles className="w-8 h-8 ml-4" />
            </Button>
          </motion.div>

          {/* Footer message */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.4 }}
            className="text-white/60 text-lg mt-6"
          >
            Gracias por confiar en PetMatch Premium ❤️
          </motion.p>
        </Card>
      </motion.div>
    </div>
  );
};
