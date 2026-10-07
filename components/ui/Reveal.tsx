"use client";

// Zapewnia animację pojawienia się elementu, opcjonalnie z ruchem pionowym.
import type { ReactNode } from "react";
import { motion } from "motion/react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: "fade" | "slide";
}

export default function Reveal({
  children,
  className,
  delay = 0,
  variant = "slide",
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={variant === "fade" ? { opacity: 0 } : { opacity: 0, y: 20 }}
      whileInView={variant === "fade" ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -15% 0px" }}
      transition={{
        duration: variant === "fade" ? 0.8 : 0.5,
        ease: "easeOut",
        delay,
      }}
    >
      {children}
    </motion.div>
  );
}
