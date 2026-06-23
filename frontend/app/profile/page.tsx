"use client";

import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";

const backendUrl =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "http://localhost:5000/api";

const backendOrigin = backendUrl.replace(/\/api$/, "");

type ProfileData = {
  id?: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  phone: string;
  location: string;
  title: string;
  role?: string;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    website?: string;
  };
};

const SOCIAL_PLATFORMS = [
  { key: "twitter", label: "Twitter/X", icon: "𝕏" },
  { key: "facebook", label: "Facebook", icon: "f" },
  { key: "instagram", label: "Instagram", icon: "📷" },
  { key: "linkedin", label: "LinkedIn", icon: "in" },
  { key: "youtube", label: "YouTube", icon: "▶" },
  { key: "website", label: "Website", icon: "🌐" },
];

const empty: ProfileData = {
  name: "", email: "", avatar: "", bio: "", phone: "",
  location: "", title: "", socialLinks: {},
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(empty);
  const [loading, setLoading] = useState(true);
  const [unauthenticated, setUnauthenticated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch(`${backendUrl}/profile/me`, { credentials: "include" })
      .then((r) => {
        if (r.status === 401) { setUnauthenticated(true); return null; }
        return r.ok ? r.json() : null;
      })
      .then((data: Partial<ProfileData> | null) => {
        if (data) {
          setProfile({
            id: (data as { id?: string }).id,
            name: data.name ?? "",
            email: data.email ?? "",
            avatar: data.avatar ?? "",
            bio: data.bio ?? "",
            phone: data.phone ?? "",
            location: data.location ?? "",
            title: data.title ?? "",
            role: data.role,
            socialLinks: data.socialLinks ?? {},
          });
        }
      })
      .catch(() => setUnauthenticated(true))
      .finally(() => setLoading(false));
  }, []);

  const handleInput = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocial = (key: string, value: string) => {
    setProfile((prev) => ({ ...prev, socialLinks: { ...prev.socialLinks, [key]: value } }));
  };

  const handleAvatar = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await new Promise<string>((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(String(reader.result));
        reader.onerror = () => rej(new Error("Read failed"));
        reader.readAsDataURL(file);
      });
      const resp = await fetch(`${backendUrl}/uploads/image`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageData: dataUrl, fileName: file.name, mimeType: file.type }),
      });
      const data = (await resp.json().catch(() => null)) as { url?: string; message?: string } | null;
      if (!resp.ok || !data?.url) throw new Error(data?.message ?? "Upload failed");
      const url = data.url.startsWith("http") ? data.url : `${backendOrigin}${data.url}`;
      setProfile((prev) => ({ ...prev, avatar: url }));
      setMessage({ type: "success", text: "Avatar uploaded" });
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Upload failed" });
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);
    try {
      const resp = await fetch(`${backendUrl}/profile/me`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = (await resp.json().catch(() => null)) as { message?: string } | null;
      if (!resp.ok) throw new Error(data?.message ?? "Update failed");
      setMessage({ type: "success", text: "Profile updated successfully" });
      setEditing(false);
    } catch (err) {
      setMessage({ type: "error", text: err instanceof Error ? err.message : "Update failed" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p className="text-slate-600">Loading profile...</p>
      </main>
    );
  }

  if (unauthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-4 text-center">
        <h1 className="text-2xl font-black text-slate-950">Sign in to view your profile</h1>
        <p className="text-slate-600">You need to be logged in to access this page.</p>
        <Link
          href="/"
          className="mt-2 inline-flex items-center gap-2 rounded-full bg-sky-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
        >
          ← Back to home
        </Link>
      </main>
    );
  }

  const activeSocials = SOCIAL_PLATFORMS.filter(
    ({ key }) => (profile.socialLinks as Record<string, string>)[key]
  );

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        {/* View Card */}
        {!editing && (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="h-28 bg-gradient-to-r from-sky-400 to-blue-500" />
            <div className="px-6 pb-8 pt-0">
              <div className="flex items-end justify-between">
                {profile.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="h-24 w-24 -mt-12 rounded-2xl border-4 border-white object-cover shadow"
                  />
                ) : (
                  <div className="flex h-24 w-24 -mt-12 items-center justify-center rounded-2xl border-4 border-white bg-slate-200 text-3xl font-bold text-slate-400 shadow">
                    {profile.name.charAt(0) || "?"}
                  </div>
                )}
                <button
                  onClick={() => { setEditing(true); setMessage(null); }}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
                >
                  Edit Profile
                </button>
              </div>

              <div className="mt-4 space-y-1">
                <h1 className="text-2xl font-black text-slate-950">{profile.name || "—"}</h1>
                {profile.title && <p className="font-semibold text-sky-600">{profile.title}</p>}
                {profile.role && (
                  <span className="inline-block rounded-full bg-slate-100 px-3 py-0.5 text-xs font-bold uppercase tracking-wide text-slate-600">
                    {profile.role}
                  </span>
                )}
                {profile.location && (
                  <p className="flex items-center gap-2 pt-1 text-sm text-slate-600">
                    <span>📍</span> {profile.location}
                  </p>
                )}
                {profile.email && (
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <span>✉️</span>
                    <a href={`mailto:${profile.email}`} className="hover:text-sky-600 hover:underline">
                      {profile.email}
                    </a>
                  </p>
                )}
                {profile.phone && (
                  <p className="flex items-center gap-2 text-sm text-slate-600">
                    <span>📱</span> {profile.phone}
                  </p>
                )}
              </div>

              {profile.bio && (
                <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-500">About</p>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{profile.bio}</p>
                </div>
              )}

              {activeSocials.length > 0 && (
                <div className="mt-5 border-t border-slate-100 pt-5">
                  <p className="mb-3 text-xs font-bold uppercase tracking-wide text-slate-500">Social</p>
                  <div className="flex flex-wrap gap-2">
                    {activeSocials.map(({ key, label, icon }) => (
                      <a
                        key={key}
                        href={(profile.socialLinks as Record<string, string>)[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-sky-300 hover:text-sky-700"
                        title={label}
                      >
                        <span>{icon}</span>
                        <span>{label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Edit Form */}
        {editing && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-950">Edit Profile</h2>
              <button
                type="button"
                onClick={() => { setEditing(false); setMessage(null); }}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
              >
                Cancel
              </button>
            </div>

            {/* Avatar */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-3 text-sm font-bold text-slate-700">Profile Photo</p>
              <div className="flex items-center gap-4">
                {profile.avatar ? (
                  <img src={profile.avatar} alt="Avatar" className="h-16 w-16 rounded-xl object-cover" />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-slate-200 text-2xl font-bold text-slate-400">
                    {profile.name.charAt(0) || "?"}
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatar}
                  disabled={uploading}
                  title="Upload photo"
                  className="text-sm"
                />
              </div>
            </div>

            {/* Basic info */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-4 text-sm font-bold text-slate-700">Basic Information</p>
              <div className="space-y-3">
                {(
                  [
                    { name: "name", label: "Full Name", type: "text", placeholder: "Your name" },
                    { name: "email", label: "Email", type: "email", placeholder: "you@email.com" },
                    { name: "title", label: "Professional Title", type: "text", placeholder: "e.g. Senior Reporter" },
                    { name: "location", label: "Location", type: "text", placeholder: "City, Country" },
                    { name: "phone", label: "Phone", type: "tel", placeholder: "+91 00000 00000" },
                  ] as { name: keyof ProfileData; label: string; type: string; placeholder: string }[]
                ).map(({ name, label, type, placeholder }) => (
                  <div key={name}>
                    <label className="mb-1 block text-xs font-semibold text-slate-600">{label}</label>
                    <input
                      type={type}
                      name={name}
                      value={(profile[name] as string) || ""}
                      onChange={handleInput}
                      placeholder={placeholder}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400"
                    />
                  </div>
                ))}
                <div>
                  <label className="mb-1 block text-xs font-semibold text-slate-600">Bio</label>
                  <textarea
                    name="bio"
                    value={profile.bio || ""}
                    onChange={handleInput}
                    rows={4}
                    placeholder="Tell readers about yourself..."
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400"
                  />
                </div>
              </div>
            </div>

            {/* Social links */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <p className="mb-4 text-sm font-bold text-slate-700">Social Links</p>
              <div className="space-y-3">
                {SOCIAL_PLATFORMS.map(({ key, label, icon }) => (
                  <div key={key}>
                    <label className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                      <span>{icon}</span> {label}
                    </label>
                    <input
                      type="url"
                      value={(profile.socialLinks as Record<string, string>)[key] || ""}
                      onChange={(e) => handleSocial(key, e.target.value)}
                      placeholder={`https://${key}.com/yourprofile`}
                      className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm outline-none focus:border-sky-400"
                    />
                  </div>
                ))}
              </div>
            </div>

            {message && (
              <div
                className={`rounded-xl px-4 py-3 text-sm font-medium ${
                  message.type === "success"
                    ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border border-rose-200 bg-rose-50 text-rose-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || uploading}
              className="w-full rounded-xl bg-sky-600 py-3 text-sm font-bold text-white transition hover:bg-sky-700 disabled:opacity-60"
            >
              {submitting ? "Saving..." : "Save Profile"}
            </button>
          </form>
        )}

        {message && !editing && (
          <div
            className={`mt-4 rounded-xl px-4 py-3 text-sm font-medium ${
              message.type === "success"
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : "border border-rose-200 bg-rose-50 text-rose-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/" className="text-sm font-medium text-sky-600 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
