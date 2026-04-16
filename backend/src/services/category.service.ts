import type { CategoryItem } from "../types/category";

export const getCategories = (): CategoryItem[] => {
  return [
    { slug: "india", name: "India", description: "National and regional coverage" },
    { slug: "politics", name: "Politics", description: "Government and policy updates" },
    { slug: "business", name: "Business", description: "Markets, startups, and economy" },
    { slug: "technology", name: "Technology", description: "AI, products, and digital trends" },
    { slug: "sports", name: "Sports", description: "Match reports and live coverage" },
    { slug: "entertainment", name: "Entertainment", description: "Cinema, music, and culture" },
  ];
};
