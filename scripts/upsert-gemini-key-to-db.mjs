#!/usr/bin/env node
/**
 * Převezme klíč z .env a uloží ho do public.app_config.
 * Hodnota: GEMINI_API_KEY | GOOGLE_API_KEY | GEMINI_API_KEY_RAG
 * Cílový řádek (key): APP_CONFIG_GEMINI_KEY nebo výchozí GEMINI_API_KEY_RAG
 */
import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL?.trim();
const service = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const gemini =
  process.env.GEMINI_API_KEY?.trim() ||
  process.env.GOOGLE_API_KEY?.trim() ||
  process.env.GEMINI_API_KEY_RAG?.trim();
const configKey = process.env.APP_CONFIG_GEMINI_KEY?.trim() || "GEMINI_API_KEY_RAG";

if (!url || !service) {
  console.error("Chybí SUPABASE_URL nebo SUPABASE_SERVICE_ROLE_KEY v .env");
  process.exit(1);
}
if (!gemini) {
  console.error("Chybí GEMINI_API_KEY / GEMINI_API_KEY_RAG v .env — doplni ho a spusť znovu.");
  process.exit(1);
}

const sb = createClient(url, service, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const { error } = await sb.from("app_config").upsert(
  { key: configKey, value: gemini, updated_at: new Date().toISOString() },
  { onConflict: "key" },
);

if (error) {
  console.error(error.message);
  process.exit(1);
}
console.log(`OK: app_config[${configKey}] uložen.`);
