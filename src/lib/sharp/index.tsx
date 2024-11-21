"use server";

import { generateUuid } from "@/utils/utils";
import sharp from "sharp";

import { uploadBase64Server } from "../supabase/server";

export async function ProcessImage(buffer: ArrayBuffer) {
  try {
    const nodeBuffer = Buffer.from(buffer);

    const { data, info } = await sharp(nodeBuffer)
      .ensureAlpha() // Garante que a imagem tenha 4 canais (RGBA)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height } = info;

    const originalBuffer = await sharp(Buffer.from(data), {
      raw: { width, height, channels: 4 },
    })
      .toFormat("jpg")
      .toBuffer();

    const uuid = await generateUuid();

    // Buffers para os canais
    const totalPixels = width * height * 4; // Número total de elementos no buffer
    const redChannel = new Uint8Array(totalPixels);
    const greenChannel = new Uint8Array(totalPixels);
    const blueChannel = new Uint8Array(totalPixels);
    const diffChannel = new Uint8Array(totalPixels);
    const resultChannel = new Uint8Array(totalPixels);

    // Processa cada pixel
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const alpha = data[i + 3];

      // Red Channel as grayscale
      redChannel[i] = redChannel[i + 1] = redChannel[i + 2] = r;
      redChannel[i + 3] = alpha;

      // Green Channel as grayscale
      greenChannel[i] = greenChannel[i + 1] = greenChannel[i + 2] = g;
      greenChannel[i + 3] = alpha;

      // Blue Channel as grayscale
      blueChannel[i] = blueChannel[i + 1] = blueChannel[i + 2] = b;
      blueChannel[i + 3] = alpha;

      // Difference (G - B)
      const diff = Math.max(0, Math.min(255, g - b));
      diffChannel[i] = diffChannel[i + 1] = diffChannel[i + 2] = diff;
      diffChannel[i + 3] = alpha;

      // Difference (R - B)
      const result = Math.max(0, Math.min(255, r - b));
      resultChannel[i] = resultChannel[i + 1] = resultChannel[i + 2] = result;
      resultChannel[i + 3] = alpha;
    }

    // Converte cada canal em imagens separadas
    const redImage = await sharp(Buffer.from(redChannel), {
      raw: { width, height, channels: 4 },
    })
      .toFormat("jpg")
      .toBuffer();

    const greenImage = await sharp(Buffer.from(greenChannel), {
      raw: { width, height, channels: 4 },
    })
      .toFormat("jpg")
      .toBuffer();

    const blueImage = await sharp(Buffer.from(blueChannel), {
      raw: { width, height, channels: 4 },
    })
      .toFormat("jpg")
      .toBuffer();

    const diffImage = await sharp(Buffer.from(diffChannel), {
      raw: { width, height, channels: 4 },
    })
      .toFormat("jpg")
      .toBuffer();

    const resultImage = await sharp(Buffer.from(resultChannel), {
      raw: { width, height, channels: 4 },
    })
      .toFormat("jpg")
      .toBuffer();

    await uploadBase64Server(
      `nodye/cezar/${uuid}`,
      "original.jpg",
      originalBuffer.toString("base64")
    );
    await uploadBase64Server(
      `nodye/cezar/${uuid}`,
      "red.jpg",
      redImage.toString("base64")
    );
    await uploadBase64Server(
      `nodye/cezar/${uuid}`,
      "green.jpg",
      greenImage.toString("base64")
    );
    await uploadBase64Server(
      `nodye/cezar/${uuid}`,
      "blue.jpg",
      blueImage.toString("base64")
    );
    await uploadBase64Server(
      `nodye/cezar/${uuid}`,
      "g-b.jpg",
      diffImage.toString("base64")
    );

    await uploadBase64Server(
      `nodye/cezar/${uuid}`,
      "r-b.jpg",
      resultImage.toString("base64")
    );

    // Retorna as imagens como base64
    // return {
    //   red: `data:image/png;base64,${redImage.toString("base64")}`,
    //   green: `data:image/png;base64,${greenImage.toString("base64")}`,
    //   blue: `data:image/png;base64,${blueImage.toString("base64")}`,
    //   diff: `data:image/png;base64,${diffImage.toString("base64")}`,
    //   result: `data:image/png;base64,${resultImage.toString("base64")}`,
    // };

    return { success: true, uuid };
  } catch (error) {
    console.error(error);
    return { error: error };
  }
}
