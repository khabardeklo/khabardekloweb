export type NewsRow = {
  id?: string;
  title: string;
  author: string;
  category: string;
  status: string;
};

export type UserRow = {
  name: string;
  email: string;
  role: string;
  status: string;
  approvalStatus?: string;
};

export type PageRow = {
  title: string;
  category: string;
  status: string;
  createdAt: string;
};