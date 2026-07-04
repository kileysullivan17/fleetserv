import { supabase, db } from "@/lib/supabase";
import type { Photo } from "@/types/database";

const BUCKET = "visit-photos";

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, "_");
}

// Uploads one image to Supabase Storage and inserts its photos table row.
export async function uploadVisitPhoto(
  visitId: string,
  file: File,
  caption: string
): Promise<Photo> {
  const path = `${visitId}/${Date.now()}-${sanitizeFilename(file.name)}`;

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, {
      cacheControl: "3600",
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUCKET).getPublicUrl(path);

  const { data, error } = await db("photos")
    .insert({
      visit_id: visitId,
      storage_url: publicUrl,
      caption,
    })
    .select()
    .single();

  // Remove the orphaned storage object if the row insert fails
  if (error) {
    await supabase.storage.from(BUCKET).remove([path]);
    throw error;
  }

  return data;
}
