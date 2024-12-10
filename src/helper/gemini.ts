import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import dotenv from "dotenv";

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_KEY || "");
const fileManager = new GoogleAIFileManager(process.env.GEMINI_KEY || "");

export async function audio2text(mediaPath: string) {
  const uploadResult = await fileManager.uploadFile(mediaPath, {
    mimeType: "audio/mp3",
    displayName: "Audio sample",
  });

  let file = await fileManager.getFile(uploadResult.file.name);
  while (file.state === FileState.PROCESSING) {
    process.stdout.write(".");
    // Sleep for 10 seconds
    await new Promise((resolve) => setTimeout(resolve, 10_000));
    // Fetch the file from the API again
    file = await fileManager.getFile(uploadResult.file.name);
  }

  if (file.state === FileState.FAILED) {
    throw new Error("Audio processing failed.");
  }

  // View the response.
  console.log(
    `Uploaded file ${uploadResult.file.displayName} as: ${uploadResult.file.uri}`
  );

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro-002" });
  const result = await model.generateContent([
    {
      fileData: {
        fileUri: uploadResult.file.uri,
        mimeType: uploadResult.file.mimeType,
      },
    },
    { text: "Generate a transcript of the speech." },
  ]);
  console.log(result.response.text());

  return result.response.text();
}
