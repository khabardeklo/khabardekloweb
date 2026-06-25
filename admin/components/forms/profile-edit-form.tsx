"use client";

import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

import { backendUrl, backendOrigin } from "@/lib/config";

interface ProfileData {
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  title: string | null;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    website?: string;
  };
}

export function ProfileEditForm() {
  const [profile, setProfile] = useState<ProfileData>({
    name: "",
    email: "",
    avatar: "",
    bio: "",
    phone: "",
    location: "",
    title: "",
    socialLinks: {},
  });
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${backendUrl}/profile/me`, {
        credentials: "include",
      });

      if (!response.ok) throw new Error("Failed to fetch profile");

      const data = (await response.json()) as Partial<ProfileData>;
      setProfile((prev) => ({
        ...prev,
        name: data.name || prev.name || "",
        email: data.email || prev.email || "",
        avatar: data.avatar || prev.avatar || "",
        bio: data.bio || prev.bio || "",
        phone: data.phone || prev.phone || "",
        location: data.location || prev.location || "",
        title: data.title || prev.title || "",
        socialLinks: data.socialLinks || {},
      }));
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Failed to load profile",
      });
    } finally {
      setLoading(false);
    }
  };

  const readFileAsDataUrl = async (file: File): Promise<string> =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Unable to read image file"));
      reader.readAsDataURL(file);
    });

  const uploadImageData = async (imageData: string, fileName: string, mimeType: string): Promise<string> => {
    const response = await fetch(`${backendUrl}/uploads/image`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageData, fileName, mimeType }),
    });

    const data = (await response.json().catch(() => null)) as { message?: string; url?: string } | null;

    if (!response.ok || !data?.url) {
      throw new Error(data?.message || "Image upload failed");
    }

    return data.url.startsWith("http") ? data.url : `${backendOrigin}${data.url}`;
  };

  const handleAvatarChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const dataUrl = await readFileAsDataUrl(file);
      const imageUrl = await uploadImageData(dataUrl, file.name, file.type);
      setProfile((prev) => ({ ...prev, avatar: imageUrl }));
      setMessage({ type: "success", text: "Avatar uploaded successfully" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Upload failed",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (platform: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch(`${backendUrl}/profile/me`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update profile");
      }

      setMessage({ type: "success", text: "Profile updated successfully" });
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "Update failed",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center rounded-3xl border border-slate-200 bg-white p-6 py-20">
        <div className="text-slate-600">Loading profile...</div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Avatar Section */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-950">Profile Picture</h2>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
          {profile.avatar && (
            <img
              src={profile.avatar}
              alt="Avatar"
              className="h-32 w-32 rounded-2xl border-2 border-slate-200 object-cover"
            />
          )}
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Upload Photo
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={uploading}
              title="Upload profile photo"
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm"
            />
            <p className="mt-1 text-xs text-slate-500">Max 5MB, JPG or PNG</p>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-950">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Full Name</label>
            <input
              type="text"
              name="name"
              value={profile.name || ""}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-slate-50"
              placeholder="Your full name"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              value={profile.email || ""}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-slate-50"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Professional Title</label>
            <input
              type="text"
              name="title"
              value={profile.title || ""}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-slate-50"
              placeholder="e.g., Senior Reporter, Editor"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Location</label>
            <input
              type="text"
              name="location"
              value={profile.location || ""}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-slate-50"
              placeholder="City, Country"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Phone</label>
            <input
              type="tel"
              name="phone"
              value={profile.phone || ""}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-slate-50"
              placeholder="+1 (555) 000-0000"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">Bio / About</label>
            <textarea
              name="bio"
              value={profile.bio || ""}
              onChange={handleInputChange}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-slate-50"
              placeholder="Tell readers about yourself..."
              rows={4}
            />
            <p className="mt-1 text-xs text-slate-500">
              {(profile.bio || "").length}/500 characters
            </p>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold text-slate-950">Social Media Links</h2>
        <div className="space-y-4">
          {[
            { platform: "twitter", label: "Twitter/X", icon: "𝕏" },
            { platform: "facebook", label: "Facebook", icon: "f" },
            { platform: "instagram", label: "Instagram", icon: "📷" },
            { platform: "linkedin", label: "LinkedIn", icon: "in" },
            { platform: "youtube", label: "YouTube", icon: "▶" },
            { platform: "website", label: "Personal Website", icon: "🌐" },
          ].map(({ platform, label, icon }) => (
            <div key={platform}>
              <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <span className="text-lg">{icon}</span>
                {label}
              </label>
              <input
                type="url"
                placeholder={`https://${platform}.com/yourprofile`}
                value={(profile.socialLinks as Record<string, string>)[platform] || ""}
                onChange={(e) => handleSocialChange(platform, e.target.value)}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-sky-400 focus:bg-slate-50"
              />
            </div>
          ))}
        </div>
      </div>

      {message && (
        <div
          className={`rounded-2xl px-4 py-3 text-sm font-medium ${
            message.type === "success"
              ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border border-rose-200 bg-rose-50 text-rose-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <Button
        type="submit"
        disabled={submitting || uploading}
        className="bg-sky-600 text-white hover:bg-sky-700"
      >
        {submitting ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
}
