import ProjectCard from "./ProjectCard";
import { PROJECTS } from "@/lib/constants";

export default function Projects() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center gap-12 pb-16" id="projects">
      {PROJECTS.map((project) => (
        <ProjectCard
          key={project.liveLink}
          name={project.name}
          description={project.description}
          codeLink={project.codeLink}
          liveLink={project.liveLink}
          screenSrc={project.screenSrc}
        />
      ))}
    </section>
  );
}