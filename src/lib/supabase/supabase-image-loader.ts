const projectId = process.env.NEXT_PUBLIC_SUPABASE_URL;

export default function supabaseLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: string;
  quality: string;
}) {
  return `${projectId}/storage/v1/render/image/public/${src}?width=${width}&quality=${
    quality || 75
  }`;
}
