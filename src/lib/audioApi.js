import { supabase } from "@/lib/supabaseClient";

const AUDIO_BUCKET = "audio";

export const getAudioUrl = (path) => {
  const { data } = supabase.storage.from(AUDIO_BUCKET).getPublicUrl(path);

  return data.publicUrl;
};

export const fetchAudioTracks = async (type) => {
  let query = supabase
    .from("audio_tracks")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (type) {
    query = query.eq("type", type);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? [])
    .filter((track) => track.file_path)
    .map((track) => ({
      ...track,
      filePath: track.file_path,
      url: getAudioUrl(track.file_path),
    }));
};
