"use client";

// Renderuje przyklejony pasek nawigacji z identyfikacją portfolio i linkami do profili zewnętrznych.
import { faHexagonNodes } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { motion } from "motion/react";
import FaWrapper from "@/components/ui/FaWrapper";
import Appear from "@/components/ui/Appear";

import { LINKS } from "@/lib/constants";
import StaggerReveal, { childVariants } from "@/components/ui/StaggerReveal";

export default function NavBar() {
  return (
    <Appear
      delay={0.3}
      className="sticky top-0 z-50 w-full border-b border-app-mid-dark bg-app-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-2 text-app-foreground">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-app-main">
            <FaWrapper icon={faHexagonNodes} size={18} />
          </div>

          <h1 className="text-lg font-extrabold tracking-tight max-sm:hidden">
            Frontend Portfolio<span className="text-app-main"> Website</span>.
          </h1>
        </div>

        <StaggerReveal delay={0.5} className="flex items-center gap-2">
          {LINKS.map((link) => (
            <motion.div
                key={link.href}
                variants={childVariants}
                className="flex items-center justify-center transition-colors hover:text-app-foreground"
            >
              <Link
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                title={link.title}
                className="p-2.5"
              >
                <FaWrapper icon={link.icon} size={22} />
              </Link>
            </motion.div>
          ))}
        </StaggerReveal>
      </div>
    </Appear>
  );
}
