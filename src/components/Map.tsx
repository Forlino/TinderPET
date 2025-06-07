import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  MapPin,
  Navigation,
  Phone,
  Globe,
  Clock,
  Star,
  Heart,
  Shield,
  Users,
  Trees,
  ShoppingBag,
  Stethoscope,
  AlertCircle,
  Loader2,
  Info,
  HelpCircle,
  PawPrint,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PetPointOfInterest, UserLocation, MapState } from "@/types/map";
import { mockPointsOfInterest, calculateDistance } from "@/data/mapData";

interface MapProps {
  onBack: () => void;
}

const typeIcons = {
  veterinary: Stethoscope,
  shelter: Shield,
  meetup: Users,
  park: Trees,
  store: ShoppingBag,
};

const typeColors = {
  veterinary: "from-red-500 to-pink-600",
  shelter: "from-blue-500 to-purple-600",
  meetup: "from-green-500 to-emerald-600",
  park: "from-yellow-500 to-orange-600",
  store: "from-purple-500 to-indigo-600",
};

const typeLabels = {
  veterinary: "Veterinaria",
  shelter: "Refugio",
  meetup: "Encuentro",
  park: "Parque",
  store: "Tienda",
};

export const Map = ({ onBack }: MapProps) => {
  const [mapState, setMapState] = useState<MapState>({
    userLocation: null,
    pointsOfInterest: [],
    selectedPoint: null,
    isLoading: true,
    error: null,
  });

  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    getCurrentLocation();
  }, []);



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

    // Check if we're in a secure context (required for geolocation in many browsers)
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
    }

    // Timeout adicional como fallback
    const timeoutId = setTimeout(() => {
      console.warn("⚠️ Timeout adicional de geolocalización activado");
      setMapState((prev) => ({
        ...prev,
        isLoading: false,
        error: "Se agotó el tiempo para obtener tu ubicación. Mostrando todas las ubicaciones disponibles.",
        pointsOfInterest: mockPointsOfInterest,
      }));
    }, 25000); // 25 segundos como fallback total

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearTimeout(timeoutId); // Limpiar timeout si la geolocalización es exitosa

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

        // Calcular distancias y ordenar por proximidad
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
        clearTimeout(timeoutId); // Limpiar timeout si hay error

        // Ensure we have a proper error object
        const safeError = error || { code: 0, message: "Error desconocido" };
        const errorMessage = getGeolocationErrorMessage(safeError);

        console.error("❌ Error de geolocalización:", {
          código: safeError.code,
          mensaje: safeError.message,
          descripción: errorMessage,
          errorCompleto: error
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


    setTimeout(() => {
      if (mapState.isLoading) {
        console.warn(
          "⚠️ Timeout adicional alcanzado, mostrando ubicaciones sin geolocalización",
        );
        setMapState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            "La geolocalización está tomando demasiado tiempo. Mostrando todas las ubicaciones disponibles.",
          pointsOfInterest: mockPointsOfInterest,
        }));
      }
    }, 25000); // 25 segundos como fallback absoluto
  };

  const filteredPoints = mapState.pointsOfInterest.filter(
    (point) => filter === "all" || point.type === filter,
  );

  const handlePointSelect = (point: PetPointOfInterest) => {
    setMapState((prev) => ({ ...prev, selectedPoint: point }));
  };

  const openInMaps = (point: PetPointOfInterest) => {
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${point.location.latitude},${point.location.longitude}`;
    window.open(mapsUrl, "_blank");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-200 to-indigo-300 rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-200 to-pink-300 rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-indigo-200 to-blue-300 rounded-full opacity-8 blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Button
              onClick={onBack}
              variant="ghost"
              size="lg"
              className="bg-white/80 backdrop-blur-md text-gray-700 hover:bg-white/90 rounded-2xl shadow-lg border border-white/60"
            >
              <ArrowLeft className="w-6 h-6" />
            </Button>
            <div className="flex items-center gap-4">
              {/* Logo pequeño para Map */}
              <div className="relative w-12 h-12 lg:w-16 lg:h-16">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-rose-500 to-purple-600 rounded-2xl shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-2xl" />
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <PawPrint className="w-6 h-6 lg:w-8 lg:h-8 text-white fill-current drop-shadow-sm" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full shadow-sm flex items-center justify-center">
                  <MapPin className="w-2 h-2 text-white" />
                </div>
              </div>

              <div>
                <h1 className="text-4xl lg:text-5xl font-black text-gray-800 drop-shadow-sm">
                  Mapa Pet
                </h1>
                <p className="text-xl text-gray-600 mt-2">
                  Encuentra lugares para tu mascota cerca de ti
                </p>
              </div>
            </div>
          </div>

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={getCurrentLocation}
              disabled={mapState.isLoading}
              className="bg-white/80 backdrop-blur-md text-gray-700 hover:bg-white/90 rounded-2xl px-6 py-3 shadow-lg border border-white/60"
            >
              {mapState.isLoading ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <Navigation className="w-5 h-5 mr-2" />
              )}
              Mi ubicación
            </Button>
          </motion.div>
        </motion.div>

        {/* Error message */}
        {mapState.error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-orange-100 backdrop-blur-md text-orange-800 p-6 rounded-2xl mb-6 border border-orange-200 shadow-lg"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 text-orange-900">
                  Problema con la ubicación
                </h3>
                <p className="mb-4 text-orange-700 whitespace-pre-line">
                  {typeof mapState.error === 'string'
                    ? mapState.error
                    : 'Error al obtener la ubicación. Mostrando todas las ubicaciones disponibles.'
                  }
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
          </motion.div>
        )}

        {/* Geolocation help section */}
        {!mapState.userLocation && !mapState.isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-blue-50 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-blue-200 shadow-lg"
          >
            <div className="flex items-start gap-4">
              <Info className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  💡 ¿Cómo habilitar la ubicación?
                </h3>
                <div className="space-y-2 text-gray-700">
                  <p>
                    • <strong>Chrome/Edge:</strong> Haz clic en el ícono de
                    ubicación en la barra de direcciones
                  </p>
                  <p>
                    • <strong>Firefox:</strong> Haz clic en "Compartir
                    ubicación" cuando aparezca el mensaje
                  </p>
                  <p>
                    • <strong>Safari:</strong> Ve a Configuración → Privacidad →
                    Servicios de ubicación
                  </p>
                  <p>
                    • <strong>Móvil:</strong> Permite el acceso a la ubicación
                    en la configuración del navegador
                  </p>
                </div>
                <div className="mt-4 p-3 bg-blue-100 rounded-xl border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <HelpCircle className="w-4 h-4 inline mr-1" />
                    Tu ubicación se usa solo para mostrar lugares cercanos. No
                    se guarda ni se comparte.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Filter buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/70 backdrop-blur-2xl rounded-3xl p-4 mb-8 shadow-lg border border-white/40"
        >
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => setFilter("all")}
              className={cn(
                "rounded-2xl font-bold transition-all duration-300",
                filter === "all"
                  ? "bg-indigo-500 text-white shadow-lg"
                  : "bg-white/60 text-gray-700 hover:bg-white/80 shadow-sm",
              )}
            >
              <MapPin className="w-5 h-5 mr-2" />
              Todos
            </Button>
            {Object.entries(typeLabels).map(([type, label]) => {
              const Icon = typeIcons[type as keyof typeof typeIcons];
              return (
                <Button
                  key={type}
                  onClick={() => setFilter(type)}
                  className={cn(
                    "rounded-2xl font-bold transition-all duration-300",
                    filter === type
                      ? "bg-indigo-500 text-white shadow-lg"
                      : "bg-white/60 text-gray-700 hover:bg-white/80 shadow-sm",
                  )}
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {label}
                </Button>
              );
            })}
          </div>
        </motion.div>

        {/* Location stats */}
        {mapState.userLocation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 mb-8 border border-white/40 shadow-lg"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  📍 Tu ubicación detectada
                </h3>
                <p className="text-gray-700">
                  Encontramos {filteredPoints.length} lugares{" "}
                  {filter !== "all" &&
                    `de tipo ${typeLabels[filter as keyof typeof typeLabels]}`}{" "}
                  cerca de ti
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-gray-800">
                  {filteredPoints.length}
                </div>
                <div className="text-gray-600">lugares</div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Points of interest grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredPoints.map((point, index) => {
              const Icon = typeIcons[point.type];
              return (
                <motion.div
                  key={point.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className="bg-white/80 backdrop-blur-xl border-white/40 hover:bg-white/90 transition-all duration-300 overflow-hidden shadow-lg">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              "w-12 h-12 rounded-2xl bg-gradient-to-r flex items-center justify-center",
                              typeColors[point.type],
                            )}
                          >
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-gray-800 text-lg leading-tight">
                              {point.name}
                            </CardTitle>
                            <Badge
                              variant="secondary"
                              className="mt-1 bg-gray-100 text-gray-700 border-gray-300"
                            >
                              {typeLabels[point.type]}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {point.distance && (
                            <Badge className="bg-blue-500/20 text-blue-100 border-blue-400/30">
                              {point.distance.toFixed(1)} km
                            </Badge>
                          )}
                          <div
                            className={cn(
                              "w-3 h-3 rounded-full",
                              point.isOpen ? "bg-green-400" : "bg-red-400",
                            )}
                          />
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <CardDescription className="text-gray-600 text-sm">
                        {point.description}
                      </CardDescription>

                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-gray-800 font-medium">
                          {point.rating}
                        </span>
                        <span className="text-gray-600">
                          • {point.isOpen ? "Abierto" : "Cerrado"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="truncate">{point.address}</span>
                      </div>

                      {point.phone && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-4 h-4" />
                          <span>{point.phone}</span>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={() => openInMaps(point)}
                          size="sm"
                          className="flex-1 bg-indigo-500 text-white hover:bg-indigo-600 rounded-xl shadow-md"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Ir
                        </Button>

                        <Button
                          onClick={() => handlePointSelect(point)}
                          size="sm"
                          variant="outline"
                          className="bg-white text-indigo-600 border-indigo-300 hover:bg-indigo-50 rounded-xl"
                        >
                          <Clock className="w-4 h-4 mr-2" />
                          Info
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Selected point modal */}
        <AnimatePresence>
          {mapState.selectedPoint && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() =>
                setMapState((prev) => ({ ...prev, selectedPoint: null }))
              }
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white/90 backdrop-blur-2xl rounded-3xl p-8 max-w-md w-full border border-white/40 shadow-2xl"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className={cn(
                      "w-16 h-16 rounded-3xl bg-gradient-to-r flex items-center justify-center",
                      typeColors[mapState.selectedPoint.type],
                    )}
                  >
                    {React.createElement(
                      typeIcons[mapState.selectedPoint.type],
                      {
                        className: "w-8 h-8 text-white",
                      },
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {mapState.selectedPoint.name}
                    </h3>
                    <Badge className="mt-1 bg-gray-100 text-gray-700 border-gray-300">
                      {typeLabels[mapState.selectedPoint.type]}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-700">
                    {mapState.selectedPoint.description}
                  </p>

                  {mapState.selectedPoint.openHours && (
                    <div>
                      <h4 className="text-gray-800 font-bold mb-2">
                        Horarios:
                      </h4>
                      <div className="space-y-1">
                        {Object.entries(mapState.selectedPoint.openHours).map(
                          ([day, hours]) => (
                            <div
                              key={day}
                              className="flex justify-between text-sm text-gray-600"
                            >
                              <span>{day}:</span>
                              <span>{hours}</span>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={() => openInMaps(mapState.selectedPoint!)}
                      className="flex-1 bg-indigo-500 text-white hover:bg-indigo-600 rounded-2xl shadow-md"
                    >
                      <Navigation className="w-5 h-5 mr-2" />
                      Abrir en Maps
                    </Button>

                    {mapState.selectedPoint.website && (
                      <Button
                        onClick={() =>
                          window.open(mapState.selectedPoint!.website, "_blank")
                        }
                        variant="outline"
                        className="bg-white text-indigo-600 border-indigo-300 hover:bg-indigo-50 rounded-2xl"
                      >
                        <Globe className="w-5 h-5" />
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading state */}
        {mapState.isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 flex items-center justify-center"
          >
            <div className="bg-white/90 backdrop-blur-2xl rounded-3xl p-8 text-center border border-white/40 max-w-md mx-4 shadow-2xl">
              <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
              <h3 className="text-gray-800 text-xl font-bold mb-2">
                Obteniendo tu ubicación...
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Si tu navegador solicita permiso, por favor selecciona
                "Permitir"
              </p>
              <div className="flex items-center justify-center gap-2 text-gray-500 text-xs">
                <Clock className="w-4 h-4" />
                <span>Esto puede tomar unos segundos</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};