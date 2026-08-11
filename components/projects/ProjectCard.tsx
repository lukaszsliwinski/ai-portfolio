import Image from "next/image";
import ButtonAnchor from "../ui/ButtonAnchor";
import { faCodeMerge, faLink } from "@fortawesome/free-solid-svg-icons";

function Laptop() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-60 h-41 bg-[#2e2e35] p-3 rounded-t-md overflow-hidden">
        <Image
          src="/images/placeholder.png"
          alt="Project screenshot"
          width={600}
          height={400}
        />
      </div>
      <div className="w-75 h-4.5 bg-[#373740] [clip-path:polygon(10%_0%,90%_0%,100%_100%,0%_100%)]"></div>
      <div className="w-75 h-3 bg-[#2e2e35] rounded-b flex justify-center">
        <div className="w-10 h-1 rounded-b bg-[#26262c]"></div>
      </div>
    </div>
  );
}

export default function ProjectCard() {
  return (
    <div className="grid grid-cols-5 max-w-5xl rounded-3xl border bg-zinc-950/75 border-zinc-800/80 p-12 gap-20">
      <div className="col-span-2">
        <Laptop />
        <div className="flex justify-around mx-2 my-4">
          <ButtonAnchor href="https://github.com" label="CODE" icon={faCodeMerge} />
          <ButtonAnchor href="https://github.com" label="LINK" icon={faLink} />
        </div>

      </div>
      <div className="col-span-3 flex-1 flex flex-col items-start justify-center gap-6 w-full">
        <h3 className="text-2xl font-extrabold text-zinc-50 leading-tight">
        Consectetur Adipisci</h3>

        <p className="text-zinc-400 font-normal leading-relaxed text-justify mb-4">
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since 1966, when designers at Letraset and James Mosley, the librarian at St Bride Printing Library in London, took a 1914 Cicero translation and scrambled it to make dummy text for Letrasets Body Type sheets. It has survived not only many decades, but also the leap into electronic typesetting, remaining essentially unchanged.
        </p>

      </div>
    </div>

  );
}