export type NewsPayload = {
  title: string;
  content: string;
  category: string;
  description?: string;
  tags?: string[];
  imageUrl?: string;
  isPublished?: boolean;
  scheduledAt?: string | null;
};
