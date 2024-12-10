import express from "express";
import { db } from "../firebase/config";
import { json } from "body-parser";
import { error } from "console";
import { default as crawler } from "../scripts/getRestaurantsMap";

const router = express.Router();

router.get("/crawl", async (req, res) => {
  try {
    const data = await crawler();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error("Error searching places:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:collection", async (req, res) => {
  const collection = req.params.collection as string;

  try {
    const snapshot = await db.collection(collection).get();
    const data = snapshot.docs.map((doc) => doc.data());

    console.log(data);

    res.json(data);
  } catch (error) {
    console.error("Error searching places:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
