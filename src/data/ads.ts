import { Advertisement } from "@/types/ad";

export const mockAds: Advertisement[] = [
  {
    id: "ad1",
    title: "🐕 PetFood Premium",
    description:
      "La mejor comida natural para tu mascota. ¡Prueba gratis la primera bolsa!",
    image:
      "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=600&fit=crop",
    buttonText: "Prueba Gratis",
    link: "https://petfood.com",
    company: "PetFood Premium",
    type: "product",
  },
  {
    id: "ad2",
    title: "🏥 Veterinaria 24h",
    description:
      "Atención veterinaria las 24 horas. Primera consulta online GRATIS.",
    image:
      "https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=400&h=600&fit=crop",
    buttonText: "Consulta Gratis",
    link: "https://vet24h.com",
    company: "VetCare 24h",
    type: "service",
  },
  {
    id: "ad3",
    title: "👑 PetMatch Premium",
    description:
      "Desbloquea funciones exclusivas: likes ilimitados, ver quién te dio like y más.",
    image:
      "https://images.unsplash.com/photo-1552053831-71594a27632d?w=400&h=600&fit=crop",
    buttonText: "Hazte Premium",
    link: "/premium",
    company: "PetMatch",
    type: "premium",
  },
  {
    id: "ad4",
    title: "🎾 Juguetes Divertidos",
    description:
      "Los mejores juguetes para mantener a tu mascota entretenida y feliz.",
    image:
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=600&fit=crop",
    buttonText: "Ver Catálogo",
    link: "https://pettoys.com",
    company: "PetToys",
    type: "product",
  },
  {
    id: "ad5",
    title: "🚿 Peluquería Canina",
    description:
      "Servicios de peluquería y spa para mascotas. ¡Tu perro se lo merece!",
    image:
      "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=400&h=600&fit=crop",
    buttonText: "Reservar Cita",
    link: "https://petgrooming.com",
    company: "Pet Spa",
    type: "service",
  },
  {
    id: "ad6",
    title: "📱 DogWalk App",
    description:
      "La app #1 para encontrar paseadores cerca de ti. Descarga gratis.",
    image:
      "https://images.unsplash.com/photo-1544654803-b69140b285a1?w=400&h=600&fit=crop",
    buttonText: "Descargar App",
    link: "https://dogwalk-app.com",
    company: "DogWalk",
    type: "app",
  },
];
