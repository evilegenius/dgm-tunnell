import PageHeader from "@/components/feature/PageHeader";
import CoursesGrid from "./components/CoursesGrid";
import FaqSection from "./components/FaqSection";

export default function Formations() {
  return (
    <>
      <PageHeader
        eyebrow="Formations"
        title="Des parcours pour passer de zéro à opérationnel"
        description="Programmation, web, bots, panels, mobile, cybersécurité, Linux… Choisis ton parcours, filtre par catégorie et découvre le programme complet de chaque formation."
      />
      <CoursesGrid />
      <FaqSection />
    </>
  );
}