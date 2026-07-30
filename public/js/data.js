// Data layer: read access to the projects table.
// Phase 3 (admin CRUD: save / delete / reorder) extends this file.
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
