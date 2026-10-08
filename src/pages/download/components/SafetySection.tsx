const SAFETY_ITEMS = [
  {
    icon: "ri-shield-keyhole-line",
    title: "Jeton sécurisé",
    text: "L'accès se fait uniquement avec ton jeton personnel. Aucune donnée sensible n'est exposée sur l'appareil.",
  },
  {
    icon: "ri-lock-2-line",
    title: "Échanges protégés",
    text: "Les échanges avec le serveur sont chiffrés, afin de renforcer la confidentialité de ta connexion.",
  },
  {
    icon: "ri-eye-line",
    title: "État clair",
    text: "L'application affiche clairement tes jours restants, ta date d'expiration et l'état de ton accès.",
  },
  {
    icon: "ri-refresh-line",
    title: "Mises à jour",
    text: "Un bouton de mise à jour vérifie à tout moment que ton accès est toujours valide et à jour.",
  },
];

export default function SafetySection() {
  return (
    <section className="mt-10">
      <div className="mb-4">
        <h2 className="font-heading text-base font-bold uppercase tracking-wider text-[#e8e8f0] md:text-lg">
          Sécurité des données
        </h2>
        <p className="mt-1 text-sm text-[#8b8b9e]">Critères de sécurité de DGM TUNNEL</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SAFETY_ITEMS.map((item) => (
          <article key={item.title} className="flex items-start gap-3 rounded-xl border border-[#232334] bg-[#12121b] p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#00f0ff]/30 bg-[#00f0ff]/10 text-[#00f0ff]">
              <i className={`${item.icon} text-lg`} />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-[#e8e8f0]">{item.title}</h3>
              <p className="mt-1 text-[13px] leading-relaxed text-[#9a9aae]">{item.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}