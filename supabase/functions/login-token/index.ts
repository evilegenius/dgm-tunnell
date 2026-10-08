import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MAX_INVALID_PER_MINUTE = 10;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!supabaseUrl || !serviceKey) {
    return json({ success: false, message: "Service momentanément indisponible." }, 500);
  }

  const admin = createClient(supabaseUrl, serviceKey);

  const ipHeader = req.headers.get("x-forwarded-for") ||
    req.headers.get("cf-connecting-ip") ||
    req.headers.get("x-real-ip") ||
    "";
  const ip = ipHeader.split(",")[0].trim() || "unknown";

  let body: Record<string, unknown> = {};
  try {
    body = await req.json();
  } catch (_error) {
    body = {};
  }

  const rawCode = typeof body?.token === "string"
    ? body.token
    : typeof body?.code === "string"
      ? body.code
      : "";
  const code = rawCode.trim().toUpperCase();
  const deviceId = typeof body?.device_id === "string" && body.device_id.trim()
    ? body.device_id.trim()
    : "unknown";

  // Limitation des essais : 10 jetons invalides par minute et par IP.
  const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
  const { count: invalidCount } = await admin
    .from("activity_log")
    .select("id", { count: "exact", head: true })
    .eq("type", "invalid")
    .eq("ip", ip)
    .gte("created_at", oneMinuteAgo);

  if ((invalidCount ?? 0) >= MAX_INVALID_PER_MINUTE) {
    return json({ success: false, message: "Trop de tentatives. Réessaie dans une minute." }, 429);
  }

  const logInvalid = async (message: string) => {
    await admin.from("activity_log").insert({
      type: "invalid",
      message,
      token_code: code || null,
      ip,
    });
  };

  // 1. Jeton introuvable
  const { data: tok, error: findError } = await admin
    .from("tokens")
    .select("id, code, days, max_devices, blocked, activated_at, expires_at, note")
    .eq("code", code)
    .maybeSingle();

  if (findError) {
    return json({ success: false, message: "Erreur serveur, réessaie plus tard." }, 500);
  }

  if (!code || !tok) {
    await logInvalid("Jeton introuvable.");
    return json({ success: false, message: "Jeton introuvable. Vérifie le code ou contacte l'admin." }, 404);
  }

  // 2. Jeton bloqué
  if (tok.blocked) {
    await logInvalid("Jeton bloqué.");
    return json({ success: false, message: "Ce jeton est bloqué. Contacte l'admin." }, 403);
  }

  const now = new Date();

  // 3. Jeton déjà activé et expiré
  if (tok.activated_at && tok.expires_at && new Date(tok.expires_at).getTime() < now.getTime()) {
    await logInvalid("Jeton expiré.");
    return json({ success: false, message: "Ce jeton a expiré. Demande un nouveau jeton." }, 403);
  }

  // 4. Contrôle de la limite d'appareils
  const { data: existingDevice, error: deviceFindError } = await admin
    .from("devices")
    .select("id")
    .eq("token_code", code)
    .eq("device_id", deviceId)
    .maybeSingle();

  if (deviceFindError) {
    return json({ success: false, message: "Erreur serveur, réessaie plus tard." }, 500);
  }

  const isNewDevice = !existingDevice;

  if (isNewDevice) {
    const { count: deviceCount, error: deviceCountError } = await admin
      .from("devices")
      .select("id", { count: "exact", head: true })
      .eq("token_code", code);

    if (deviceCountError) {
      return json({ success: false, message: "Erreur serveur, réessaie plus tard." }, 500);
    }

    if ((deviceCount ?? 0) >= (tok.max_devices ?? 1)) {
      await logInvalid("Limite d'appareils atteinte.");
      return json({ success: false, message: "Limite d'appareils atteinte. Contacte l'admin." }, 403);
    }
  }

  // 5. Activation à la première utilisation
  let activatedAt: string | null = tok.activated_at ?? null;
  let expiresAt: string | null = tok.expires_at ?? null;

  if (!tok.activated_at) {
    const days = Number(tok.days) || 0;
    activatedAt = now.toISOString();
    expiresAt = new Date(now.getTime() + days * 86400000).toISOString();

    const { error: updateError } = await admin
      .from("tokens")
      .update({ activated_at: activatedAt, expires_at: expiresAt })
      .eq("id", tok.id);

    if (updateError) {
      return json({ success: false, message: "Erreur serveur, réessaie plus tard." }, 500);
    }
  }

  // 6. Enregistrement / mise à jour de l'appareil + journal
  if (isNewDevice) {
    await admin.from("devices").insert({ token_code: code, device_id: deviceId });
  } else {
    await admin.from("devices").update({ last_seen: now.toISOString() }).eq("id", existingDevice.id);
  }

  await admin.from("activity_log").insert({
    type: "login",
    message: isNewDevice ? "Nouvel appareil connecté." : "Connexion réussie (appareil connu).",
    token_code: code,
    ip,
  });

  // 7. Pays actifs + configurations actives
  const { data: countries, error: countriesError } = await admin
    .from("countries")
    .select("id, name, flag")
    .eq("active", true)
    .order("name", { ascending: true });

  if (countriesError) {
    return json({ success: false, message: "Erreur serveur, réessaie plus tard." }, 500);
  }

  const { data: configs, error: configsError } = await admin
    .from("configs")
    .select("id, country_id, name, type, content")
    .eq("active", true)
    .order("name", { ascending: true });

  if (configsError) {
    return json({ success: false, message: "Erreur serveur, réessaie plus tard." }, 500);
  }

  const grouped = (countries ?? []).map((country) => ({
    id: country.id,
    name: country.name,
    flag: country.flag,
    configs: (configs ?? [])
      .filter((c) => c.country_id === country.id)
      .map((c) => ({ id: c.id, name: c.name, type: c.type, content: c.content })),
  }));

  const remainingDays = expiresAt
    ? Math.max(0, Math.ceil((new Date(expiresAt).getTime() - now.getTime()) / 86400000))
    : null;

  return json({
    success: true,
    message: "Jeton valide.",
    expires_at: expiresAt,
    token: {
      code: tok.code,
      days: tok.days,
      remaining_days: remainingDays,
    },
    countries: grouped,
  });
});
