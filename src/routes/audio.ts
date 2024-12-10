import express from "express";
import { getTranscript } from "../helper/assemblyAi";

const router = express.Router();

router.get("/", async (req, res) => {
  const { link } = req.query;

  if (!link || typeof link !== "string") {
    return res.status(400).json({ error: "link query parameter is required" });
  }

  try {
    const transcript = await getTranscript(link as string);
    res.status(200).json({ transcript });
  } catch (error) {
    console.error(`error when handling audio: ${(error as Error).message}`);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
