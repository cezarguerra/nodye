"use server";

import { randomUUID } from "crypto";

export async function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export async function generateUuid() {
  return randomUUID();
}

// export const toNull = (value: any) => (value === undefined ? null : value);
