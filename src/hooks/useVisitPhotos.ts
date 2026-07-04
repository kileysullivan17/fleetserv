import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { db } from "@/lib/supabase";
import { uploadVisitPhoto } from "@/lib/photos";
import type { Photo } from "@/types/database";

export const photoKeys = {
  byVisit: (visitId: string) => ["photos", "visit", visitId] as const,
};

export function usePhotosByVisit(visitId: string | undefined) {
  return useQuery({
    queryKey: photoKeys.byVisit(visitId ?? ""),
    enabled: Boolean(visitId),
    queryFn: async (): Promise<Photo[]> => {
      const { data, error } = await db("photos")
        .select("*")
        .eq("visit_id", visitId as string)
        .order("uploaded_at", { ascending: true });

      if (error) throw error;
      return data ?? [];
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
