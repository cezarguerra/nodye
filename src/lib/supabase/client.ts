"use client";

import { createBrowserClient } from "@supabase/ssr";
import { decode } from "base64-arraybuffer";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function uploadFile(
  bucketName: string,
  fileName: string,
  file: File
) {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });
  return { data, error };
}

export async function uploadBase64(
  bucketName: string,
  fileName: string,
  base64FileData: string
) {
  const supabase = createClient();
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, decode(base64FileData), {
      cacheControl: "3600",
      upsert: false,
    });
  return { data, error };
}
