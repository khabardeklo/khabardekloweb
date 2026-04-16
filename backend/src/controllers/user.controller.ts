import type { Request, Response } from "express";
import { isValidUserApprovalStatus } from "../validations/user.validation";
import { getReporterDetail, listReporterApplications, reviewReporterApplication } from "../services/user.service";

export const getReporters = async (_req: Request, res: Response): Promise<void> => {
  const reporters = await listReporterApplications();
  res.json({ reporters });
};

export const reviewReporter = async (req: Request, res: Response): Promise<void> => {
  const { status } = req.body as { status?: string };

  if (!isValidUserApprovalStatus(status)) {
    res.status(400).json({ message: "Invalid approval status" });
    return;
  }

  const result = await reviewReporterApplication(req.params.id, status);
  res.status(result.status).json(result);
};

export const getReporterProfileWithContent = async (req: Request, res: Response): Promise<void> => {
  const result = await getReporterDetail(req.params.id);

  if (result.status !== 200) {
    res.status(result.status).json({ message: result.message || "Unable to load reporter details" });
    return;
  }

  res.json(result.data);
};