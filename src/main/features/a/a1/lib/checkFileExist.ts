import fs from 'fs/promises';

export default async function (filePath: string) {
  try {
    await fs.stat(filePath);
    return true;
  } catch {
    return false;
  }
}
