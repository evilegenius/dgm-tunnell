import InstallAppButton from "@/components/feature/InstallAppButton";

interface InstallGuideScreenProps {
  onBack: () => void;
}

const STEPS = [
  {
    title: "Télécharge l'application",
    text: "Ouvre la page de téléchargement et installe DGM TUNNEL. Si un fichier APK est disponible, tu peux l'installer directement sur Android.",
    icon: "ri-download-2-line",
  },
  {
    title: "Ouvre l'application",
    text: "Depuis ton écran d'accueil ou ton navigateur, lance DGM TUNNEL. L'application s'ouvre en plein écran, comme une vraie appli.",
    icon: "ri-smartphone-line",
  },
  {
    title: "Saisis ton jeton",
    text: "Sur l'écran de connexion, entre le jeton qui t'a été fourni. Il est mémorisé pour te reconnecter automatiquement la prochaine fois.",
    icon: "ri-key-2-line",
  },
  {
    title: "Choisis un serveur",
    text: "Dans l'onglet Serveurs, sélectionne un pays et une configuration, puis appuie sur « Utiliser » pour l'activer.",
    icon: "ri-server-line",
  },
  {
    title: "Connecte-toi",
    text: "Reviens sur l'écran Accueil et appuie sur le bouton CONNECTER. L'IP, le ping, la durée et ton débit s'affichent en direct.",
    icon: "ri-link",
  },
];

export default function InstallGuideScreen({ onBack }: InstallGuideScreenProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 whitespace-nowrap rounded-lg border border-[#f7cfe3] px-3.5 py-2 font-mono text-[11px] uppercase tracking-wider text-[#9b6b86] transition-colors hover:border-[#e6007e]/50 hover:text-[#e6007e] cursor-pointer"
        >
          <i className="ri-arrow-left-line text-base" />
          Retour
        </button>
        <h2 className="flex items-center gap-2 font-heading text-base font-bold uppercase tracking-wider text-[#3a0a26]">
          <i className="ri-book-open-line text-base text-[#e6007e]" />
          Guide d'installation
        </h2>
      </div>

      <div className="rounded-xl border border-[#f7cfe3] bg-[#fff5fa] p-4">
        <p className="text-sm leading-relaxed text-[#6b3651]">
          En quelques étapes, installe DGM TUNNEL sur ton téléphone et commence à utiliser ton accès.
        </p>
        <InstallAppButton variant="primary" fullWidth className="mt-3" label="Installer sur mon téléphone" />
      </div>

      <ol className="space-y-3">
        {STEPS.map((step, index) => (
          <li key={step.title} className="flex items-start gap-3 rounded-xl border border-[#f7cfe3] bg-[#fff5fa] p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e6007e]/30 bg-[#e6007e]/10 text-[#e6007e]">
              <i className={`${step.icon} text-lg`} />
            </div>
            <div>
              <p className="flex items-center gap-2 font-heading text-sm font-bold text-[#3a0a26]">
                <span className="font-mono text-[#d63384]">{String(index + 1).padStart(2, "0")}</span>
                {step.title}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-[#8a5a76]">{step.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}