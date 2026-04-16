import { Request, Response } from "express";
import { getCategories } from "../services/category.service";

export const listCategories = (_req: Request, res: Response): void => {
  res.json(getCategories());
};
