import type { ReactNode } from "react";

interface TunnelBackdropProps {
  children: ReactNode;
}

/**
 * Fond clair rose + colonne « téléphone » centrée (max 440px) qui contient
 * toute l'interface de l'application DGM TUNNEL.
 */
export default function TunnelBackdrop({ children }: TunnelBackdropProps) {
  return (
    <div className="relative min-h-[100dvh] w-full overscroll-none bg-[#ffffff] text-[#3a0a26]">
      <div
        className="pointer-events-none fixed inset-0"
        aria-hidden="true"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 6%, rgba(230,0,126,0.10), transparent 46%), radial-gradient(circle at 85% 94%, rgba(214,51,132,0.12), transparent 52%)",
        }}
      />
      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-[440px] flex-col border-[#f7cfe3] bg-[#ffffff] pb-[env(safe-area-inset-bottom)] lg:border-x">
        {children}
      </div>
    </div>
  );
}