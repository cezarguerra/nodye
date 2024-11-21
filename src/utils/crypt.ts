"use server";
import crypto from "crypto";

export async function encrypt(text: string): Promise<string> {
  const base64Key = process.env.AUTH_SECRET;

  if (!base64Key) {
    throw new Error("AUTH_SECRET is not defined");
  }

  // Decode the Base64 key
  const key = Buffer.from(base64Key, "base64");

  // Ensure the decoded key is exactly 32 bytes
  if (key.length !== 32) {
    throw new Error("Decoded AUTH_SECRET must be exactly 32 bytes long");
  }

  // Generate a random IV
  const iv = crypto.randomBytes(16);

  // Create cipher
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

  // Encrypt the text
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  // Get the auth tag
  const tag = cipher.getAuthTag();

  // Combine IV, encrypted text, and auth tag
  return iv.toString("hex") + ":" + encrypted + ":" + tag.toString("hex");
}

export async function decrypt(encryptedText: string): Promise<string> {
  const base64Key = process.env.AUTH_SECRET;

  if (!base64Key) {
    throw new Error("AUTH_SECRET is not defined");
  }

  // Decode the Base64 key
  const key = Buffer.from(base64Key, "base64");

  // Ensure the decoded key is exactly 32 bytes
  if (key.length !== 32) {
    throw new Error("Decoded AUTH_SECRET must be exactly 32 bytes long");
  }

  // Split the encrypted text into IV, ciphertext, and tag
  const [ivHex, encryptedHex, tagHex] = encryptedText.split(":");

  if (!ivHex || !encryptedHex || !tagHex) {
    throw new Error("Invalid encrypted text format");
  }

  // Convert hex strings back to Buffers
  const iv = Buffer.from(ivHex, "hex");
  const tag = Buffer.from(tagHex, "hex");

  // Create decipher
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);

  // Decrypt the text
  let decrypted = decipher.update(encryptedHex, "hex", "utf8");
  decrypted += decipher.final("utf8");

  return decrypted;
}
