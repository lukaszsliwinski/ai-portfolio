import Image from "next/image";
import ButtonAnchor from "../ui/ButtonAnchor";
import { faCode, faLink } from "@fortawesome/free-solid-svg-icons";

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
    <div className="grid grid-cols-5 max-w-5xl rounded-3xl border bg-app-background/70 border-app-mid-dark p-12 gap-20">
      <div className="col-span-2">
        <Laptop screenSrc={screenSrc} />
        <div className="flex justify-around mx-2 mt-5">
          <ButtonAnchor href={codeLink} label="Code" icon={faCode} />
          <ButtonAnchor href={liveLink} label="Link" icon={faLink} />
        </div>

      </div>
      <div className="col-span-3 flex-1 flex flex-col items-start justify-center gap-6 w-full">
        <h3 className="text-2xl font-extrabold text-app-foreground leading-tight">
          {name}
        </h3>

        <p className="leading-relaxed text-justify mb-4">
          {description}
        </p>

      </div>
    </div>

  );
}