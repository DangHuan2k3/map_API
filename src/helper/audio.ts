import * as https from "https";
import * as fs from "fs";
import path from "path";

export async function downloadAudioFile(
  url: string,
  filename: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const filePath = path.join("./uploads", filename);
    const file = fs.createWriteStream(filePath);

    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          fs.unlink(filePath, (err) => {
            if (err) {
              console.error(`Cannot delete file: ${filePath}`);
            }
          });
          reject(
            new Error(
              `Cannot download file: ${response.statusCode} ${response.statusMessage}`
            )
          );
          return;
        }

        response.pipe(file);

        file.on("finish", () => {
          file.close(() => resolve(filePath));
        });
      })
      .on("error", (err) => {
        fs.unlink(filePath, (err) => {
          if (err) {
            console.error(`Cannot delete file: ${filePath}`);
          }
        });
        reject(err);
      });
  });
}
