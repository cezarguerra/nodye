import Dropzone from "@/components/dropzone";

export default async function Page() {
  return (
    <div>
      <h1 className="bg-red-200 text-2xl font-bold">Dashboard</h1>
      <Dropzone />
    </div>
  );
}
