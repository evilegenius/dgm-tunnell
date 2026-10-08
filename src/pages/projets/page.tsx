import PageHeader from "@/components/feature/PageHeader";
import ProjectsGrid from "./components/ProjectsGrid";

export default function Projects() {
  return (
    <>
      <PageHeader
        eyebrow="Projets"
        title="Ce que je construis, en vrai"
        description="Des outils réels, pensés et développés de bout en bout — de l'automatisation au panel d'administration."
      />
      <ProjectsGrid />
    </>
  );
}