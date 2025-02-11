import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://wmzqtwntwwydbffvefxx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndtenF0d250d3d5ZGJmZnZlZnh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg1ODUwMjAsImV4cCI6MjA1NDE2MTAyMH0.ZRddSTifgfiDlMGwN0P2JTdVfjtl7UM8FDD3L-h62t8";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
