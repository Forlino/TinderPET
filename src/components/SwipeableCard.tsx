import { motion, PanInfo, useMotionValue, useTransform } from "framer-motion";
import { ReactNode, useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface SwipeableCardProps {
  children: ReactNode;
  onSwipe: (direction: "left" | "right") => void;
  onTap?: () => void;
  className?: string;
}

export const SwipeableCard = ({
  children,
  onSwipe,
  onTap,
  className,
}: SwipeableCardProps) => {
  const [exitX, setExitX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const x = useMotionValue(0);
  const scale = useTransform(x, [-150, 0, 150], [0.5, 1, 0.5]);
  const rotate = useTransform(x, [-150, 0, 150], [-30, 0, 30], {
    clamp: false,
  });
  const dragStartTime = useRef<number>(0);

  const handleDragStart = () => {
    setIsDragging(true);
    dragStartTime.current = Date.now();
  };

  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;
    const dragDuration = Date.now() - dragStartTime.current;
    const dragDistance = Math.abs(offset);

    setIsDragging(false);

    // If it was a short tap (< 200ms) with minimal movement (< 10px), treat as tap
    if (dragDuration < 200 && dragDistance < 10 && onTap) {
      onTap();
      return;
    }

    // Otherwise, handle as swipe
    if (offset < -100 || velocity < -500) {
      setExitX(-1000);
      onSwipe("left");
    } else if (offset > 100 || velocity > 500) {
      setExitX(1000);
      onSwipe("right");
    }
  };

  return (
    <motion.div
      className={cn(
        "absolute cursor-pointer hover:cursor-pointer group",
        className,
      )}
      style={{
        x,
        scale,
        rotate,
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      initial={{ scale: 1, y: 0 }}
      animate={exitX ? { x: exitX } : { x: 0 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 1.2,
      }}
    >
      {children}

      {/* Swipe indicators */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          opacity: useTransform(x, [-150, -50, 0], [1, 0.5, 0]),
        }}
      >
        <div className="bg-red-500 text-white px-8 py-4 rounded-full font-bold text-2xl shadow-2xl transform -rotate-12 border-4 border-white">
          NOPE
        </div>
      </motion.div>

      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          opacity: useTransform(x, [0, 50, 150], [0, 0.5, 1]),
        }}
      >
        <div className="bg-green-500 text-white px-8 py-4 rounded-full font-bold text-2xl shadow-2xl transform rotate-12 border-4 border-white">
          LIKE
        </div>
      </motion.div>
    </motion.div>
  );
};
