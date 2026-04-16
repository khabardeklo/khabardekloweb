import type { PageTemplateType } from "../models/Page";
import type { PagePayload } from "../types/page";

const allowedTemplateTypes: PageTemplateType[] = ["frontend-header", "frontend-footer", "header-menu", "custom"];

export const isValidTemplateType = (value: unknown): value is PageTemplateType => {
  return typeof value === "string" && allowedTemplateTypes.includes(value as PageTemplateType);
};

export const isValidPagePayload = (value: Partial<PagePayload>): value is PagePayload => {
  return (
    typeof value.title === "string" &&
    typeof value.content === "string" &&
    isValidTemplateType(value.templateType)
  );
};