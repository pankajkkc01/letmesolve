// Data layer: read access to the projects table, plus the admin CRUD +
// storage operations used by admin.js (Phase 3). Admin operations rely on
// RLS: they only succeed for an authenticated session.
import { supabase } from "./supabaseClient.js";

/**
 * Loads published case studies, ordered for display.
 * Returns an empty array on any failure so the public page always has
 * something safe to render (see render.js) instead of throwing.
 */
export async function loadProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load projects:", error.message);
    return [];
  }

  return data ?? [];
}

/**
 * Loads every project (draft + published), for the admin list.
 * Throws on error — the admin panel shows the failure directly rather than
 * silently rendering an empty list.
 */
export async function loadAllProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/**
 * Creates a new project, or updates an existing one when `project.id` is set.
 * Returns the saved row.
 */
export async function saveProject(project) {
  const { data, error } = await supabase
    .from("projects")
    .upsert(project)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteProject(id) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

export async function updateSortOrder(id, sortOrder) {
  const { error } = await supabase
    .from("projects")
    .update({ sort_order: sortOrder })
    .eq("id", id);

  if (error) throw error;
}

/**
 * Loads published client logos for the "Trusted by" strip, ordered for
 * display. Independent of the projects table — see docs/supabase-schema.sql.
 */
export async function loadClientLogos() {
  const { data, error } = await supabase
    .from("client_logos")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Failed to load client logos:", error.message);
    return [];
  }

  return data ?? [];
}

/** Loads every client logo (draft + published), for the admin list. */
export async function loadAllClientLogos() {
  const { data, error } = await supabase
    .from("client_logos")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/**
 * Creates a new client logo, or updates an existing one when `logo.id` is
 * set. Returns the saved row.
 */
export async function saveClientLogo(logo) {
  const { data, error } = await supabase
    .from("client_logos")
    .upsert(logo)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteClientLogo(id) {
  const { error } = await supabase.from("client_logos").delete().eq("id", id);
  if (error) throw error;
}

export async function updateClientLogoSortOrder(id, sortOrder) {
  const { error } = await supabase
    .from("client_logos")
    .update({ sort_order: sortOrder })
    .eq("id", id);

  if (error) throw error;
}

/**
 * Uploads an image (case-study screenshot or client logo) to the public
 * `project-images` bucket and returns its public URL.
 */
export async function uploadImage(file) {
  const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "-");
  const path = `${Date.now()}-${safeName}`;

  const { error: uploadError } = await supabase.storage
    .from("project-images")
    .upload(path, file, { cacheControl: "3600", upsert: false });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("project-images").getPublicUrl(path);

  return publicUrl;
}
