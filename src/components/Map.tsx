import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getGeolocationErrorMessage,
  isGeolocationSupported,
  isSecureContext,
  getGeolocationOptions,
} from "@/utils/geolocation";
import { PetPointOfInterest, UserLocation } from "@/types/map";
import { mockPointsOfInterest } from "@/data/mapData";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Filter,
  Loader2,
  AlertCircle,
  Info,
  HelpCircle,
  Phone,
  Clock,
  Star,
  Heart,
  Shield,
} from "lucide-react";

interface MapState {
  userLocation: UserLocation | null;
  pointsOfInterest: PetPointOfInterest[];
  selectedPoint: PetPointOfInterest | null;
  isLoading: boolean;
  error: string | null;
}

interface MapProps {
  onBack: () => void;
}

export const Map = ({ onBack }: MapProps) => {
  const [mapState, setMapState] = useState<MapState>({
    userLocation: null,
    pointsOfInterest: mockPointsOfInterest,
    selectedPoint: null,
    isLoading: false,
    error: null,
  });

  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return Math.round(d * 10) / 10;
  };

  const getCurrentLocation = () => {
    setMapState((prev) => ({ ...prev, isLoading: true, error: null }));

    // Debug info
    console.log("Iniciando geolocalización...", {
      protocolo: location.protocol,
      geolocationDisponible: isGeolocationSupported(),
      contextoSeguro: isSecureContext(),
    });

    // Check if geolocation is available
    if (!isGeolocationSupported()) {
      const message =
        "Tu navegador no soporta geolocalización. Mostrando todas las ubicaciones disponibles.";
      console.error("Geolocalización no disponible");
      setMapState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
        pointsOfInterest: mockPointsOfInterest,
      }));
      return;
    }

    // Check if we're in a secure context
    if (!isSecureContext()) {
      const message =
        "La geolocalización requiere una conexión segura (HTTPS) en la mayoría de navegadores modernos. También funciona en localhost para desarrollo.";
      console.error("Protocolo inseguro detectado:", location.protocol);
      setMapState((prev) => ({
        ...prev,
        isLoading: false,
        error: message,
        pointsOfInterest: mockPointsOfInterest,
      }));
      return;
    }

    // Timeout adicional como fallback
    const timeoutId = setTimeout(() => {
      console.warn("⚠️ Timeout adicional de geolocalización activado");
      setMapState((prev) => ({
        ...prev,
        isLoading: false,
        error:
          "Se agotó el tiempo para obtener tu ubicación. Mostrando todas las ubicaciones disponibles.",
        pointsOfInterest: mockPointsOfInterest,
      }));
    }, 25000);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId);

        console.log("✅ Geolocalización exitosa:", {
          latitud: position.coords.latitude,
          longitud: position.coords.longitude,
          precisión: position.coords.accuracy + "m",
          timestamp: new Date(position.timestamp).toLocaleString(),
        });

        const userLocation: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };

        const pointsWithDistance = mockPointsOfInterest
          .map((point) => ({
            ...point,
            distance: calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              point.location.latitude,
              point.location.longitude,
            ),
          }))
          .sort((a, b) => (a.distance || 0) - (b.distance || 0));

        console.log(
          `📍 Encontrados ${pointsWithDistance.length} lugares. El más cercano está a ${pointsWithDistance[0]?.distance?.toFixed(1)}km`,
        );

        setMapState((prev) => ({
          ...prev,
          userLocation,
          pointsOfInterest: pointsWithDistance,
          isLoading: false,
          error: null,
        }));
      },
      (error) => {
        clearTimeout(timeoutId);

        // Enhanced error handling to prevent [object Object]
        let errorMessage;
        try {
          errorMessage = getGeolocationErrorMessage(error);
        } catch (e) {
          console.error("Error processing geolocation error:", e);
          errorMessage =
            "Error al obtener la ubicación. Mostrando todas las ubicaciones disponibles.";
        }

        console.error("❌ Error de geolocalización:", {
          código: error?.code || "N/A",
          mensaje: error?.message || "N/A",
          descripción: errorMessage,
          errorCompleto: error,
        });

        setMapState((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
          pointsOfInterest: mockPointsOfInterest,
        }));
      },
      getGeolocationOptions(),
    );
  };

  const filteredPoints = mapState.pointsOfInterest.filter(
    (point) => filter === "all" || point.type === filter,
  );

  const handlePointSelect = (point: PetPointOfInterest) => {
    setMapState((prev) => ({ ...prev, selectedPoint: point }));
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "shelter":
        return "🏠";
      case "vet":
        return "🏥";
      case "store":
        return "🛒";
      case "park":
        return "🌳";
      default:
        return "📍";
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "shelter":
        return "Refugio";
      case "vet":
        return "Veterinaria";
      case "store":
        return "Tienda";
      case "park":
        return "Parque";
      default:
        return type;
    }
  };

  // Safe error display function to prevent [object Object]
  const renderError = (error: string | null) => {
    if (!error) return null;

    // Ensure we always display a string, never [object Object]
    const safeError =
      typeof error === "string"
        ? error
        : "Error al obtener la ubicación. Mostrando todas las ubicaciones disponibles.";

    return safeError;
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-600 via-cyan-700 to-teal-800 relative overflow-hidden">
      {/* Static background - no animations */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full opacity-10 blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full opacity-10 blur-3xl"></div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-6 py-8">
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
              🗺️ Mapa de Mascotas
            </h1>
            <p className="text-xl text-white/80">
              Encuentra refugios, veterinarias y más cerca de ti
            </p>
          </div>
          <Button
            onClick={getCurrentLocation}
            disabled={mapState.isLoading}
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white border-0 shadow-xl"
          >
            {mapState.isLoading ? (
              <Loader2 className="w-6 h-6 mr-2 animate-spin" />
            ) : (
              <Navigation className="w-6 h-6 mr-2" />
            )}
            Mi ubicación
          </Button>
        </div>

        {/* Error message with safe rendering */}
        {mapState.error && (
          <div className="bg-orange-100 backdrop-blur-md text-orange-800 p-6 rounded-2xl mb-6 border border-orange-200 shadow-lg">
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 text-orange-900">
                  Problema con la ubicación
                </h3>
                <p className="mb-4 text-orange-700 whitespace-pre-line">
                  {renderError(mapState.error)}
                </p>
                <div className="flex gap-3">
                  <Button
                    onClick={getCurrentLocation}
                    disabled={mapState.isLoading}
                    size="sm"
                    className="bg-orange-500 text-white hover:bg-orange-600 rounded-xl shadow-md"
                  >
                    {mapState.isLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Navigation className="w-4 h-4 mr-2" />
                    )}
                    Reintentar
                  </Button>
                  <Button
                    onClick={() =>
                      setMapState((prev) => ({ ...prev, error: null }))
                    }
                    size="sm"
                    variant="outline"
                    className="bg-white text-orange-700 border-orange-300 hover:bg-orange-50 rounded-xl"
                  >
                    Continuar sin ubicación
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          {[
            { key: "all", label: "Todos", icon: "🗺️" },
            { key: "shelter", label: "Refugios", icon: "🏠" },
            { key: "vet", label: "Veterinarias", icon: "🏥" },
            { key: "store", label: "Tiendas", icon: "🛒" },
            { key: "park", label: "Parques", icon: "🌳" },
          ].map((filterOption) => (
            <Button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`${
                filter === filterOption.key
                  ? "bg-white text-blue-600 shadow-xl"
                  : "bg-white/20 text-white hover:bg-white/30 border border-white/30"
              } backdrop-blur-md rounded-xl transition-all duration-300`}
            >
              <span className="mr-2">{filterOption.icon}</span>
              {filterOption.label}
            </Button>
          ))}
        </div>

        {/* Points list */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPoints.map((point) => (
            <Card
              key={point.id}
              className="bg-white/10 backdrop-blur-lg border-white/20 shadow-xl cursor-pointer hover:bg-white/20 transition-all duration-300 overflow-hidden"
              onClick={() => handlePointSelect(point)}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{getTypeIcon(point.type)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-white">
                        {point.name}
                      </h3>
                      {point.distance && (
                        <Badge className="bg-blue-500 text-white">
                          {point.distance}km
                        </Badge>
                      )}
                    </div>

                    <p className="text-white/80 mb-3 line-clamp-2">
                      {point.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-white/70 text-sm">
                        <MapPin className="w-4 h-4" />
                        <span>{point.address}</span>
                      </div>

                      {point.phone && (
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                          <Phone className="w-4 h-4" />
                          <span>{point.phone}</span>
                        </div>
                      )}

                      {point.hours && (
                        <div className="flex items-center gap-2 text-white/70 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>{point.hours}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <Badge
                        className={`${
                          point.type === "shelter"
                            ? "bg-green-500"
                            : point.type === "vet"
                              ? "bg-red-500"
                              : point.type === "store"
                                ? "bg-purple-500"
                                : "bg-blue-500"
                        } text-white`}
                      >
                        {getTypeLabel(point.type)}
                      </Badge>

                      {point.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-white font-semibold">
                            {point.rating}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPoints.length === 0 && (
          <div className="text-center py-20">
            <div className="text-8xl mb-6">🔍</div>
            <h2 className="text-4xl font-bold text-white mb-4">
              No hay lugares de este tipo
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Intenta con otro filtro o revisa todos los lugares disponibles
            </p>
            <Button
              onClick={() => setFilter("all")}
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 font-bold shadow-xl"
            >
              Ver todos los lugares
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
