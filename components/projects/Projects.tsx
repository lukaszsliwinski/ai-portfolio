import ProjectCard from "./ProjectCard";

export default function Projects() {
  return (
    <section className="min-h-screen flex flex-col justify-center items-center gap-12 pb-16" id="projects">
      <ProjectCard />
      <ProjectCard />
      <ProjectCard />
    </section>
  );
}