import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppRelease } from "@/hooks/useAppRelease";
import { APP_VERSION_CODE, APP_VERSION_NAME } from "@/pages/tunnel/version";

interface SettingsScreenProps {
  onQuit: () => void;
  onOpenGuide: () => void;
  onOpenIpFinder: () => void;
  onOpenSubscription: () => void;
}

function PreferenceToggle({
  label,
  desc,
  icon,
  storageKey,
  defaultOn,
}: {
  label: string;
  desc: string;
  icon: string;
  storageKey: string;
  defaultOn: boolean;
}) {
  const [on, setOn] = useState(defaultOn);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey);
      if (stored !== null) setOn(stored === "true");
    } catch {
      // Ignoré.
    }
  }, [storageKey]);

  const toggle = () => {
    setOn((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(storageKey, String(next));
      } catch {
        // Ignoré.
      }
      return next;
    });
  };

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-[#f7cfe3] bg-[#fff5fa] px-4 py-3.5">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#f7cfe3] bg-black/5 text-[#6b3651]">
          <i className={icon} />
        </span>
        <div>
          <p className="font-heading text-sm font-semibold text-[#3a0a26]">{label}</p>
          <p className="font-mono text-[10px] text-[#b98aa6]">{desc}</p>
        </div>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={toggle}
        className={`relative h-6 w-11 shrink-0 rounded-full border transition-colors cursor-pointer ${
          on ? "border-[#e6007e]/60 bg-[#e6007e]/25" : "border-[#f7cfe3] bg-[#ffffff]"
        }`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full transition-all ${
            on ? "left-6 bg-[#e6007e]" : "left-0.5 bg-[#b98aa6]"
          }`}
        />
      </button>
    </div>
  );
}

function Preferences() {
  return (
    <div className="space-y-2.5">
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[#b98aa6]">
        <i className="ri-equalizer-2-line text-sm" />
        Préférences
      </p>
      <PreferenceToggle
        label="Reconnexion automatique"
        desc="Se reconnecte au lancement de l'application"
        icon="ri-restart-line"
        storageKey="dgm_tunnel_auto_reconnect"
        defaultOn
      />
      <PreferenceToggle
        label="Mode économie de batterie"
        desc="Réduit l'activité en arrière-plan"
        icon="ri-battery-charge-line"
        storageKey="dgm_tunnel_battery_saver"
        defaultOn={false}
      />
      <div className="flex items-center justify-between gap-3 rounded-xl border border-[#f7cfe3] bg-[#fff5fa] px-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#c026d3]/30 bg-[#c026d3]/10 text-[#d63384]">
            <i className="ri-moon-line" />
          </span>
          <div>
            <p className="font-heading text-sm font-semibold text-[#3a0a26]">Apparence</p>
            <p className="font-mono text-[10px] text-[#b98aa6]">Thème de l'application</p>
          </div>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9b6b86]">Clair</span>
      </div>
    </div>
  );
}

export default function SettingsScreen({
  onQuit,
  onOpenGuide,
  onOpenIpFinder,
  onOpenSubscription,
}: SettingsScreenProps) {
  const { release } = useAppRelease();
  const [checking, setChecking] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeTone, setNoticeTone] = useState<"ok" | "info">("info");

  const checkUpdate = () => {
    setChecking(true);
    setNotice("");
    window.setTimeout(() => {
      if (release && release.versionCode > APP_VERSION_CODE) {
        setNotice(`Nouvelle version ${release.versionName} disponible.`);
        setNoticeTone("info");
      } else {
        setNotice("Ton application est à jour.");
        setNoticeTone("ok");
      }
      setChecking(false);
    }, 900);
  };

  const shareApp = async () => {
    const url = `${window.location.origin}/download`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "DGM TUNNEL", text: "Découvre DGM TUNNEL.", url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setNotice("Lien de téléchargement copié.");
      setNoticeTone("ok");
    } catch {
      // Partage annulé ou indisponible.
    }
  };

  const rowClass =
    "flex w-full items-center justify-between gap-3 rounded-xl border border-[#f7cfe3] bg-[#fff5fa] px-4 py-3.5 text-left transition-colors cursor-pointer";
  const iconBox = "flex h-9 w-9 items-center justify-center rounded-lg border";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="flex items-center gap-2 font-heading text-base font-bold uppercase tracking-wider text-[#3a0a26]">
          <i className="ri-settings-3-line text-base text-[#e6007e]" />
          Paramètres
        </h2>
        <p className="mt-1 font-mono text-[11px] text-[#b98aa6]">Gère ton application et ton accès</p>
      </div>

      <div className="flex items-center gap-4 rounded-xl border border-[#f7cfe3] bg-[#fff5fa] p-4">
        <img
          src="https://readdy.ai/api/search-image?query=app%20icon%20with%20bold%20glowing%20neon%20letters%20DGM%20in%20cyan%20and%20violet%20on%20pure%20black%20background%2C%20centered%2C%20minimal%2C%20high%20contrast%2C%20clean%20sharp%20edges%2C%20square%20format%2C%20dark%20cyber%20tech%20aesthetic&width=192&height=192&seq=dgm-pwa-icon-192&orientation=squarish"
          alt="DGM TUNNEL"
          title="DGM TUNNEL"
          className="h-14 w-14 rounded-2xl border border-[#f7cfe3] object-cover"
        />
        <div>
          <p className="font-heading text-base font-bold text-[#3a0a26]">DGM TUNNEL</p>
          <p className="font-mono text-[11px] text-[#9b6b86]">
            Version {APP_VERSION_NAME} (build {APP_VERSION_CODE})
          </p>
          <p className="mt-1 flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#d63384]">
            <i className="ri-verified-badge-fill" />
            Officiel · Celui qui demeure
          </p>
        </div>
      </div>

      <div className="space-y-2.5">
        <button type="button" onClick={checkUpdate} disabled={checking} className={rowClass} style={{ cursor: "pointer" }}>
          <div className="flex items-center gap-3">
            <span className={`${iconBox} border-[#e6007e]/30 bg-[#e6007e]/10 text-[#e6007e]`}>
              {checking ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-refresh-line" />}
            </span>
            <div>
              <p className="font-heading text-sm font-semibold text-[#3a0a26]">Vérifier la mise à jour</p>
              <p className="font-mono text-[10px] text-[#b98aa6]">
                {release ? `Dernière en ligne : ${release.versionName}` : "Vérifie les nouvelles versions"}
              </p>
            </div>
          </div>
          <i className="ri-arrow-right-s-line text-lg text-[#b98aa6]" />
        </button>

        <button type="button" onClick={onOpenSubscription} className={rowClass} style={{ cursor: "pointer" }}>
          <div className="flex items-center gap-3">
            <span className={`${iconBox} border-[#c026d3]/30 bg-[#c026d3]/10 text-[#d63384]`}>
              <i className="ri-vip-crown-2-line" />
            </span>
            <div>
              <p className="font-heading text-sm font-semibold text-[#3a0a26]">Abonnement</p>
              <p className="font-mono text-[10px] text-[#b98aa6]">Jours restants et renouvellement</p>
            </div>
          </div>
          <i className="ri-arrow-right-s-line text-lg text-[#b98aa6]" />
        </button>

        <button type="button" onClick={onOpenGuide} className={rowClass} style={{ cursor: "pointer" }}>
          <div className="flex items-center gap-3">
            <span className={`${iconBox} border-[#16a34a]/30 bg-[#16a34a]/10 text-[#16a34a]`}>
              <i className="ri-book-open-line" />
            </span>
            <div>
              <p className="font-heading text-sm font-semibold text-[#3a0a26]">Guide d'installation</p>
              <p className="font-mono text-[10px] text-[#b98aa6]">Installer et connecter l'application</p>
            </div>
          </div>
          <i className="ri-arrow-right-s-line text-lg text-[#b98aa6]" />
        </button>

        <button type="button" onClick={onOpenIpFinder} className={rowClass} style={{ cursor: "pointer" }}>
          <div className="flex items-center gap-3">
            <span className={`${iconBox} border-[#d97706]/30 bg-[#d97706]/10 text-[#d97706]`}>
              <i className="ri-map-pin-user-line" />
            </span>
            <div>
              <p className="font-heading text-sm font-semibold text-[#3a0a26]">IP Finder</p>
              <p className="font-mono text-[10px] text-[#b98aa6]">Voir ton adresse IP publique</p>
            </div>
          </div>
          <i className="ri-arrow-right-s-line text-lg text-[#b98aa6]" />
        </button>

        <button type="button" onClick={shareApp} className={rowClass} style={{ cursor: "pointer" }}>
          <div className="flex items-center gap-3">
            <span className={`${iconBox} border-[#f7cfe3] bg-black/5 text-[#6b3651]`}>
              <i className="ri-share-line" />
            </span>
            <div>
              <p className="font-heading text-sm font-semibold text-[#3a0a26]">Partager l'application</p>
              <p className="font-mono text-[10px] text-[#b98aa6]">Fais découvrir DGM TUNNEL</p>
            </div>
          </div>
          <i className="ri-arrow-right-s-line text-lg text-[#b98aa6]" />
        </button>

        <a
          href="https://t.me/dgmtunnel"
          target="_blank"
          rel="noopener noreferrer"
          className={rowClass}
        >
          <div className="flex items-center gap-3">
            <span className={`${iconBox} border-[#e6007e]/30 bg-[#e6007e]/10 text-[#e6007e]`}>
              <i className="ri-telegram-line" />
            </span>
            <div>
              <p className="font-heading text-sm font-semibold text-[#3a0a26]">Canal Telegram officiel</p>
              <p className="font-mono text-[10px] text-[#b98aa6]">Annonces et nouvelle version</p>
            </div>
          </div>
          <i className="ri-arrow-right-s-line text-lg text-[#b98aa6]" />
        </a>

        <Link to="/contact" className={rowClass}>
          <div className="flex items-center gap-3">
            <span className={`${iconBox} border-[#f7cfe3] bg-black/5 text-[#6b3651]`}>
              <i className="ri-customer-service-2-line" />
            </span>
            <div>
              <p className="font-heading text-sm font-semibold text-[#3a0a26]">Contacter le support</p>
              <p className="font-mono text-[10px] text-[#b98aa6]">Une question, un souci d'accès ?</p>
            </div>
          </div>
          <i className="ri-arrow-right-s-line text-lg text-[#b98aa6]" />
        </Link>
      </div>

      <div className="flex items-center justify-between rounded-xl border border-[#f7cfe3] bg-[#fff5fa] px-4 py-3.5">
        <div className="flex items-center gap-3">
          <span className={`${iconBox} border-[#f7cfe3] bg-black/5 text-[#6b3651]`}>
            <i className="ri-translate-2" />
          </span>
          <p className="font-heading text-sm font-semibold text-[#3a0a26]">Langue</p>
        </div>
        <span className="font-mono text-[11px] uppercase tracking-wider text-[#9b6b86]">Français</span>
      </div>

      {notice ? (
        <p
          className={`flex items-center gap-2 rounded-lg border px-3.5 py-3 text-sm ${
            noticeTone === "ok"
              ? "border-[#16a34a]/40 bg-[#16a34a]/10 text-[#16a34a]"
              : "border-[#e6007e]/40 bg-[#e6007e]/10 text-[#e6007e]"
          }`}
        >
          <i className="ri-information-line text-base" />
          {notice}
        </p>
      ) : null}

      <Preferences />

      <button
        type="button"
        onClick={onQuit}
        className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-lg border border-[#ff5470]/40 bg-[#ff5470]/10 px-4 py-3.5 font-mono text-sm font-bold uppercase tracking-wider text-[#ff5470] transition-colors hover:bg-[#ff5470]/20 cursor-pointer"
      >
        <i className="ri-logout-box-r-line text-base" />
        Quitter
      </button>
    </div>
  );
}