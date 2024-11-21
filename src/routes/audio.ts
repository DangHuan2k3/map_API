import express from "express";
import { audio2text } from "../helper/gemini";
import { promises as fsPromises } from "fs";
import { downloadAudioFile } from "../helper/audio";

const router = express.Router();

router.get("/", async (req, res) => {
  const { link } = req.query;

  if (!link || typeof link !== "string") {
    return res.status(400).json({ error: "link query parameter is required" });
  }

  const filename = "downloaded_audio.mp3";

  try {
    const filePath = await downloadAudioFile(link, filename);
    console.log(`file audio downloaded: ${filePath}`);

    const transcript = await audio2text(filePath);

    await fsPromises.unlink(filePath).catch((err) => {
      console.error(`cannot delete file: ${filePath}, ${err.message}`);
    });
    res.status(200).json({ transcript });
  } catch (error) {
    console.error(`error when handling audio: ${(error as Error).message}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
