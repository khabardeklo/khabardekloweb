export type PageTemplateType = "frontend-header" | "frontend-footer" | "header-menu" | "custom";

export type PublicPage = {
  _id: string;
  title: string;
  slug: string;
  templateType: PageTemplateType;
  menuLabel?: string;
  content: string;
  isPublished: boolean;
  createdAt?: string;
  updatedAt?: string;
};

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api";

const fetchJson = async <T>(url: string): Promise<T | null> => {
  try {
    const response = await fetch(url, {
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
};

export const getPublishedPages = async (): Promise<PublicPage[]> => {
  const response = await fetchJson<PublicPage[]>(`${backendUrl}/pages/public`);
  return Array.isArray(response) ? response : [];
};

export const getPublishedPageBySlug = async (slug: string): Promise<PublicPage | null> => {
  return fetchJson<PublicPage>(`${backendUrl}/pages/public/${slug}`);
};

export const getLayoutPagesData = async (): Promise<{
  headerPages: PublicPage[];
  footerPages: PublicPage[];
  menuPages: PublicPage[];
  customPages: PublicPage[];
}> => {
  const pages = await getPublishedPages();

  return {
    headerPages: pages.filter((page) => page.templateType === "frontend-header"),
    footerPages: pages.filter((page) => page.templateType === "frontend-footer"),
    menuPages: pages.filter((page) => page.templateType === "header-menu"),
    customPages: pages.filter((page) => page.templateType === "custom"),
  };
};