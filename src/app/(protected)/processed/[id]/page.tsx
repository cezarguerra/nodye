import Images from "@/components/images";
import { getFileUrl } from "@/lib/supabase/server";
import { getFilesFromFolder } from "@/lib/supabase/server";

type Params = Promise<{ id: string }>;
export default async function Page({ params }: { params: Params }) {
  const { id } = await params;

  console.log(id);

  let originalUrl: string | null = null;
  let blueChannelUrl: string | null = null;
  let redChannelUrl: string | null = null;
  let greenChannelUrl: string | null = null;
  let evvUrl: string | null = null;
  let edvUrl: string | null = null;

  const { data, error } = await getFilesFromFolder("nodye", `cezar/${id}`);

  if (error) {
    console.error(error);
  }

  if (data) {
    await Promise.all(
      data.map(async (file) => {
        const { data: urlData, error: urlError } = await getFileUrl(
          "nodye",
          `cezar/${id}/${file.name}`
        );

        if (urlError) {
          console.error(urlError);
        }

        if (file.name.includes("original")) {
          originalUrl = urlData?.signedUrl || null;
        }

        if (file.name.includes("blue")) {
          blueChannelUrl = urlData?.signedUrl || null;
        }

        if (file.name.includes("red")) {
          redChannelUrl = urlData?.signedUrl || null;
        }
        if (file.name.includes("green")) {
          greenChannelUrl = urlData?.signedUrl || null;
        }

        if (file.name.includes("g-b")) {
          evvUrl = urlData?.signedUrl || null;
        }
        if (file.name.includes("r-b")) {
          edvUrl = urlData?.signedUrl || null;
        }
      })
    );
  }

  return (
    <div className="h-full gap-4 p-4">
      <Images
        originalUrl={originalUrl}
        blueChannelUrl={blueChannelUrl}
        redChannelUrl={redChannelUrl}
        greenChannelUrl={greenChannelUrl}
        evvUrl={evvUrl}
        edvUrl={edvUrl}
      />
    </div>
  );
}
