/**
 * Enhanced geolocation utilities with robust error handling
 */

export interface GeolocationError {
  code: number;
  message: string;
  type: "PERMISSION_DENIED" | "POSITION_UNAVAILABLE" | "TIMEOUT" | "UNKNOWN";
}

export const getGeolocationErrorMessage = (error: any): string => {
  const errorCodes = {
    1: "PERMISSION_DENIED",
    2: "POSITION_UNAVAILABLE",
    3: "TIMEOUT",
  };

  // Handle cases where error might not be a proper GeolocationPositionError
  const errorCode = error?.code ?? 0;
  const errorMessage = error?.message ?? "Error desconocido";
  const errorType =
    errorCodes[errorCode as keyof typeof errorCodes] || "UNKNOWN";

  console.log(
    `Código de error de geolocalización: ${errorCode} (${errorType}) - ${errorMessage}`,
  );

  switch (errorCode) {
    case 1: // PERMISSION_DENIED
      return `Acceso a la ubicación denegado. Para habilitar:
• Haz clic en el ícono de ubicación 📍 en la barra de direcciones
• Selecciona 'Permitir' cuando aparezca el mensaje
• Recarga la página después de cambiar los permisos`;

    case 2: // POSITION_UNAVAILABLE
      return `No se pudo determinar tu ubicación. Esto puede suceder por:
• Conexión GPS débil (intenta salir al exterior)
• Problemas de conectividad a internet
• Servicios de ubicación deshabilitados en el dispositivo`;

    case 3: // TIMEOUT
      return `Se agotó el tiempo para obtener tu ubicación. Esto puede deberse a:
• Señal GPS débil
• Dispositivo en interior sin acceso a GPS
• Intenta nuevamente en unos segundos`;

    default:
      // Handle any weird error formats that might cause [object Object]
      let fallbackMessage = "Error al obtener la ubicación";

      if (errorCode && errorCode !== 0) {
        fallbackMessage += ` (código ${errorCode})`;
      }

      if (
        errorMessage &&
        errorMessage !== "Error desconocido" &&
        typeof errorMessage === "string"
      ) {
        fallbackMessage += `: ${errorMessage}`;
      }

      fallbackMessage += ". Mostrando todas las ubicaciones disponibles.";

      return fallbackMessage;
  }
};

export const isGeolocationSupported = (): boolean => {
  return "geolocation" in navigator;
};

export const isSecureContext = (): boolean => {
  return location.protocol === "https:" || location.hostname === "localhost";
};

export const getGeolocationOptions = (): PositionOptions => {
  return {
    enableHighAccuracy: false, // false para mejor compatibilidad y velocidad
    timeout: 20000, // 20 segundos para dar más tiempo
    maximumAge: 300000, // 5 minutos - usa ubicación cacheada si está disponible
  };
};

export const safeStringify = (obj: any): string => {
  try {
    if (typeof obj === "string") return obj;
    if (obj === null || obj === undefined) return "null";
    if (typeof obj === "object") {
      return JSON.stringify(obj, null, 2);
    }
    return String(obj);
  } catch (error) {
    return "Error al convertir objeto a string";
  }
};
