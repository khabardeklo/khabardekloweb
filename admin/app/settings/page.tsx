import { AdminShell } from "@/components/layout/admin-shell";
import { ProfileEditForm } from "@/components/forms/profile-edit-form";
import { AdBannerManager } from "@/components/forms/ad-banner-manager";

export default function SettingsPage() {
  return (
    <AdminShell title="Settings" subtitle="Manage your profile and account preferences.">
      <div className="grid gap-6">
        <ProfileEditForm />
        <AdBannerManager />
      </div>
    </AdminShell>
  );
}