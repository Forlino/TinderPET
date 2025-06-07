import { useState } from "react";
import { DailyLimitState } from "@/types/dailyLimit";
import { PremiumPlan } from "@/types/premium";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Crown,
  Clock,
  Zap,
  Gift,
  Star,
  Timer,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface OutOfPetsModalProps {
  dailyLimitState: DailyLimitState;
  onWatchAd: () => void;
  onGoToPremium: () => void;
  onRestart: () => void;
  likedPetsCount: number;
}

export const OutOfPetsModal = ({
  dailyLimitState,
  onWatchAd,
  onGoToPremium,
  onRestart,
  likedPetsCount,
}: OutOfPetsModalProps) => {
  const [isWatchingAd, setIsWatchingAd] = useState(false);

  const handleWatchAd = async () => {
    setIsWatchingAd(true);
    // Simulate ad watching time
    setTimeout(() => {
      setIsWatchingAd(false);
      onWatchAd();
    }, 3000);
  };

  const getRemainingAds = () => {
    return Math.max(0, 3 - dailyLimitState.currentLimit.adsWatched);
  };

  const canWatchMoreAds = getRemainingAds() > 0;

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-500 via-yellow-500 to-red-600 relative overflow-hidden flex items-center justify-center p-8">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400 rounded-full opacity-10 blur-3xl animate-pulse delay-500"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-2xl backdrop-blur-xl bg-white/10 rounded-3xl p-12 border border-white/20 shadow-2xl text-center"
      >
        {/* Success celebration */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
          className="text-8xl mb-6"
        >
          🎉
        </motion.div>

        <h2 className="text-5xl font-black text-white mb-6">
          ¡Has explorado todas las mascotas!
        </h2>

        <p className="text-2xl text-white/90 mb-8">
          Has dado "like" a {likedPetsCount} mascota
          {likedPetsCount !== 1 ? "s" : ""}
        </p>

        {/* Options based on daily limit state */}
        <div className="space-y-6">
          {canWatchMoreAds ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-2xl p-8"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <Gift className="w-8 h-8 text-green-400" />
                <h3 className="text-2xl font-bold text-white">
                  ¡Obtén 10 deslizadas más!
                </h3>
              </div>

              <p className="text-lg text-white/80 mb-6">
                Ve un anuncio de 30 segundos y obtén 10 deslizadas adicionales
              </p>

              <div className="flex items-center justify-center gap-2 mb-6">
                <Badge className="bg-green-500 text-white px-4 py-2 text-lg font-bold">
                  {getRemainingAds()} anuncios restantes hoy
                </Badge>
              </div>

              <AnimatePresence>
                {isWatchingAd ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-black/50 rounded-2xl p-8"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="text-6xl mb-4"
                    >
                      ⏳
                    </motion.div>
                    <p className="text-xl text-white">
                      Reproduciendo anuncio...
                    </p>
                    <div className="w-full bg-white/20 rounded-full h-2 mt-4">
                      <motion.div
                        className="bg-green-500 h-2 rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 3, ease: "linear" }}
                      />
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={handleWatchAd}
                      size="lg"
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold text-xl px-12 py-6 rounded-2xl shadow-2xl"
                    >
                      <Zap className="w-6 h-6 mr-3" />
                      Ver Anuncio (+10 deslizadas)
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-400/30 rounded-2xl p-8"
            >
              <div className="flex items-center justify-center gap-4 mb-4">
                <Timer className="w-8 h-8 text-orange-400" />
                <h3 className="text-2xl font-bold text-white">
                  Límite diario alcanzado
                </h3>
              </div>

              <p className="text-lg text-white/80 mb-6">
                Has agotado tus 3 anuncios diarios. Vuelve en{" "}
                {dailyLimitState.hoursUntilReset} horas para obtener más
                deslizadas gratis.
              </p>

              <div className="flex items-center justify-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-orange-400" />
                <span className="text-lg text-orange-300 font-bold">
                  Próximo reset: {dailyLimitState.hoursUntilReset} horas
                </span>
              </div>
            </motion.div>
          )}

          {/* Premium option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border border-yellow-400/30 rounded-2xl p-8"
          >
            <div className="flex items-center justify-center gap-4 mb-4">
              <Crown className="w-8 h-8 text-yellow-400" />
              <h3 className="text-2xl font-bold text-white">¡Hazte Premium!</h3>
            </div>

            <p className="text-lg text-white/80 mb-6">
              Deslizadas ilimitadas, sin anuncios y funciones exclusivas
            </p>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onGoToPremium}
                size="lg"
                className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-black font-black text-xl px-12 py-6 rounded-2xl shadow-2xl"
              >
                <Crown className="w-6 h-6 mr-3" />
                Ver Planes Premium
                <Sparkles className="w-6 h-6 ml-3" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Alternative actions */}
          <div className="flex gap-4 justify-center pt-6">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onRestart}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20 px-8 py-4 rounded-xl"
              >
                Ver favoritos
                <Heart className="w-5 h-5 ml-2" />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
