// Login, logout, session check for the /admin gate.
// Single-admin-user model: there's no sign-up flow anywhere in the UI —
// the one account is created directly in the Supabase dashboard.
import { supabase } from "./supabaseClient.js";

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data.session;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/** Fires immediately with the current session, then on every login/logout. */
export function onAuthChange(callback) {
  supabase.auth.onAuthStateChange((_event, session) => callback(session));
}
