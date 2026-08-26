import Image from "next/image";
import { faLaptopCode } from "@fortawesome/free-solid-svg-icons";
import { faGithubAlt } from "@fortawesome/free-brands-svg-icons";

import SectionHeader from "@/components/ui/SectionHeader";
import SectionParagraph from "@/components/ui/SectionParagraph";
import ButtonAnchor from "@/components/ui/ButtonAnchor";

import { LANDING_TEXT } from "@/lib/constants";
import { TECHNOLOGIES } from "@/lib/constants";


export default function Landing() {
  return (
    <section className="w-full min-h-screen py-24 flex flex-col items-center justify-center overflow-hidden">
      <div className="max-w-4xl xl:max-w-6xl flex max-lg:flex-col items-center justify-between gap-12 lg:gap-20">

        <div className="flex-1 flex flex-col gap-6 max-w-xl">
          
          <Image className="lg:hidden mx-auto" src="/images/main.png" alt="bio photo" width={200} height={200} />
          <SectionHeader main="Lorem Ipsum" sub="lorem" subColored="ipsum" />
          <SectionParagraph text={LANDING_TEXT} />

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2 max-lg:justify-center">
              {TECHNOLOGIES.map((tech) => (
                <div
                  key={tech.src}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-sm text-xs font-semibold select-none bg-app-main/10 text-app-main border border-app-main/20"
                >
                  <Image src={tech.src} width={14} height={14} alt="tech icon" />
                  <span>{tech.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>


        <div className="flex-1 flex flex-col items-center justify-center gap-10 max-w-xl">
          <Image className="max-lg:hidden" src="/images/main.png" alt="bio photo" width={250} height={250} />
          <div className="flex flex-wrap gap-2">
            <ButtonAnchor href="#chat" label="Ask a question" icon={faGithubAlt} />
            <ButtonAnchor href="#projects" label="Go to projects" icon={faLaptopCode} />
          </div>
        </div>

      </div>
    </section>
  );
}
