import { Advertisement } from "@/types/ad";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Crown, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface AdCardProps {
  ad: Advertisement;
  className?: string;
}

export const AdCard = ({ ad, className }: AdCardProps) => {
  const handleClick = () => {
    if (ad.link.startsWith("http")) {
      window.open(ad.link, "_blank");
    } else {
      window.location.href = ad.link;
    }
  };

  const getAdTypeColor = () => {
    switch (ad.type) {
      case "premium":
        return "from-yellow-400 via-orange-500 to-red-500";
      case "product":
        return "from-blue-400 via-purple-500 to-pink-500";
      case "service":
        return "from-green-400 via-emerald-500 to-teal-500";
      case "app":
        return "from-indigo-400 via-purple-500 to-pink-500";
      default:
        return "from-gray-400 via-gray-500 to-gray-600";
    }
  };

  const getAdTypeIcon = () => {
    switch (ad.type) {
      case "premium":
        return <Crown className="w-6 h-6" />;
      case "product":
        return <Sparkles className="w-6 h-6" />;
      case "service":
        return <ExternalLink className="w-6 h-6" />;
      case "app":
        return <ExternalLink className="w-6 h-6" />;
      default:
        return <ExternalLink className="w-6 h-6" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-yellow-400/50",
        className,
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={ad.image}
          alt={ad.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* Ad Badge */}
      <div className="absolute top-6 left-6 z-10">
        <Badge className="bg-yellow-400 text-black font-black text-lg px-4 py-2 shadow-lg">
          <Sparkles className="w-5 h-5 mr-2" />
          PUBLICIDAD
        </Badge>
      </div>

      {/* Company Badge */}
      <div className="absolute top-6 right-6 z-10">
        <Badge
          className={cn(
            "text-white font-bold text-sm px-3 py-1 shadow-lg bg-gradient-to-r",
            getAdTypeColor(),
          )}
        >
          {ad.company}
        </Badge>
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-4xl lg:text-5xl font-black mb-4 text-shadow-lg">
            {ad.title}
          </h2>
          <p className="text-xl lg:text-2xl mb-8 text-white/90 leading-relaxed">
            {ad.description}
          </p>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={handleClick}
              size="lg"
              className={cn(
                "w-full text-white font-black text-2xl px-8 py-6 rounded-2xl shadow-2xl transform transition-all duration-300 bg-gradient-to-r",
                getAdTypeColor(),
                "hover:shadow-3xl hover:brightness-110",
              )}
            >
              {getAdTypeIcon()}
              <span className="ml-3">{ad.buttonText}</span>
            </Button>
          </motion.div>

          {/* Disclaimer */}
          <p className="text-center text-white/60 text-sm mt-4">
            Desliza para continuar viendo mascotas
          </p>
        </motion.div>
      </div>

      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl border-4 border-yellow-400"
        animate={{
          boxShadow: [
            "0 0 20px rgba(251, 191, 36, 0.5)",
            "0 0 30px rgba(251, 191, 36, 0.8)",
            "0 0 20px rgba(251, 191, 36, 0.5)",
          ],
        }}
        transition={{ duration: 2, repeat: Infinity }}
      />

      {/* Floating particles for premium ads */}
      {ad.type === "premium" && (
        <>
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 bg-yellow-400 rounded-full opacity-60"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2 + Math.random(),
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </>
      )}
    </motion.div>
  );
};
