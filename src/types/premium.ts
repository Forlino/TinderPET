export interface PremiumPlan {
  id: string;
  name: string;
  duration: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  badge?: string;
  popular?: boolean;
  features: string[];
}

export interface PremiumFeature {
  title: string;
  description: string;
  icon: string;
}

export const premiumPlans: PremiumPlan[] = [
  {
    id: "week",
    name: "Semanal",
    duration: "1 semana",
    price: 9.99,
    features: [
      "Matches ilimitados",
      "Super likes diarios",
      "Ver quién te ha dado like",
      "Boost semanal",
      "Sin anuncios",
    ],
  },
  {
    id: "month",
    name: "Mensual",
    duration: "1 mes",
    price: 19.99,
    originalPrice: 29.99,
    discount: 33,
    features: [
      "Matches ilimitados",
      "5 super likes diarios",
      "Ver quién te ha dado like",
      "Boost semanal",
      "Sin anuncios",
      "Filtros avanzados",
    ],
  },
  {
    id: "quarter",
    name: "Trimestral",
    duration: "3 meses",
    price: 39.99,
    originalPrice: 59.97,
    discount: 33,
    badge: "MÁS POPULAR",
    popular: true,
    features: [
      "Matches ilimitados",
      "10 super likes diarios",
      "Ver quién te ha dado like",
      "2 boosts semanales",
      "Sin anuncios",
      "Filtros avanzados",
      "Chat prioritario",
      "Soporte premium",
    ],
  },
  {
    id: "half-year",
    name: "Semestral",
    duration: "6 meses",
    price: 69.99,
    originalPrice: 119.94,
    discount: 42,
    features: [
      "Matches ilimitados",
      "15 super likes diarios",
      "Ver quién te ha dado like",
      "3 boosts semanales",
      "Sin anuncios",
      "Filtros avanzados",
      "Chat prioritario",
      "Soporte premium",
      "Eventos exclusivos",
    ],
  },
  {
    id: "year",
    name: "Anual",
    duration: "12 meses",
    price: 99.99,
    originalPrice: 239.88,
    discount: 58,
    badge: "MEJOR VALOR",
    features: [
      "Matches ilimitados",
      "20 super likes diarios",
      "Ver quién te ha dado like",
      "Boosts ilimitados",
      "Sin anuncios",
      "Filtros avanzados",
      "Chat prioritario",
      "Soporte premium",
      "Eventos exclusivos",
      "Verificación premium",
      "Acceso beta",
    ],
  },
];

export const premiumFeatures: PremiumFeature[] = [
  {
    title: "Matches Ilimitados",
    description:
      "Sin límite de likes diarios. Dale like a todas las mascotas que te gusten.",
    icon: "❤️",
  },
  {
    title: "Super Likes",
    description:
      "Destaca entre otros usuarios con super likes que aumentan tus posibilidades.",
    icon: "⭐",
  },
  {
    title: "Ver Quién Te Gusta",
    description:
      "Descubre quién ya te ha dado like antes de decidir si hacer match.",
    icon: "👀",
  },
  {
    title: "Boost Semanal",
    description:
      "Haz que tu perfil sea visto por más personas durante 30 minutos.",
    icon: "🚀",
  },
  {
    title: "Filtros Avanzados",
    description:
      "Filtra por edad, tamaño, raza, ubicación y características específicas.",
    icon: "🔍",
  },
  {
    title: "Sin Anuncios",
    description:
      "Disfruta de una experiencia completamente libre de publicidad.",
    icon: "🚫",
  },
  {
    title: "Chat Prioritario",
    description: "Tus mensajes aparecen primero en la lista de conversaciones.",
    icon: "💬",
  },
  {
    title: "Soporte Premium",
    description:
      "Soporte prioritario 24/7 con tiempo de respuesta garantizado.",
    icon: "🛟",
  },
  {
    title: "Eventos Exclusivos",
    description:
      "Acceso a eventos y actividades exclusivas para miembros premium.",
    icon: "🎉",
  },
];
