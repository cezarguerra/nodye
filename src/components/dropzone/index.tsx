"use client";

import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "../ui/button";

import Image from "next/image";

import { ProcessImage } from "@/lib/sharp";
import { useRouter } from "next/navigation";

const baseStyle: React.CSSProperties = {
  flex: 1,
  height: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: 2,
  borderRadius: 2,
  borderColor: "#eeeeee",
  borderStyle: "dashed",
  backgroundColor: "#fafafa",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const focusedStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

type FileWithPreview = File & { preview: string };

export default function Dropzone() {
  const [files, setFiles] = useState<FileWithPreview[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      )
    );
  }, []);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    // fileRejections,
    acceptedFiles,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject]
  );

  const handleRejected = () => {
    alert("Rejected");
  };

  if (isDragReject) {
    handleRejected();
  }
  //   const erro = fileRejections[0]?.errors[0]?.message;
  //   if (erro) alert(erro);

  //   const fileRejectionItems = fileRejections.map(({ file, errors }) => {
  //     return (
  //       <li key={file.path}>
  //         {file.path} - {file.size} bytes
  //         <ul>
  //           {errors.map((e: any) => (
  //             <li key={e.code}>{e.message}</li>
  //           ))}
  //         </ul>
  //       </li>
  //     );
  //   });

  //   const selectedFiles = files?.map((file) => (
  //     <div key={file.name}>
  //       <Image src={file.preview} alt={file.name} width={100} height={100} />
  //     </div>
  //   ));

  const router = useRouter();

  const handleUpload = async () => {
    try {
      const file = files[0];

      const arrayBuffer = await file.arrayBuffer();

      // console.log(arrayBuffer);
      // const buffer = Buffer.from(arrayBuffer);

      // console.log(buffer);

      // console.log(red, green, blue, diff, result);

      // const uuid = await generateUuid();
      // const { data, error } = await uploadFile(
      //   `nodye/cezar/${uuid}`,
      //   files[0].name,
      //   files[0]
      // );
      // console.log(data, error);

      // const teste = await getFileUrl(`nodye/cezar/${uuid}`, files[0].name);
      // console.log(teste);

      // if (!teste.data?.signedUrl) return;
      const { success, uuid } = await ProcessImage(arrayBuffer);

      if (success) {
        router.push(`/processed/${uuid}`);
      }
      // if (!success) return;
    } catch (error) {
      console.log(error);
    }
  };

  {
    /* <div className="w-full aspect-square  relative"> */
  }

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className=" relative aspect-square size-full max-w-3xl ">
        {files[0]?.preview ? (
          <Image src={files[0]?.preview} alt={files[0]?.name} fill />
        ) : (
          // <Image
          //   src={files[0]?.preview}
          //   alt={files[0]?.name}
          //  fill
          // />
          <section className=" container  h-full  p-10 ">
            <div {...getRootProps({ style })}>
              <input {...getInputProps()} />
              <div className="flex h-full flex-col items-center justify-center">
                {isDragActive ? (
                  <p>Drop the files here ...</p>
                ) : (
                  <p>Drag drop some files here, or click to select files</p>
                )}
              </div>
            </div>
          </section>
        )}
      </div>
      <Button
        className="w-full"
        onClick={handleUpload}
        disabled={!acceptedFiles.length}
      >
        Processar Imagem
      </Button>
      <p>{JSON.stringify(files)}</p>
    </div>
  );
}
