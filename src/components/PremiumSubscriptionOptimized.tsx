import { useState } from "react";
import { PremiumPlan } from "@/types/premium";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Crown,
  Check,
  Zap,
  Star,
  Heart,
  Eye,
  MessageCircle,
} from "lucide-react";
import { OptimizedBackground } from "./OptimizedBackground";

interface PremiumSubscriptionProps {
  onBack: () => void;
  onSubscribe: (plan: PremiumPlan) => void;
}

export const PremiumSubscription = ({
  onBack,
  onSubscribe,
}: PremiumSubscriptionProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string>("premium");

  const plans: PremiumPlan[] = [
    {
      id: "basic",
      name: "Basic",
      price: 9.99,
      duration: "monthly",
      features: [
        "50 likes adicionales por día",
        "Ver quién te dio like",
        "Soporte básico por email",
      ],
      color: "from-blue-500 to-cyan-600",
      popular: false,
    },
    {
      id: "premium",
      name: "Premium",
      price: 19.99,
      duration: "monthly",
      features: [
        "Likes ilimitados",
        "Ver quién te dio like",
        "Mensajes prioritarios",
        "Perfil destacado",
        "Filtros avanzados",
        "Soporte prioritario",
      ],
      color: "from-purple-500 to-pink-600",
      popular: true,
    },
    {
      id: "gold",
      name: "Gold",
      price: 29.99,
      duration: "monthly",
      features: [
        "Todo lo de Premium",
        "Boost semanal gratuito",
        "Acceso a eventos exclusivos",
        "Consultas veterinarias básicas",
        "Descuentos en tiendas de mascotas",
        "Soporte 24/7",
      ],
      color: "from-yellow-400 to-orange-500",
      popular: false,
    },
  ];

  const handleSubscribe = () => {
    const plan = plans.find((p) => p.id === selectedPlan);
    if (plan) {
      onSubscribe(plan);
    }
  };

  return (
    <OptimizedBackground variant="yellow" intensity="medium">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8">
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
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-black text-white mb-2">
              👑 PetMatch Premium
            </h1>
            <p className="text-xl text-white/80">
              Desbloquea todas las funciones para encontrar tu mascota perfecta
            </p>
          </div>
          <div></div>
        </div>

        {/* Benefits showcase */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl text-center">
            <CardContent className="p-6">
              <Heart className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2">Likes Ilimitados</h3>
              <p className="text-white/80 text-sm">
                Dale like a todas las mascotas que quieras
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl text-center">
            <CardContent className="p-6">
              <Eye className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2">Ver Likes</h3>
              <p className="text-white/80 text-sm">
                Descubre quién ya te dio like
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl text-center">
            <CardContent className="p-6">
              <MessageCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2">Chat Prioritario</h3>
              <p className="text-white/80 text-sm">
                Tus mensajes aparecen primero
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl text-center">
            <CardContent className="p-6">
              <Star className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-white font-bold mb-2">Perfil Destacado</h3>
              <p className="text-white/80 text-sm">
                Aparece en los primeros resultados
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative cursor-pointer transition-all duration-300 hover-scale ${
                selectedPlan === plan.id
                  ? "bg-white/20 border-white/40 shadow-2xl scale-105"
                  : "bg-white/10 border-white/20 hover:bg-white/15"
              } backdrop-blur-lg`}
              onClick={() => setSelectedPlan(plan.id)}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-pink-500 to-rose-600 text-white px-4 py-2 text-sm font-bold">
                    <Crown className="w-4 h-4 mr-1" />
                    Más Popular
                  </Badge>
                </div>
              )}

              <CardHeader className="text-center pb-4">
                <CardTitle className="text-2xl font-black text-white mb-2">
                  {plan.name}
                </CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-black text-white">
                    ${plan.price}
                  </span>
                  <span className="text-white/80">
                    /{plan.duration === "monthly" ? "mes" : "año"}
                  </span>
                </div>
                <div
                  className={`w-16 h-1 bg-gradient-to-r ${plan.color} mx-auto rounded-full`}
                ></div>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-white/90 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`w-full ${
                    selectedPlan === plan.id
                      ? `bg-gradient-to-r ${plan.color} text-white`
                      : "bg-white/10 text-white hover:bg-white/20 border border-white/30"
                  } font-bold py-6 text-lg shadow-xl`}
                >
                  {selectedPlan === plan.id ? "Seleccionado" : "Seleccionar"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Subscribe button */}
        <div className="text-center">
          <Button
            onClick={handleSubscribe}
            size="lg"
            className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-black font-black text-2xl px-16 py-8 rounded-2xl shadow-2xl"
          >
            <Zap className="w-8 h-8 mr-4" />
            Suscribirse a {plans.find((p) => p.id === selectedPlan)?.name}
          </Button>

          <p className="text-white/80 text-sm mt-4">
            Cancela en cualquier momento • Sin compromisos • Garantía de 7 días
          </p>
        </div>
      </div>
    </OptimizedBackground>
  );
};
