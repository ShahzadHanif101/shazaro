import { promises as fs } from "fs";
import path from "path";
import { put, list } from "@vercel/blob";

const DATA_DIR = path.join(process.cwd(), "data");

const useBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

/**
 * Read a JSON data file.
 *
 * Development:
 *   Reads from /data
 *
 * Production:
 *   Reads from Vercel Blob
 */
export async function readData<T>(filename: string): Promise<T> {
  // =====================================================
  // VERCEL BLOB
  // =====================================================

  if (useBlob) {
    const result = await list({
      prefix: filename,
      limit: 1,
    });

    const blob = result.blobs.find(
      (item) => item.pathname === filename
    );

    if (!blob) {
      throw new Error(`Blob file not found: ${filename}`);
    }

    const response = await fetch(blob.url, {
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Failed to read Blob file: ${filename}`
      );
    }

    return (await response.json()) as T;
  }

  // =====================================================
  // LOCAL FILESYSTEM
  // =====================================================

  const filePath = path.join(DATA_DIR, filename);

  const file = await fs.readFile(filePath, "utf-8");

  return JSON.parse(file) as T;
}

/**
 * Write a JSON data file.
 *
 * Development:
 *   Writes to /data
 *
 * Production:
 *   Writes to Vercel Blob
 */
export async function writeData<T>(
  filename: string,
  data: T
): Promise<void> {
  // =====================================================
  // VERCEL BLOB
  // =====================================================

  if (useBlob) {
    await put(
      filename,
      JSON.stringify(data, null, 2),
      {
        access: "private",
        addRandomSuffix: false,
        token: process.env.BLOB_READ_WRITE_TOKEN,
        contentType: "application/json",
      }
    );

    return;
  }

  // =====================================================
  // LOCAL FILESYSTEM
  // =====================================================

  const filePath = path.join(DATA_DIR, filename);

  await fs.writeFile(
    filePath,
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}