"use client";

/**
 * Upload a file straight to a Supabase signed upload URL with progress events.
 * supabase-js's uploadToSignedUrl gives no progress and rejects without a
 * friendly message on very large files, which left the submit button hanging.
 */
export const MAX_UPLOAD_BYTES = 50 * 1024 * 1024; // Supabase bucket limit

export function uploadWithProgress(
  path: string,
  token: string,
  file: File,
  onProgress: (percent: number) => void,
  bucket = "dossier-uploads",
): Promise<void> {
  return new Promise((resolve, reject) => {
    const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    if (!base || !key) {
      reject(new Error("Uploads are not configured on this deployment."));
      return;
    }
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", `${base}/storage/v1/object/upload/sign/${bucket}/${path}?token=${encodeURIComponent(token)}`);
    xhr.setRequestHeader("x-upsert", "true");
    xhr.setRequestHeader("apikey", key);
    xhr.setRequestHeader("Authorization", `Bearer ${key}`);
    // Supabase's signed-upload endpoint expects multipart form data (field name
    // is empty), exactly like supabase-js sends it. The browser sets the
    // boundary, so we must not set Content-Type ourselves.
    xhr.timeout = 15 * 60 * 1000;
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
      } else if (xhr.status === 413) {
        reject(new Error("file too large for storage"));
      } else {
        let detail = "";
        try {
          detail = (JSON.parse(xhr.responseText) as { message?: string }).message ?? "";
        } catch {
          /* not json */
        }
        reject(new Error(detail || `upload failed (${xhr.status})`));
      }
    };
    xhr.onerror = () => reject(new Error("network error during upload"));
    xhr.ontimeout = () => reject(new Error("upload timed out"));
    xhr.onabort = () => reject(new Error("upload cancelled"));
    const body = new FormData();
    body.append("cacheControl", "3600");
    body.append("", file);
    xhr.send(body);
  });
}

export function fileSizeLabel(bytes: number) {
  return bytes >= 1024 * 1024 ? `${(bytes / (1024 * 1024)).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}
