import PageHeader from "@/components/feature/PageHeader";
import AboutContent from "./components/AboutContent";

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="À propos"
        title="Qui est DGM ?"
        description="« Dieu Génie du Mal », autrement dit « celui qui demeure » — mon nom est une promesse. Voici mon parcours, mes valeurs et les technologies que je transmets."
      />
      <AboutContent />
    </>
  );
}