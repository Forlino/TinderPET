import { useEffect, useState } from "react";
import { isLowEndDevice, shouldReduceMotion } from "@/utils/performance";

interface PerformanceStats {
  isLowEnd: boolean;
  reduceMotion: boolean;
  memoryUsage?: number;
  renderTime: number;
}

export const usePerformanceMonitor = () => {
  const [stats, setStats] = useState<PerformanceStats>({
    isLowEnd: false,
    reduceMotion: false,
    renderTime: 0,
  });

  useEffect(() => {
    const startTime = performance.now();

    // Check device capabilities
    const isLowEnd = isLowEndDevice();
    const reduceMotion = shouldReduceMotion();

    // Get memory usage if available
    let memoryUsage: number | undefined;
    if ("memory" in performance && (performance as any).memory) {
      memoryUsage = (performance as any).memory.usedJSHeapSize / 1024 / 1024; // MB
    }

    // Calculate render time
    const renderTime = performance.now() - startTime;

    setStats({
      isLowEnd,
      reduceMotion,
      memoryUsage,
      renderTime,
    });

    // Log performance warnings
    if (isLowEnd) {
      console.warn(
        "🐌 Low-end device detected. Consider reducing animations and effects.",
      );
    }
    if (memoryUsage && memoryUsage > 50) {
      console.warn(
        `💾 High memory usage detected: ${memoryUsage.toFixed(2)}MB`,
      );
    }
    if (renderTime > 16) {
      console.warn(`⏱️ Slow render detected: ${renderTime.toFixed(2)}ms`);
    }
  }, []);

  return stats;
};
