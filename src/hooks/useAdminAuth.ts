import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase, ADMIN_EMAIL } from "@/lib/supabase";

interface AdminAuthState {
  loading: boolean;
  session: Session | null;
  isAdmin: boolean;
}

export function useAdminAuth(): AdminAuthState {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (!active) return;
        setSession(data.session ?? null);
      })
      .catch(() => {
        if (active) setSession(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession ?? null);
    });

    return () => {
      active = false;
      subscription.subscription.unsubscribe();
    };
  }, []);

  const isAdmin = !!session?.user?.email && session.user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();

  return { loading, session, isAdmin };
}