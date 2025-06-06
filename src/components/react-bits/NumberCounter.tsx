"use client";

import clsx from "clsx";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

interface NumberCounterProps {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
  decimals?: number;
  label?: string;
  labelClassName?: string;
}

export const NumberCounter: React.FC<NumberCounterProps> = ({
  from = 0,
  to,
  duration = 2,
  className,
  suffix = "",
  prefix = "",
  decimals = 0,
  label,
  labelClassName,
}) => {
  const [count, setCount] = useState(from);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    const startTime = Date.now();
    const endTime = startTime + duration * 1000;

    const updateCounter = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      
      // Easing function (ease-out)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentCount = from + (to - from) * easeOut;
      
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCount(to);
      }
    };

    requestAnimationFrame(updateCounter);
  }, [isInView, from, to, duration]);

  const formatNumber = (num: number) => {
    if (decimals === 0) {
      return Math.floor(num).toLocaleString();
    }
    return num.toFixed(decimals);
  };

  return (
    <div ref={ref} className={clsx("text-center", className)}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="font-bold text-4xl md:text-5xl"
      >
        {prefix}
        {formatNumber(count)}
        {suffix}
      </motion.div>
      {label && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={clsx("mt-2 text-sm text-gray-600", labelClassName)}
        >
          {label}
        </motion.div>
      )}
    </div>
  );
}; 