"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

interface HoverCardProps {
  children: React.ReactNode;
  className?: string;
  rotationStrength?: number;
  glowEffect?: boolean;
}

export const HoverCard: React.FC<HoverCardProps> = ({
  children,
  className,
  rotationStrength = 10,
  glowEffect = true,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -rotationStrength;
    const rotateY = ((x - centerX) / centerX) * rotationStrength;

    setMousePosition({ x: rotateX, y: rotateY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: mousePosition.x,
        rotateY: mousePosition.y,
        scale: isHovered ? 1.02 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className={clsx(
        "relative transform-gpu perspective-1000",
        "rounded-xl border border-gray-200 bg-white p-6 shadow-lg",
        "transition-shadow duration-300",
        glowEffect && isHovered && "shadow-2xl",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
      }}
    >
      {glowEffect && (
        <motion.div
          className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0"
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{
            duration: 0.3,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}; 