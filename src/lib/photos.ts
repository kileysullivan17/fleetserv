import { supabase, db } from "@/lib/supabase";
import type { Photo } from "@/types/database";

const BUCKET = "visit-photos";

// How long a signed display link stays valid. PDFs embed the image bytes when
// they are generated, so a downloaded report keeps working after this passes.
export const SIGNED_URL_TTL_SECONDS = 60 * 60;

export type SignedPhoto = Photo & { signed_url: string };

// Signs display URLs for a batch of photos in one request. The bucket is
// private, so this is the only way a photo can be shown or embedded. A photo
// whose link cannot be signed gets an empty signed_url rather than failing the
// whole batch; callers render nothing for it.
export async function signPhotos(photos: Photo[]): Promise<SignedPhoto[]> {
  if (photos.length === 0) return [];

  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrls(
      photos.map((p) => p.storage_path),
      SIGNED_URL_TTL_SECONDS
    );

  if (error) throw error;

  const byPath = new Map<string, string>();
  for (const entry of data ?? []) {
    if (entry.path && entry.signedUrl) byPath.set(entry.path, entry.signedUrl);
  }

  return photos.map((p) => ({ ...p, signed_url: byPath.get(p.storage_path) ?? "" }));
}

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

  const { data, error } = await db("photos")
    .insert({
      visit_id: visitId,
      storage_path: path,
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
