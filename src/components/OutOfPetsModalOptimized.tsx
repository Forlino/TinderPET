import { DailyLimitState } from "@/types/dailyLimit";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Crown,
  PlayCircle,
  RotateCcw,
  Heart,
  Clock,
  Zap,
  Gift,
} from "lucide-react";
import { OptimizedBackground } from "./OptimizedBackground";

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
  const canWatchAd = dailyLimitState.canWatchAd;
  const adsRemaining = 3 - dailyLimitState.currentLimit.adsWatched;

  return (
    <OptimizedBackground variant="yellow" intensity="medium">
      <div className="relative z-10 flex items-center justify-center min-h-screen p-6">
        <Card className="w-full max-w-2xl bg-white/10 backdrop-blur-lg border-white/20 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="text-8xl mb-6">😿</div>
            <CardTitle className="text-4xl font-black text-white mb-4">
              ¡Se acabaron las mascotas por hoy!
            </CardTitle>
            <p className="text-xl text-white/80">
              Pero no te preocupes, tienes varias opciones para continuar
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Stats */}
            <div className="text-center mb-8">
              <div className="bg-white/10 rounded-2xl p-6 border border-white/20">
                <div className="flex items-center justify-center gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-black text-white">
                      {likedPetsCount}
                    </div>
                    <p className="text-white/80 text-sm">
                      Mascotas que te gustaron
                    </p>
                  </div>
                  <div className="w-px h-16 bg-white/20"></div>
                  <div className="text-center">
                    <div className="text-3xl font-black text-white flex items-center justify-center gap-2">
                      <Clock className="w-8 h-8" />
                      {dailyLimitState.hoursUntilReset}h
                    </div>
                    <p className="text-white/80 text-sm">Para reiniciar</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Options */}
            <div className="space-y-4">
              {/* Premium option */}
              <Card className="bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-yellow-400/30 hover:from-yellow-400/30 hover:to-orange-500/30 transition-all duration-300 cursor-pointer hover-scale">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl">
                      <Crown className="w-8 h-8 text-black" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                        Hazte Premium
                        <Badge className="bg-gradient-to-r from-red-500 to-pink-600 text-white">
                          ¡RECOMENDADO!
                        </Badge>
                      </h3>
                      <p className="text-white/80 mb-3">
                        Likes ilimitados, ver quién te dio like y mucho más
                      </p>
                      <ul className="text-white/70 text-sm space-y-1">
                        <li>✨ Sin límites diarios</li>
                        <li>👀 Ver quién te dio like</li>
                        <li>⭐ Perfil destacado</li>
                      </ul>
                    </div>
                    <Button
                      onClick={onGoToPremium}
                      className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-black font-bold px-8 py-4 rounded-xl shadow-xl hover:scale-105 transition-transform"
                    >
                      <Zap className="w-5 h-5 mr-2" />
                      Ver Planes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Watch ad option */}
              {canWatchAd ? (
                <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer hover-scale">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
                        <PlayCircle className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                          Ver anuncio
                          <Badge className="bg-blue-500 text-white">
                            +10 likes
                          </Badge>
                        </h3>
                        <p className="text-white/80 mb-2">
                          Mira un anuncio corto y obtén 10 likes adicionales
                        </p>
                        <p className="text-white/60 text-sm">
                          Anuncios restantes hoy: {adsRemaining}
                        </p>
                      </div>
                      <Button
                        onClick={onWatchAd}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold px-8 py-4 rounded-xl shadow-xl hover:scale-105 transition-transform"
                      >
                        <Gift className="w-5 h-5 mr-2" />
                        Ver Anuncio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-gray-500/20 border-gray-400/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 opacity-50">
                      <div className="p-4 bg-gray-500 rounded-2xl">
                        <PlayCircle className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">
                          Ver anuncio
                        </h3>
                        <p className="text-white/80">
                          Ya viste todos los anuncios disponibles por hoy
                        </p>
                      </div>
                      <Button
                        disabled
                        className="bg-gray-500 text-white px-8 py-4 rounded-xl"
                      >
                        No disponible
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* View matches option */}
              <Card className="bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300 cursor-pointer hover-scale">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-4 bg-gradient-to-r from-pink-500 to-rose-600 rounded-2xl">
                      <Heart className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">
                        Ver tus favoritos
                      </h3>
                      <p className="text-white/80">
                        Revisa las {likedPetsCount} mascotas que te gustaron
                      </p>
                    </div>
                    <Button
                      onClick={onRestart}
                      className="bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold px-8 py-4 rounded-xl shadow-xl hover:scale-105 transition-transform"
                    >
                      <Heart className="w-5 h-5 mr-2" />
                      Ver Favoritos
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Reset timer */}
            <div className="text-center pt-6 border-t border-white/20">
              <p className="text-white/60 text-sm mb-2">
                Tu límite diario se reiniciará automáticamente en:
              </p>
              <div className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                <Clock className="w-6 h-6" />
                {dailyLimitState.hoursUntilReset} horas
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </OptimizedBackground>
  );
};
