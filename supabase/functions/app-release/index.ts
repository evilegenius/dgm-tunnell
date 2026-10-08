import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const BUCKET = "downloads";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

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

  try {
    const url = new URL(req.url);
    const currentVersionCode = Number(url.searchParams.get("current") ?? "0") || 0;

    const client = createClient(SUPABASE_URL, SERVICE_ROLE, {
      auth: { persistSession: false },
    });

    const { data, error } = await client
      .from("app_releases")
      .select(
        "id, version_name, version_code, changelog, file_path, file_name, file_size, external_url, is_mandatory, min_version_code, created_at"
      )
      .eq("is_published", true)
      .order("version_code", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      return json({ available: false, updateAvailable: false, mandatory: false, release: null, downloadUrl: null });
    }

    let downloadUrl: string | null = data.external_url ?? null;
    if (!downloadUrl && data.file_path) {
      const { data: signed } = await client.storage.from(BUCKET).createSignedUrl(data.file_path, 60 * 60 * 24);
      downloadUrl = signed?.signedUrl ?? null;
    }

    const updateAvailable = currentVersionCode > 0 && currentVersionCode < data.version_code;
    const mandatory =
      updateAvailable && (data.is_mandatory || currentVersionCode < (data.min_version_code ?? 0));

    return json({
      available: true,
      updateAvailable,
      mandatory,
      minVersionCode: data.min_version_code ?? 0,
      downloadUrl,
      release: {
        versionName: data.version_name,
        versionCode: data.version_code,
        changelog: data.changelog ?? "",
        fileName: data.file_name ?? null,
        fileSize: data.file_size ?? null,
        publishedAt: data.created_at,
        downloadUrl,
      },
    });
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : String(e) }, 500);
  }
});