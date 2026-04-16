import type { NewsRow, UserRow, PageRow } from "@/types";

export const adminNav = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "News", href: "/news" },
  { label: "Create Pages", href: "/create-pages" },
  { label: "Categories", href: "/categories" },
  { label: "Users", href: "/users" },
  { label: "Analytics", href: "/analytics" },
  { label: "Settings", href: "/settings" },
];

export const reporterNav = [
  { label: "Reporter Home", href: "/reporter" },
  { label: "News Desk", href: "/news" },
];

export const superAdminNav = adminNav;

export const adminSidebarNav = [
  { label: "Posts", href: "/posts", icon: "📝" },
  { label: "Pages", href: "/pages", icon: "📄" },
  { label: "Comments", href: "/comments", icon: "💬" },
  { label: "Users", href: "/users", icon: "👥" },
  { label: "Reporter Management", href: "/reporter-management", icon: "🧾" },
  { label: "Stats", href: "/analytics", icon: "📈" },
  { label: "Earnings", href: "/earnings", icon: "💰" },
  { label: "Layout", href: "/layout", icon: "🎨" },
  { label: "Theme", href: "/theme", icon: "🌈" },
  { label: "Settings", href: "/settings", icon: "⚙️" },
];

export const newsOverview = {
  metrics: [
    { label: "Published", value: "128", delta: "+12%" },
    { label: "Drafts", value: "24", delta: "+3" },
    { label: "Live editors", value: "6", delta: "Active" },
  ],
  queue: [
    { status: "Pending review", title: "Front-page politics update", note: "Waiting for editor approval." },
    { status: "Scheduled", title: "Weekend sports round-up", note: "Planned for 6:00 PM publish slot." },
    { status: "Draft", title: "City infrastructure feature", note: "Author is adding final quotes." },
  ],
};

export const sampleNews: NewsRow[] = [
  { title: "Front-page politics update", author: "Aman", category: "Politics", status: "Scheduled" },
  { title: "Weekend sports round-up", author: "Neha", category: "Sports", status: "Draft" },
  { title: "New metro expansion report", author: "Rohit", category: "India", status: "Published" },
];

export const sampleUsers: UserRow[] = [
  { name: "Super Admin", email: "admin@khabardeklo.com", role: "admin", status: "Active" },
  { name: "Neha Sharma", email: "neha@example.com", role: "editor", status: "Active" },
  { name: "Aman Verma", email: "aman@example.com", role: "author", status: "Pending" },
];

export const pageCategories = [
  { label: "Category", value: "category" },
  { label: "Footer", value: "footer" },
  { label: "Header", value: "header" },
  { label: "Menu", value: "menu" },
  { label: "Custom", value: "custom" },
  { label: "En", value: "en" },
];

export const samplePages: PageRow[] = [
  { title: "Category Page - Politics", category: "category", status: "Published", createdAt: "2024-04-10" },
  { title: "Category Page - Sports", category: "category", status: "Published", createdAt: "2024-04-09" },
  { title: "Footer - About Us", category: "footer", status: "Published", createdAt: "2024-04-08" },
  { title: "Footer - Terms & Conditions", category: "footer", status: "Draft", createdAt: "2024-04-07" },
  { title: "Header - Main Navigation", category: "header", status: "Published", createdAt: "2024-04-06" },
  { title: "Menu - Trending", category: "menu", status: "Published", createdAt: "2024-04-05" },
  { title: "Menu - Latest", category: "menu", status: "Published", createdAt: "2024-04-04" },
  { title: "Custom Page - Contact", category: "custom", status: "Published", createdAt: "2024-04-03" },
  { title: "English - Home Banner", category: "en", status: "Published", createdAt: "2024-04-02" },
  { title: "English - About", category: "en", status: "Draft", createdAt: "2024-04-01" },
];

export const superAdminCapabilities = [
  "Website header and footer management",
  "Homepage and main content layout settings",
  "User accounts and profile controls",
  "Reporter onboarding and role permissions",
  "Post and article lifecycle controls",
  "Central analytics and editorial governance",
];

export const reporterCapabilities = [
  "Create new posts and articles",
  "Edit own or assigned drafts",
  "Delete draft or unpublished content",
  "Manage article tags, category, and media",
  "Track submission and review status",
];