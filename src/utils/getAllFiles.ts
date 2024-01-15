import fs from "fs";
import path from "path";

export const getAllFiles = (directory: string, foldersOnly = false) => {
  const filenames = [];

  const files = fs.readdirSync(directory, { withFileTypes: true });

  for (const file of files) {
    const filePath = path.join(directory, file.name);

    if (foldersOnly) {
      if (file.isDirectory()) {
        filenames.push(filePath);
      }
    } else {
      if (file.isFile()) {
        filenames.push(filePath);
      }
    }
  }

  return filenames;
};
