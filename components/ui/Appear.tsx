"use client";

// Zapewnia wielokrotnego użytku animację pojawienia się elementu przez zmianę przezroczystości po wejściu w viewport.
import type { ReactNode } from "react";
import { motion } from "motion/react";

interface AppearProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function Appear({
  children,
  className,
  delay = 0,
}: AppearProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{
        duration: 0.8,
        ease: "easeOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
