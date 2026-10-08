import { useCallback, useEffect, useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "@/lib/supabase";
import { formatDateTime } from "@/pages/acces-prive/admin/utils";
import { logAdminAction } from "@/pages/acces-prive/admin/logger";
import Panel from "@/pages/acces-prive/admin/components/Panel";
import ConfirmDialog from "@/pages/acces-prive/admin/components/ConfirmDialog";
import { AdminInput, FieldLabel } from "@/pages/acces-prive/admin/components/inputs";

interface SessionInfo {
  email: string;
  userId: string;
  provider: string;
  createdAt: string;
  lastSignInAt: string;
  expiresAt: string;
}

export default function SecurityPage() {
  const [session, setSession] = useState<SessionInfo | null>(null);
  const [showSession, setShowSession] = useState(false);

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [pwMsg, setPwMsg] = useState("");
  const [pwErr, setPwErr] = useState("");
  const [busy, setBusy] = useState(false);

  const [confirmSignOut, setConfirmSignOut] = useState(false);

  const loadSession = useCallback(async () => {
    try {
      const [{ data: userData }, { data: sessionData }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.auth.getSession(),
      ]);
      const user = userData.user;
      if (!user) return;
      setSession({
        email: user.email ?? "—",
        userId: user.id,
        provider: user.app_metadata?.provider ?? "email",
        createdAt: user.created_at ?? "",
        lastSignInAt: user.last_sign_in_at ?? "",
        expiresAt: sessionData.session ? new Date(sessionData.session.expires_at! * 1000).toISOString() : "",
      });
    } catch {
      setSession(null);
    }
  }, []);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPwMsg("");
    setPwErr("");
    if (password.length < 8) {
      setPwErr("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirm) {
      setPwErr("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setBusy(true);
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      await logAdminAction("Mot de passe de l'admin modifié.");
      setPassword("");
      setConfirm("");
      setPwMsg("Mot de passe mis à jour avec succès.");
      await loadSession();
    } catch {
      setPwErr("La mise à jour du mot de passe a échoué. Réessaie.");
    } finally {
      setBusy(false);
    }
  };

  const signOutEverywhere = async () => {
    setBusy(true);
    try {
      await logAdminAction("Déconnexion globale de toutes les sessions.");
      await supabase.auth.signOut({ scope: "global" });
    } catch {
      setBusy(false);
      setConfirmSignOut(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-xl font-bold text-[#e8e8f0]">Sécurité</h2>
        <p className="mt-1 text-sm text-[#8b8b9e]">Gère ton mot de passe, ta session et tes connexions.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel title="Changer le mot de passe" icon="ri-lock-password-line">
          <form onSubmit={changePassword} className="space-y-4">
            <label className="block">
              <FieldLabel hint="8 caractères min.">Nouveau mot de passe</FieldLabel>
              <AdminInput
                type="password"
                value={password}
                autoComplete="new-password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </label>
            <label className="block">
              <FieldLabel>Confirme le mot de passe</FieldLabel>
              <AdminInput
                type="password"
                value={confirm}
                autoComplete="new-password"
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
              />
            </label>
            {pwErr ? (
              <div className="flex items-start gap-2 rounded-md border border-[#ff5470]/40 bg-[#ff5470]/10 px-3 py-2.5">
                <i className="ri-error-warning-line mt-0.5 text-base text-[#ff5470]" />
                <p className="text-xs text-[#ff5470]">{pwErr}</p>
              </div>
            ) : null}
            {pwMsg ? (
              <div className="flex items-start gap-2 rounded-md border border-[#34d399]/40 bg-[#34d399]/10 px-3 py-2.5">
                <i className="ri-check-line mt-0.5 text-base text-[#34d399]" />
                <p className="text-xs text-[#34d399]">{pwMsg}</p>
              </div>
            ) : null}
            <button
              type="submit"
              disabled={busy}
              className="flex w-full items-center justify-center gap-2 whitespace-nowrap rounded-md bg-[#00f0ff] px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#0a0a0f] transition-colors hover:bg-[#33f3ff] disabled:opacity-60 sm:w-auto cursor-pointer"
            >
              {busy ? <i className="ri-loader-4-line animate-spin" /> : <i className="ri-save-3-line" />}
              Mettre à jour
            </button>
          </form>
        </Panel>

        <div className="space-y-5">
          <Panel
            title="Session actuelle"
            icon="ri-user-received-line"
            action={
              <button
                type="button"
                onClick={() => setShowSession((value) => !value)}
                className="flex items-center gap-1.5 whitespace-nowrap rounded-md border border-[#232334] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[#8b8b9e] transition-colors hover:border-[#00f0ff]/50 hover:text-[#00f0ff] cursor-pointer"
              >
                <i className={showSession ? "ri-eye-off-line" : "ri-eye-line"} />
                {showSession ? "Masquer" : "Voir la session"}
              </button>
            }
          >
            {!session ? (
              <p className="text-sm text-[#8b8b9e]">Aucune session active détectée.</p>
            ) : (
              <dl className="space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-[#5a5a6e]">Email</dt>
                  <dd className="truncate text-sm text-[#e8e8f0]">{session.email}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-[#5a5a6e]">Connexion</dt>
                  <dd className="text-sm text-[#c7c7d6]">{formatDateTime(session.lastSignInAt)}</dd>
                </div>
                {showSession ? (
                  <>
                    <div className="flex flex-col gap-1 border-t border-[#232334] pt-2.5">
                      <dt className="font-mono text-[11px] uppercase tracking-wider text-[#5a5a6e]">Identifiant utilisateur</dt>
                      <dd className="break-all font-mono text-[11px] text-[#8b8b9e]">{session.userId}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="font-mono text-[11px] uppercase tracking-wider text-[#5a5a6e]">Fournisseur</dt>
                      <dd className="text-sm text-[#c7c7d6]">{session.provider}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="font-mono text-[11px] uppercase tracking-wider text-[#5a5a6e]">Compte créé le</dt>
                      <dd className="text-sm text-[#c7c7d6]">{formatDateTime(session.createdAt)}</dd>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                      <dt className="font-mono text-[11px] uppercase tracking-wider text-[#5a5a6e]">Expire le</dt>
                      <dd className="text-sm text-[#c7c7d6]">
                        {session.expiresAt ? formatDateTime(session.expiresAt) : "—"}
                      </dd>
                    </div>
                  </>
                ) : (
                  <p className="pt-1 text-[11px] text-[#5a5a6e]">Clique sur « Voir la session » pour les détails techniques.</p>
                )}
              </dl>
            )}
          </Panel>

          <Panel title="Déconnexion globale" icon="ri-logout-box-r-line">
            <p className="text-sm text-[#8b8b9e]">
              Ferme toutes les sessions actives sur tous tes appareils. Tu devras te reconnecter partout, y compris ici.
            </p>
            <button
              type="button"
              disabled={busy}
              onClick={() => setConfirmSignOut(true)}
              className="mt-4 flex items-center gap-2 whitespace-nowrap rounded-md border border-[#ff5470]/50 bg-[#ff5470]/15 px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-[#ff5470] transition-colors hover:bg-[#ff5470]/25 disabled:opacity-60 cursor-pointer"
            >
              <i className="ri-shut-down-line text-base" />
              Se déconnecter partout
            </button>
          </Panel>
        </div>
      </div>

      {confirmSignOut ? (
        <ConfirmDialog
          title="Déconnexion globale"
          message="Toutes tes sessions seront fermées immédiatement sur tous tes appareils. Continuer ?"
          confirmLabel="Se déconnecter"
          busy={busy}
          onCancel={() => setConfirmSignOut(false)}
          onConfirm={signOutEverywhere}
        />
      ) : null}
    </div>
  );
}