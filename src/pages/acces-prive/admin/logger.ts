import { supabase } from "@/lib/supabase";

export interface AdminLogEntry {
  message: string;
  tokenCode?: string | null;
}

/**
 * Enregistre une action de l'admin dans le journal.
 * Best-effort : une erreur de journalisation ne doit jamais bloquer l'action en cours.
 */
export async function logAdminAction(message: string, tokenCode: string | null = null): Promise<void> {
  try {
    await supabase.from("activity_log").insert({
      type: "admin",
      message,
      token_code: tokenCode,
      ip: null,
    });
  } catch {
    // Ignoré volontairement.
  }
}

export async function logAdminActions(entries: AdminLogEntry[]): Promise<void> {
  if (entries.length === 0) return;
  try {
    await supabase.from("activity_log").insert(
      entries.map((entry) => ({
        type: "admin",
        message: entry.message,
        token_code: entry.tokenCode ?? null,
        ip: null,
      }))
    );
  } catch {
    // Ignoré volontairement.
  }
}