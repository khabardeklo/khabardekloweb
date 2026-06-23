import { AdminShell } from "@/components/layout/admin-shell";
import { ProfileEditForm } from "@/components/forms/profile-edit-form";
import { AdBannerManager } from "@/components/forms/ad-banner-manager";
import { SiteControlForm } from "@/components/forms/site-control-form";

export default function SettingsPage() {
  return (
    <AdminShell title="Settings" subtitle="Manage profile, ads, layout, and global site controls.">
      <div className="grid gap-6">
        <SiteControlForm mode="full" />
        <ProfileEditForm />
        <AdBannerManager />
      </div>
    </AdminShell>
  );
}