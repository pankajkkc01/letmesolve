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
 * Uploads a screenshot to the public `project-images` bucket and returns
 * its public URL.
 */
export async function uploadProjectImage(file) {
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
