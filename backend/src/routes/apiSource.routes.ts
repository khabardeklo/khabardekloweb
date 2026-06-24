import { Router, Request, Response } from "express";
import { authorize, protect } from "../middleware/auth";
import { ApiSource } from "../models/ApiSource";
import {
  runFetchForSource,
  startSchedulerForSource,
  stopSchedulerForSource,
} from "../services/newsScheduler.service";

const router = Router();

router.use(protect, authorize("admin"));

// GET all saved API sources
router.get("/", async (_req: Request, res: Response) => {
  try {
    const sources = await ApiSource.find().sort({ createdAt: -1 });
    res.json(sources);
  } catch (err) {
    res.status(500).json({ message: "Failed to load sources", error: String(err) });
  }
});

// POST create new API source + start scheduler
router.post("/", async (req: Request, res: Response) => {
  try {
    const { name, apiUrl, apiKey, category, intervalMinutes, publishImmediately } = req.body as {
      name?: string;
      apiUrl?: string;
      apiKey?: string;
      category?: string;
      intervalMinutes?: number;
      publishImmediately?: boolean;
    };

    if (!name || !apiUrl || !category) {
      res.status(400).json({ message: "name, apiUrl and category are required" });
      return;
    }

    const source = await ApiSource.create({
      name,
      apiUrl,
      apiKey: apiKey || "",
      category,
      intervalMinutes: intervalMinutes || 60,
      publishImmediately: publishImmediately ?? false,
      isActive: true,
    });

    // Start auto-fetch scheduler immediately
    startSchedulerForSource(source);

    res.status(201).json(source);
  } catch (err) {
    res.status(500).json({ message: "Failed to create source", error: String(err) });
  }
});

// PATCH update — restart/stop scheduler based on isActive
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const source = await ApiSource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!source) {
      res.status(404).json({ message: "Not found" });
      return;
    }

    if (source.isActive) {
      startSchedulerForSource(source);
    } else {
      stopSchedulerForSource(String(source._id));
    }

    res.json(source);
  } catch (err) {
    res.status(500).json({ message: "Failed to update source", error: String(err) });
  }
});

// DELETE — stop scheduler and remove
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    stopSchedulerForSource(req.params.id);
    await ApiSource.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete source", error: String(err) });
  }
});

// POST /:id/fetch-now — manual trigger
router.post("/:id/fetch-now", async (req: Request, res: Response) => {
  try {
    const source = await ApiSource.findById(req.params.id);
    if (!source) {
      res.status(404).json({ message: "Not found" });
      return;
    }

    const result = await runFetchForSource(source);
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: String(err) });
  }
});

export default router;
