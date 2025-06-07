/**
 * Optimized lightweight background component
 * Replaces heavy animated backgrounds with CSS-only optimized versions
 */

interface OptimizedBackgroundProps {
  variant?: "pink" | "purple" | "blue" | "green" | "yellow" | "gradient";
  intensity?: "low" | "medium" | "high";
  className?: string;
}

export const OptimizedBackground = ({
  variant = "gradient",
  intensity = "medium",
  className = "",
}: OptimizedBackgroundProps) => {
  const getBackgroundGradient = () => {
    switch (variant) {
      case "pink":
        return "from-rose-400 via-pink-500 to-purple-600";
      case "purple":
        return "from-purple-600 via-violet-700 to-indigo-800";
      case "blue":
        return "from-blue-600 via-cyan-700 to-teal-800";
      case "green":
        return "from-emerald-600 via-green-700 to-teal-800";
      case "yellow":
        return "from-yellow-400 via-orange-500 to-red-600";
      case "gradient":
      default:
        return "from-rose-400 via-pink-500 to-purple-600";
    }
  };

  const getIntensityClass = () => {
    switch (intensity) {
      case "low":
        return "opacity-10";
      case "medium":
        return "opacity-20";
      case "high":
        return "opacity-30";
      default:
        return "opacity-20";
    }
  };

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br ${getBackgroundGradient()} relative overflow-hidden ${className}`}
    >
      {/* Simplified static background elements - no animations */}
      <div className="absolute inset-0">
        <div
          className={`absolute top-20 left-20 w-64 h-64 bg-white rounded-full ${getIntensityClass()} blur-3xl`}
        ></div>
        <div
          className={`absolute bottom-20 right-20 w-80 h-80 bg-white rounded-full ${getIntensityClass()} blur-3xl`}
        ></div>
      </div>
    </div>
  );
};

// Even more lightweight version for low-end devices
export const MinimalBackground = ({
  variant = "gradient",
  className = "",
}: {
  variant?: OptimizedBackgroundProps["variant"];
  className?: string;
}) => {
  const getBackgroundGradient = () => {
    switch (variant) {
      case "pink":
        return "from-rose-400 to-purple-600";
      case "purple":
        return "from-purple-600 to-indigo-800";
      case "blue":
        return "from-blue-600 to-teal-800";
      case "green":
        return "from-emerald-600 to-teal-800";
      case "yellow":
        return "from-yellow-400 to-red-600";
      case "gradient":
      default:
        return "from-rose-400 to-purple-600";
    }
  };

  return (
    <div
      className={`min-h-screen w-full bg-gradient-to-br ${getBackgroundGradient()} ${className}`}
    />
  );
};
