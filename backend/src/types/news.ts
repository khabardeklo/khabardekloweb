export type NewsPayload = {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  imageUrl?: string;
  isPublished?: boolean;
};
