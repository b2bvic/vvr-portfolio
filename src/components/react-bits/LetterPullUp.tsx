"use client";

import clsx from "clsx";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface LetterPullUpProps {
  text: string;
  className?: string;
  delay?: number;
  staggerDelay?: number;
}

export const LetterPullUp: React.FC<LetterPullUpProps> = ({
  text,
  className,
  delay = 0,
  staggerDelay = 0.05,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  const letters = text.split("");

  const pullUpVariants = {
    initial: {
      y: 100,
      opacity: 0,
    },
    animate: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: delay + i * staggerDelay,
        duration: 0.8,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    }),
  };

  return (
    <div ref={ref} className={clsx("overflow-hidden", className)}>
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={pullUpVariants}
          initial="initial"
          animate={isInView ? "animate" : "initial"}
          className="inline-block"
          style={{ display: letter === " " ? "inline" : "inline-block" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </div>
  );
}; 