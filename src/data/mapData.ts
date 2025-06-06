import { PetPointOfInterest } from "@/types/map";

export const mockPointsOfInterest: PetPointOfInterest[] = [
  {
    id: "1",
    name: "Veterinaria San Isidro",
    type: "veterinary",
    location: { latitude: -34.4708, longitude: -58.5067 },
    address: "Av. del Libertador 16500, San Isidro",
    phone: "+54 11 4743-2000",
    website: "https://veterinariasanisidro.com",
    description:
      "Clínica veterinaria 24hs con servicio de emergencias y especialistas",
    rating: 4.8,
    isOpen: true,
    openHours: {
      Lunes: "24hs",
      Martes: "24hs",
      Miércoles: "24hs",
      Jueves: "24hs",
      Viernes: "24hs",
      Sábado: "24hs",
      Domingo: "24hs",
    },
  },
  {
    id: "2",
    name: "Refugio Patitas Felices",
    type: "shelter",
    location: { latitude: -34.56, longitude: -58.45 },
    address: "Av. Corrientes 1234, CABA",
    phone: "+54 11 4000-1234",
    website: "https://patitasfelices.org",
    description:
      "Refugio de perros y gatos abandonados. Adoptá y dale una segunda oportunidad",
    rating: 4.9,
    isOpen: true,
    openHours: {
      Lunes: "09:00 - 18:00",
      Martes: "09:00 - 18:00",
      Miércoles: "09:00 - 18:00",
      Jueves: "09:00 - 18:00",
      Viernes: "09:00 - 18:00",
      Sábado: "10:00 - 16:00",
      Domingo: "10:00 - 16:00",
    },
  },
  {
    id: "3",
    name: "Encuentro Canino Palermo",
    type: "meetup",
    location: { latitude: -34.5755, longitude: -58.4141 },
    address: "Parque Tres de Febrero, Palermo",
    description: "Encuentro de dueños de mascotas todos los sábados a las 16hs",
    rating: 4.6,
    isOpen: true,
    openHours: {
      Sábado: "16:00 - 18:00",
    },
  },
  {
    id: "4",
    name: "Parque de la Costa - Zona Pet",
    type: "park",
    location: { latitude: -34.42, longitude: -58.6 },
    address: "Tigre, Buenos Aires",
    description:
      "Área especial para mascotas con juegos y espacios de recreación",
    rating: 4.5,
    isOpen: true,
    openHours: {
      Lunes: "08:00 - 20:00",
      Martes: "08:00 - 20:00",
      Miércoles: "08:00 - 20:00",
      Jueves: "08:00 - 20:00",
      Viernes: "08:00 - 20:00",
      Sábado: "08:00 - 20:00",
      Domingo: "08:00 - 20:00",
    },
  },
  {
    id: "5",
    name: "Pet Shop Mascotas & Cia",
    type: "store",
    location: { latitude: -34.6037, longitude: -58.3816 },
    address: "Av. Santa Fe 2800, CABA",
    phone: "+54 11 4801-5555",
    description: "Todo para tu mascota: alimento, juguetes, accesorios y más",
    rating: 4.3,
    isOpen: true,
    openHours: {
      Lunes: "09:00 - 20:00",
      Martes: "09:00 - 20:00",
      Miércoles: "09:00 - 20:00",
      Jueves: "09:00 - 20:00",
      Viernes: "09:00 - 21:00",
      Sábado: "09:00 - 21:00",
      Domingo: "10:00 - 18:00",
    },
  },
  {
    id: "6",
    name: "Veterinaria Norte",
    type: "veterinary",
    location: { latitude: -34.54, longitude: -58.48 },
    address: "Av. Cabildo 3456, Belgrano",
    phone: "+54 11 4781-2345",
    description:
      "Atención veterinaria especializada con más de 20 años de experiencia",
    rating: 4.7,
    isOpen: false,
    openHours: {
      Lunes: "08:00 - 19:00",
      Martes: "08:00 - 19:00",
      Miércoles: "08:00 - 19:00",
      Jueves: "08:00 - 19:00",
      Viernes: "08:00 - 19:00",
      Sábado: "08:00 - 13:00",
      Domingo: "Cerrado",
    },
  },
  {
    id: "7",
    name: "Fundación Amigos de los Animales",
    type: "shelter",
    location: { latitude: -34.62, longitude: -58.39 },
    address: "Defensa 567, San Telmo",
    phone: "+54 11 4362-7890",
    website: "https://amigosanimales.org",
    description:
      "ONG dedicada al rescate y rehabilitación de animales en situación de calle",
    rating: 4.8,
    isOpen: true,
    openHours: {
      Lunes: "10:00 - 17:00",
      Martes: "10:00 - 17:00",
      Miércoles: "10:00 - 17:00",
      Jueves: "10:00 - 17:00",
      Viernes: "10:00 - 17:00",
      Sábado: "09:00 - 15:00",
      Domingo: "Cerrado",
    },
  },
  {
    id: "8",
    name: "Plaza Canina Villa Urquiza",
    type: "park",
    location: { latitude: -34.57, longitude: -58.47 },
    address: "Blvd. Triunvirato y Monroe, Villa Urquiza",
    description:
      "Espacio público especialmente diseñado para el esparcimiento de mascotas",
    rating: 4.4,
    isOpen: true,
    openHours: {
      Lunes: "06:00 - 22:00",
      Martes: "06:00 - 22:00",
      Miércoles: "06:00 - 22:00",
      Jueves: "06:00 - 22:00",
      Viernes: "06:00 - 22:00",
      Sábado: "06:00 - 22:00",
      Domingo: "06:00 - 22:00",
    },
  },
];

// Función para calcular distancia entre dos puntos geográficos
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
