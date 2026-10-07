"use client";

// Steruje sekwencyjnym pojawianiem się animowanych dzieci i udostępnia wspólne warianty animacji.
import { type ReactNode } from "react";
import { motion, type Variants } from "motion/react";

interface StaggerRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const childVariants: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export default function StaggerReveal({
  children,
  className,
  delay = 0,
}: StaggerRevealProps) {
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        delayChildren: delay,
        staggerChildren: 0.08,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      {children}
    </motion.div>
  );
}
