"use server";
import { createServerClient } from "@supabase/ssr";
import { decode } from "base64-arraybuffer";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function createBucket(name: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.createBucket(name);
  return { data, error };
}

export async function getBucket(name: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.getBucket(name);
  return { data, error };
}

export async function getFileUrl(bucketName: string, fileName: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(bucketName)
    .createSignedUrl(fileName, 60 * 60 * 10);
  return { data, error };
}

export async function uploadBase64Server(
  bucketName: string,
  fileName: string,
  base64FileData: string
) {
  const supabase = await createClient();
  console.log(supabase);
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(fileName, decode(base64FileData), {
      contentType: "image/jpg",
      cacheControl: "3600",
      upsert: false,
    });
  return { data, error };
}

export async function getFilesFromFolder(bucketName: string, folder: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.storage.from(bucketName).list(folder, {
    limit: 100,
    offset: 0,
    sortBy: { column: "name", order: "asc" },
  });
  return { data, error };
}
