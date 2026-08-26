import { faLaptopCode } from "@fortawesome/free-solid-svg-icons";
import { faGithubAlt } from "@fortawesome/free-brands-svg-icons";
import Image from "next/image";
import ButtonAnchor from "@/components/ui/ButtonAnchor";

import { TECHNOLOGIES } from "@/lib/constants";

export default function Landing() {
  return (
    <section className="relative w-full min-h-screen py-24 flex flex-col items-center justify-center overflow-hidden">
      <div className="w-full max-w-6xl px-4 flex items-center justify-between gap-20">

        <div className="flex-1 flex flex-col gap-6 max-w-xl">
          <h1 className="text-4xl font-extrabold text-app-foreground leading-tight">
            Lorem Ipsum<br />
            <small className="tracking-widest">consectetur <span className="text-app-main">adipisci</span></small>
          </h1>

          <p className="leading-relaxed text-justify">
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letrasets Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged.
          </p>

          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap gap-2">
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
          <Image src="/images/main.png" alt="bio photo" width={250} height={250} />
          <div className="flex flex-wrap gap-2">
            <ButtonAnchor href="#chat" label="Ask a question" icon={faGithubAlt} />
            <ButtonAnchor href="#projects" label="Go to projects" icon={faLaptopCode} />
          </div>
        </div>

      </div>
    </section>
  );
}
