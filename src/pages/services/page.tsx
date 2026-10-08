import PageHeader from "@/components/feature/PageHeader";
import ServicesGrid from "./components/ServicesGrid";

export default function Services() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="Confie-moi ton projet, je m'occupe du reste"
        description="Du cahier des charges à la mise en production, je réalise ton site, ton bot, ton application ou ta sécurité — avec un code propre, rapide et sécurisé."
      />
      <ServicesGrid />
    </>
  );
}