import { useState } from "react";
import { PremiumPlan, premiumPlans, premiumFeatures } from "@/types/premium";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, Crown, Star, Zap, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface PremiumSubscriptionProps {
  onBack: () => void;
  onSubscribe: (plan: PremiumPlan) => void;
}

export const PremiumSubscription = ({
  onBack,
  onSubscribe,
}: PremiumSubscriptionProps) => {
  const [selectedPlan, setSelectedPlan] = useState<string>("quarter");

  const handleSubscribe = () => {
    const plan = premiumPlans.find((p) => p.id === selectedPlan);
    if (plan) {
      onSubscribe(plan);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-orange-500 via-yellow-500 to-red-600 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-pink-400 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-400 rounded-full opacity-10 blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <Button
            variant="ghost"
            size="lg"
            onClick={onBack}
            className="w-16 h-16 text-white hover:bg-white/20"
          >
            <ArrowLeft className="w-8 h-8" />
          </Button>
          <div className="text-center">
            <div className="flex items-center gap-3 justify-center mb-2">
              <Crown className="w-12 h-12 text-yellow-400" />
              <h1 className="text-5xl lg:text-6xl font-bold text-white">
                PetMatch Premium
              </h1>
              <Crown className="w-12 h-12 text-yellow-400" />
            </div>
            <p className="text-2xl text-white/80">
              Encuentra tu compañero perfecto más rápido
            </p>
          </div>
          <div className="w-16"></div>
        </div>

        {/* Premium Features Showcase */}
        <div className="max-w-6xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-white text-center mb-12">
            Funciones Exclusivas Premium
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {premiumFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-center border border-white/20"
              >
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {feature.title}
                </h3>
                <p className="text-lg text-white/80">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Pricing Plans */}
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-4">
            Elige Tu Plan Premium
          </h2>
          <p className="text-xl text-white/80 text-center mb-12">
            Cancela en cualquier momento
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {premiumPlans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "relative cursor-pointer transition-all duration-300",
                  plan.popular && "lg:scale-110 lg:-mt-8",
                )}
                onClick={() => setSelectedPlan(plan.id)}
              >
                <Card
                  className={cn(
                    "p-8 text-center relative overflow-hidden border-2 transition-all duration-300",
                    selectedPlan === plan.id
                      ? "border-yellow-400 bg-white shadow-2xl shadow-yellow-400/50"
                      : "border-white/30 bg-white/10 backdrop-blur-lg hover:bg-white/20",
                    plan.popular && "border-yellow-400",
                  )}
                >
                  {/* Popular badge */}
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-lg px-6 py-2 shadow-lg">
                        <Star className="w-4 h-4 mr-2" />
                        {plan.badge}
                      </Badge>
                    </div>
                  )}

                  {/* Plan header */}
                  <div className="mb-6">
                    <h3
                      className={cn(
                        "text-2xl lg:text-3xl font-bold mb-2",
                        selectedPlan === plan.id
                          ? "text-gray-900"
                          : "text-white",
                      )}
                    >
                      {plan.name}
                    </h3>
                    <div
                      className={cn(
                        "text-lg",
                        selectedPlan === plan.id
                          ? "text-gray-600"
                          : "text-white/80",
                      )}
                    >
                      {plan.duration}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="mb-8">
                    <div
                      className={cn(
                        "text-5xl lg:text-6xl font-bold mb-2",
                        selectedPlan === plan.id
                          ? "text-gray-900"
                          : "text-white",
                      )}
                    >
                      €{plan.price}
                    </div>
                    {plan.originalPrice && (
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className={cn(
                            "text-lg line-through",
                            selectedPlan === plan.id
                              ? "text-gray-500"
                              : "text-white/60",
                          )}
                        >
                          €{plan.originalPrice}
                        </span>
                        <Badge variant="destructive" className="text-sm">
                          -{plan.discount}%
                        </Badge>
                      </div>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <div
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <Check
                          className={cn(
                            "w-5 h-5 flex-shrink-0",
                            selectedPlan === plan.id
                              ? "text-green-500"
                              : "text-green-400",
                          )}
                        />
                        <span
                          className={cn(
                            "text-left text-lg",
                            selectedPlan === plan.id
                              ? "text-gray-700"
                              : "text-white/90",
                          )}
                        >
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Selection indicator */}
                  {selectedPlan === plan.id && (
                    <div className="absolute inset-0 border-4 border-yellow-400 rounded-lg pointer-events-none">
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-black" />
                      </div>
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Subscribe button */}
          <div className="text-center mt-16">
            <Button
              onClick={handleSubscribe}
              size="lg"
              className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-500 hover:via-orange-600 hover:to-red-600 text-black font-bold text-2xl px-16 py-8 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300"
            >
              <Crown className="w-8 h-8 mr-4" />
              Suscribirse a{" "}
              {premiumPlans.find((p) => p.id === selectedPlan)?.name}
              <Zap className="w-8 h-8 ml-4" />
            </Button>

            <div className="mt-8 text-center">
              <p className="text-white/80 text-lg mb-4">
                🔒 Pago seguro con encriptación SSL
              </p>
              <div className="flex justify-center items-center gap-8 text-white/60">
                <span>💳 Visa</span>
                <span>💳 Mastercard</span>
                <span>💳 PayPal</span>
                <span>📱 Apple Pay</span>
                <span>📱 Google Pay</span>
              </div>
            </div>
          </div>

          {/* Money back guarantee */}
          <div className="mt-16 text-center">
            <div className="bg-green-500/20 border border-green-400 rounded-2xl p-8 max-w-2xl mx-auto">
              <div className="text-6xl mb-4">💰</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Garantía de devolución
              </h3>
              <p className="text-lg text-white/80">
                Si no estás completamente satisfecho en los primeros 7 días, te
                devolvemos el 100% de tu dinero.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
