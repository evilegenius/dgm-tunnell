import PageHeader from "@/components/feature/PageHeader";
import SitesGrid from "./components/SitesGrid";
import SiteRequestForm from "./components/SiteRequestForm";
import SitesCta from "./components/SitesCta";

export default function SitesWeb() {
  return (
    <>
      <PageHeader
        eyebrow="Mes sites web"
        title="Les sites que je crée et que je gère"
        description="Mes propres plateformes et celles de mes clients — sites vitrines, boutiques en ligne et applications web, conçues sur mesure et mises en ligne."
      />
      <SitesGrid />
      <SiteRequestForm />
      <SitesCta />
    </>
  );
}