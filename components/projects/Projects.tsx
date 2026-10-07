// Buduje sekcję projektów na podstawie danych konfiguracyjnych i komponentów kart projektu.
import ProjectCard from "./ProjectCard";
import { PROJECTS } from "@/lib/constants";

export default function Projects() {
  return (
    <section
      className="flex min-h-screen w-full flex-col items-center justify-center gap-12 pb-16"
      id="projects"
    >
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
