/**
 * Performance optimization utilities
 */

// Debounce function to reduce excessive function calls
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttle function to limit function calls
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// Intersection Observer for lazy loading
export const createIntersectionObserver = (
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit,
) => {
  if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
    return null;
  }

  return new IntersectionObserver(callback, {
    threshold: 0.1,
    rootMargin: "50px",
    ...options,
  });
};

// Optimize images with lazy loading and WebP support
export const optimizeImageSrc = (
  src: string,
  width?: number,
  height?: number,
) => {
  if (typeof window === "undefined") return src;

  // Check for WebP support
  const supportsWebP =
    document
      .createElement("canvas")
      .toDataURL("image/webp")
      .indexOf("data:image/webp") === 0;

  // Add size parameters if provided
  let optimizedSrc = src;
  if (width || height) {
    const separator = src.includes("?") ? "&" : "?";
    optimizedSrc += `${separator}w=${width || "auto"}&h=${height || "auto"}`;
  }

  // Add WebP format if supported
  if (supportsWebP && !src.includes("format=")) {
    const separator = optimizedSrc.includes("?") ? "&" : "?";
    optimizedSrc += `${separator}format=webp`;
  }

  return optimizedSrc;
};

// Preload critical resources
export const preloadResource = (href: string, as: string, type?: string) => {
  if (typeof document === "undefined") return;

  const link = document.createElement("link");
  link.rel = "preload";
  link.href = href;
  link.as = as;
  if (type) link.type = type;

  document.head.appendChild(link);
};

// Memory management - cleanup function
export const cleanup = (callbacks: (() => void)[]) => {
  return () => {
    callbacks.forEach((callback) => {
      try {
        callback();
      } catch (error) {
        console.warn("Cleanup callback failed:", error);
      }
    });
  };
};

// Simple cache implementation
export class SimpleCache<T> {
  private cache = new Map<string, { value: T; timestamp: number }>();
  private ttl: number;

  constructor(ttlMinutes = 5) {
    this.ttl = ttlMinutes * 60 * 1000; // Convert to milliseconds
  }

  set(key: string, value: T): void {
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
    });
  }

  get(key: string): T | null {
    const cached = this.cache.get(key);
    if (!cached) return null;

    if (Date.now() - cached.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.value;
  }

  clear(): void {
    this.cache.clear();
  }
}

// Reduce animation on devices with limited performance
export const shouldReduceMotion = (): boolean => {
  if (typeof window === "undefined") return false;

  return (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    window.navigator.hardwareConcurrency <= 2 ||
    (window.navigator as any).connection?.effectiveType === "2g"
  );
};

// Detect if device has limited performance
export const isLowEndDevice = (): boolean => {
  if (typeof window === "undefined") return false;

  // Check available cores
  if (window.navigator.hardwareConcurrency <= 2) return true;

  // Check memory (if available)
  if (
    (window.navigator as any).deviceMemory &&
    (window.navigator as any).deviceMemory <= 2
  )
    return true;

  // Check connection speed
  const connection = (window.navigator as any).connection;
  if (connection) {
    return (
      connection.effectiveType === "2g" ||
      connection.effectiveType === "slow-2g"
    );
  }

  return false;
};

// Optimize component rendering based on device capabilities
export const getOptimizationLevel = (): "low" | "medium" | "high" => {
  if (isLowEndDevice()) return "low";
  if (shouldReduceMotion()) return "medium";
  return "high";
};
