import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import {
  SIGNED_URL_TTL_SECONDS,
  signPhotos,
  uploadVisitPhoto,
  type SignedPhoto,
} from "@/lib/photos";
import type { Photo } from "@/types/database";

export const photoKeys = {
  byVisit: (visitId: string) => ["photos", "visit", visitId] as const,
};

export function usePhotosByVisit(visitId: string | undefined) {
  return useQuery({
    queryKey: photoKeys.byVisit(visitId ?? ""),
    enabled: Boolean(visitId),
    // Signed links expire, so refresh well before they do.
    staleTime: (SIGNED_URL_TTL_SECONDS * 1000) / 2,
    refetchInterval: (SIGNED_URL_TTL_SECONDS * 1000) / 2,
    queryFn: async (): Promise<SignedPhoto[]> => {
      const { data, error } = await db("photos")
        .select("*")
        .eq("visit_id", visitId as string)
        .order("uploaded_at", { ascending: true });

      if (error) throw error;
      return signPhotos(data ?? []);
    },
  });
}

export interface PhotoUploadInput {
  file: File;
  caption: string;
}

export function useUploadVisitPhotos(visitId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (inputs: PhotoUploadInput[]): Promise<Photo[]> => {
      const uploaded: Photo[] = [];
      for (const input of inputs) {
        const photo = await uploadVisitPhoto(
          visitId,
          input.file,
          input.caption
        );
        uploaded.push(photo);
      }
      return uploaded;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: photoKeys.byVisit(visitId),
      });
    },
  });
}
