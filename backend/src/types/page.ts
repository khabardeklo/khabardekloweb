import type { PageTemplateType } from "../models/Page";

export type PagePayload = {
  title: string;
  slug?: string;
  templateType: PageTemplateType;
  menuLabel?: string;
  content: string;
  isPublished?: boolean;
};

export type UpdatePagePayload = Partial<PagePayload>;

export type PublicPagesQuery = {
  templateType?: PageTemplateType;
};