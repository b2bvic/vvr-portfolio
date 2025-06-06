"use client";

import clsx from "clsx";
import { motion } from "framer-motion";
import { useRef, useState } from "react";

interface MagneticButtonProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  disabled?: boolean;
  onClick?: () => void;
  href?: string;
  target?: string;
}

export const MagneticButton: React.FC<MagneticButtonProps> = ({
  children,
  className,
  strength = 20,
  disabled = false,
  onClick,
  href,
  target,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current!.getBoundingClientRect();
    const x = clientX - (left + width / 2);
    const y = clientY - (top + height / 2);

    setPosition({
      x: x * (strength / 100),
      y: y * (strength / 100),
    });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  const handleClick = () => {
    if (disabled) return;
    if (href) {
      window.open(href, target || "_self");
    }
    onClick?.();
  };

  const buttonVariants = {
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
  };

  const Component = href ? "a" : "button";

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
      className="inline-block cursor-pointer"
    >
      <motion.div
        variants={buttonVariants}
        whileHover={!disabled ? "hover" : undefined}
        whileTap={!disabled ? "tap" : undefined}
        onClick={handleClick}
        className={clsx(
          "relative overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-4 text-white font-semibold shadow-lg transition-all duration-300",
          "before:absolute before:inset-0 before:bg-gradient-to-r before:from-blue-700 before:to-purple-700 before:opacity-0 before:transition-opacity before:duration-300",
          "hover:before:opacity-100 hover:shadow-xl",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
      >
        <span className="relative z-10">{children}</span>
      </motion.div>
    </motion.div>
  );
}; 