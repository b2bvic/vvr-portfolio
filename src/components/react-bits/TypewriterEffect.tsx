"use client";

import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TypewriterEffectProps {
  words: string[];
  className?: string;
  typeSpeed?: number;
  deleteSpeed?: number;
  delayBetweenWords?: number;
  cursorClassName?: string;
}

export const TypewriterEffect: React.FC<TypewriterEffectProps> = ({
  words,
  className,
  typeSpeed = 100,
  deleteSpeed = 50,
  delayBetweenWords = 2000,
  cursorClassName,
}) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];

    if (isWaiting) {
      const waitTimeout = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, delayBetweenWords);
      return () => clearTimeout(waitTimeout);
    }

    if (!isDeleting && currentText !== currentWord) {
      const typeTimeout = setTimeout(() => {
        setCurrentText(currentWord.substring(0, currentText.length + 1));
      }, typeSpeed);
      return () => clearTimeout(typeTimeout);
    }

    if (!isDeleting && currentText === currentWord) {
      setIsWaiting(true);
      return;
    }

    if (isDeleting && currentText !== "") {
      const deleteTimeout = setTimeout(() => {
        setCurrentText(currentWord.substring(0, currentText.length - 1));
      }, deleteSpeed);
      return () => clearTimeout(deleteTimeout);
    }

    if (isDeleting && currentText === "") {
      setIsDeleting(false);
      setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
    }
  }, [
    currentText,
    currentWordIndex,
    isDeleting,
    isWaiting,
    words,
    typeSpeed,
    deleteSpeed,
    delayBetweenWords,
  ]);

  return (
    <div className={clsx("flex items-center", className)}>
      <AnimatePresence mode="wait">
        <motion.span
          key={currentText}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.1 }}
        >
          {currentText}
        </motion.span>
      </AnimatePresence>
      <motion.span
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={clsx("ml-1", cursorClassName)}
      >
        |
      </motion.span>
    </div>
  );
}; 