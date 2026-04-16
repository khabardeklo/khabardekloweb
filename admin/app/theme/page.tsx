import { AdminShell } from "@/components/layout/admin-shell";

export default function ThemePage() {
  return (
    <AdminShell title="Theme" subtitle="Customize colors, fonts, and visual design.">
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center">
        <p className="text-slate-600">Theme customization coming soon...</p>
      </div>
    </AdminShell>
  );
}
