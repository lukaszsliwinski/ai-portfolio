// Prezentuje pojedynczy projekt wraz z opisem, wizualizacją ekranu oraz linkami do kodu i wersji online.
import Image from "next/image";
import { faCode, faLink } from "@fortawesome/free-solid-svg-icons";

import ButtonAnchor from "@/components/ui/ButtonAnchor";
import SectionHeader from "@/components/ui/SectionHeader";
import Reveal from "@/components/ui/Reveal";

interface LaptopProps {
  screenSrc: string;
}

interface ProjectCardProps {
  name: string;
  description: string;
  codeLink: string;
  liveLink: string;
  screenSrc: string;
}

function Laptop({ screenSrc }: LaptopProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="h-41 w-60 overflow-hidden rounded-t-md bg-app-mid-light p-3">
        <Image
          src={screenSrc}
          alt="Project screenshot"
          width={600}
          height={400}
        />
      </div>
      <div className="h-4.5 w-75 bg-app-mid-dark [clip-path:polygon(10%_0%,90%_0%,100%_100%,0%_100%)]"></div>
      <div className="flex h-3 w-75 justify-center rounded-b bg-app-mid-light">
        <div className="h-1 w-10 rounded-b bg-app-mid-dark"></div>
      </div>
    </div>
  );
}

export default function ProjectCard({
  name,
  description,
  codeLink,
  liveLink,
  screenSrc,
}: ProjectCardProps) {
  return (
    <Reveal className="flex w-full max-w-xl flex-col-reverse gap-6 rounded-lg border border-app-mid-dark bg-app-background/70 px-5 py-8 sm:p-12 lg:grid lg:max-w-4xl lg:grid-cols-4 lg:gap-20 xl:max-w-5xl xl:grid-cols-5">
      <div className="col-span-2 flex flex-col-reverse justify-center gap-6 lg:flex-col lg:gap-4">
        <Laptop screenSrc={screenSrc} />
        <div className="mx-2 flex justify-center gap-2">
          <ButtonAnchor href={codeLink} label="Code" icon={faCode} />
          <ButtonAnchor href={liveLink} label="Link" icon={faLink} />
        </div>
      </div>

      <div className="col-span-2 flex flex-col gap-6 xl:col-span-3">
        <SectionHeader main={name} small={true} />
        <p>{description}</p>
      </div>
    </Reveal>
  );
}
