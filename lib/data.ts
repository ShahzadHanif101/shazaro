import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

/**
 * Read a JSON data file from /data
 */
export async function readData<T>(filename: string): Promise<T> {
  const filePath = path.join(DATA_DIR, filename);

  const file = await fs.readFile(filePath, "utf-8");

  return JSON.parse(file) as T;
}

/**
 * Write data to a JSON file in /data
 */
export async function writeData<T>(
  filename: string,
  data: T
): Promise<void> {
  const filePath = path.join(DATA_DIR, filename);

  await fs.writeFile(
    filePath,
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}