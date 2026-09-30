"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { faLaptopCode } from "@fortawesome/free-solid-svg-icons";
import { faGithubAlt } from "@fortawesome/free-brands-svg-icons";

import SectionHeader from "@/components/ui/SectionHeader";
import ButtonAnchor from "@/components/ui/ButtonAnchor";

import { LANDING_TEXT } from "@/lib/constants";
import { TECHNOLOGIES } from "@/lib/constants";
import Reveal from "@/components/ui/Reveal";
import StaggerReveal, { childVariants } from "@/components/ui/StaggerReveal";

interface TechBadgeProps {
  src: string;
  name: string;
}

function TechBadge({ src, name }: TechBadgeProps) {
  return (
    <div
      key={src}
      className="inline-flex items-center gap-1.5 rounded-sm border border-app-main/20 bg-app-main/10 px-3 py-1 text-xs font-semibold text-app-main select-none"
    >
      <Image src={src} width={14} height={14} alt="tech icon" />
      <span>{name}</span>
    </div>
  );
}

export default function Landing() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center overflow-hidden py-24">
      <div className="flex max-w-4xl items-center justify-between gap-12 max-lg:flex-col lg:gap-20 xl:max-w-6xl">
        <Reveal className="flex max-w-xl flex-1 flex-col gap-6">
          <Image
            className="mx-auto lg:hidden"
            src="/images/main.png"
            alt="bio photo"
            width={200}
            height={200}
          />
          <SectionHeader main="Lorem Ipsum" sub="lorem" subColored="ipsum" />
          <p>{LANDING_TEXT}</p>

          <div className="flex flex-col gap-3">
            <StaggerReveal
              delay={0.3}
              className="flex flex-wrap gap-2 max-lg:justify-center"
            >
              {TECHNOLOGIES.map((tech) => (
                <motion.div key={tech.name} variants={childVariants}>
                  <TechBadge src={tech.src} name={tech.name} />
                </motion.div>            
              ))}
            </StaggerReveal>
          </div>
        </Reveal>
        <Reveal className="flex max-w-xl flex-1 flex-col items-center justify-center gap-10">
          <Image
            className="max-lg:hidden"
            src="/images/main.png"
            alt="bio photo"
            width={250}
            height={250}
          />
          <StaggerReveal delay={1.2} className="flex flex-wrap justify-center gap-2">
            <motion.div variants={childVariants}>
              <ButtonAnchor
                href="#chat"
                label="Ask a question"
                icon={faGithubAlt}
              />
            </motion.div>
            <motion.div variants={childVariants}>
              <ButtonAnchor
                href="#projects"
                label="Go to projects"
                icon={faLaptopCode}
              />
            </motion.div>
          </StaggerReveal>
        </Reveal>
      </div>
    </section>
  );
}
