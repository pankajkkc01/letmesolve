// Creates + exports the Supabase client.
//
// Loaded straight from a CDN as an ES module — this project is buildless
// (no bundler, no npm install for the frontend), so there's no local
// node_modules copy of the supabase-js library to import from.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
