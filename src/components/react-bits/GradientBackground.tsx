"use client";

import clsx from "clsx";
import { motion } from "framer-motion";

interface GradientBackgroundProps {
  className?: string;
  animated?: boolean;
  gradientFrom?: string;
  gradientTo?: string;
  opacity?: number;
  children?: React.ReactNode;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  className,
  animated = true,
  gradientFrom = "from-blue-600",
  gradientTo = "to-purple-600",
  opacity = 0.1,
  children,
}) => {
  const gradientVariants = {
    animate: {
      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
    },
  };

  return (
    <div className={clsx("relative overflow-hidden", className)}>
      <motion.div
        className={clsx(
          "absolute inset-0 bg-gradient-to-r",
          gradientFrom,
          gradientTo,
          `opacity-${Math.round(opacity * 100)}`
        )}
        style={{
          backgroundSize: animated ? "400% 400%" : "100% 100%",
          opacity: opacity,
        }}
        variants={gradientVariants}
        animate={animated ? "animate" : undefined}
        transition={{
          duration: 15,
          ease: "linear",
          repeat: Infinity,
        }}
      />
      
      {/* Overlay pattern for texture */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
          backgroundSize: "20px 20px",
        }}
      />
      
      <div className="relative z-10">{children}</div>
    </div>
  );
}; 