import Image from "next/image";
import { faCode, faLink } from "@fortawesome/free-solid-svg-icons";

import ButtonAnchor from "@/components/ui/ButtonAnchor";
import SectionHeader from "@/components/ui/SectionHeader";
import SectionParagraph from "@/components/ui/SectionParagraph";

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
      <div className="w-60 h-41 bg-app-mid-light p-3 rounded-t-md overflow-hidden">
        <Image
          src={screenSrc}
          alt="Project screenshot"
          width={600}
          height={400}
        />
      </div>
      <div className="w-75 h-4.5 bg-app-mid-dark [clip-path:polygon(10%_0%,90%_0%,100%_100%,0%_100%)]"></div>
      <div className="w-75 h-3 bg-app-mid-light rounded-b flex justify-center">
        <div className="w-10 h-1 rounded-b bg-app-mid-dark"></div>
      </div>
    </div>
  );
}

export default function ProjectCard({ name, description, codeLink, liveLink, screenSrc }: ProjectCardProps) {
  return (
    <div className="w-full flex flex-col-reverse lg:grid lg:grid-cols-4 xl:grid-cols-5 max-w-xl lg:max-w-4xl xl:max-w-5xl rounded-3xl border bg-app-background/70 border-app-mid-dark px-5 py-8 sm:p-12 gap-6 lg:gap-20">
      <div className="col-span-2 flex flex-col-reverse lg:flex-col justify-center gap-6 lg:gap-4">
        <Laptop screenSrc={screenSrc} />
        <div className="flex justify-center gap-6 xl:justify-around mx-2">
          <ButtonAnchor href={codeLink} label="Code" icon={faCode} />
          <ButtonAnchor href={liveLink} label="Link" icon={faLink} />
        </div>
      </div>
      
      <div className="col-span-2 xl:col-span-3 flex flex-col gap-6">
        <SectionHeader main={name} small={true} />
        <SectionParagraph text={description} />
      </div>
    </div>

  );
}