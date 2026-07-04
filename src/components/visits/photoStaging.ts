// A photo staged in the browser before upload: the File plus a preview URL
// and editable caption. Kept separate from the PhotoDropzone component so the
// component file only exports a component (keeps Vite fast refresh working).
export interface StagedPhoto {
  id: string;
  file: File;
  previewUrl: string;
  caption: string;
}

export function createStagedPhoto(file: File): StagedPhoto {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    file,
    previewUrl: URL.createObjectURL(file),
    caption: "",
  };
}
