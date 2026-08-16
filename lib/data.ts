import { promises as fs } from "fs";
import path from "path";
import { get, put } from "@vercel/blob";

const DATA_DIR = path.join(process.cwd(), "data");

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

const useBlob = Boolean(BLOB_TOKEN);

/**
 * Read a JSON data file.
 *
 * Local development:
 *   Reads from /data
 *
 * Vercel:
 *   Reads from private Vercel Blob
 */
export async function readData<T>(
  filename: string
): Promise<T> {
  // =====================================================
  // VERCEL BLOB
  // =====================================================

  if (useBlob) {
    const result = await get(filename, {
      access: "private",
      token: BLOB_TOKEN,
      useCache: false,
    });

    if (!result || result.statusCode !== 200) {
      throw new Error(
        `Blob file not found or could not be read: ${filename}`
      );
    }

    return (await new Response(
      result.stream
    ).json()) as T;
  }

  // =====================================================
  // LOCAL FILESYSTEM
  // =====================================================

  const filePath = path.join(
    DATA_DIR,
    filename
  );

  const file = await fs.readFile(
    filePath,
    "utf-8"
  );

  return JSON.parse(file) as T;
}

/**
 * Write a JSON data file.
 *
 * Local development:
 *   Writes to /data
 *
 * Vercel:
 *   Writes to private Vercel Blob
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
        allowOverwrite: true,
        contentType: "application/json",
        token: BLOB_TOKEN,
      }
    );

    return;
  }

  // =====================================================
  // LOCAL FILESYSTEM
  // =====================================================

  const filePath = path.join(
    DATA_DIR,
    filename
  );

  await fs.writeFile(
    filePath,
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}