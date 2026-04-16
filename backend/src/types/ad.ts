export type AdPayload = {
  title: string;
  description: string;
  ctaLabel: string;
  targetUrl: string;
  isActive?: boolean;
  position?: number;
};

export type ReorderAdsPayload = {
  ads: Array<{ id: string; position: number }>;
};
