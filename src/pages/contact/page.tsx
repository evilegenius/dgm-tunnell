import PageHeader from "@/components/feature/PageHeader";
import ContactSection from "./components/ContactSection";
import NewsletterBanner from "./components/NewsletterBanner";

export default function Contact() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Discutons de ton projet ou de ta formation"
        description="Que ce soit pour un devis, une question ou une inscription, écris-moi. Je réponds généralement en moins de 24 heures."
      />
      <ContactSection />
      <NewsletterBanner />
    </>
  );
}