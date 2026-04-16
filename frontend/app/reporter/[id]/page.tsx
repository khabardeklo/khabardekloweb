"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

interface PublicProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  bio: string | null;
  phone: string | null;
  location: string | null;
  title: string | null;
  socialLinks: Record<string, string>;
  memberSince: string;
}

export default function ReporterProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<PublicProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, [params.id]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${backendUrl}/profile/public/${params.id}`);
      if (!response.ok) throw new Error("Profile not found");
      const data = (await response.json()) as PublicProfile;
      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-slate-600">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="mb-2 text-2xl font-bold text-slate-950">Profile not found</h1>
          <p className="text-slate-600 mb-4">{error || "This reporter does not exist"}</p>
          <Link href="/" className="text-sky-600 hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const socialPlatforms = [
    { key: "twitter", label: "Twitter", icon: "𝕏", color: "text-black hover:text-blue-500" },
    { key: "facebook", label: "Facebook", icon: "f", color: "text-blue-600 hover:text-blue-800" },
    { key: "instagram", label: "Instagram", icon: "📷", color: "text-pink-600 hover:text-pink-800" },
    { key: "linkedin", label: "LinkedIn", icon: "in", color: "text-blue-700 hover:text-blue-900" },
    { key: "youtube", label: "YouTube", icon: "▶", color: "text-red-600 hover:text-red-800" },
    { key: "website", label: "Website", icon: "🌐", color: "text-slate-600 hover:text-slate-900" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="mx-auto max-w-2xl">
        {/* Profile Card */}
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg">
          {/* Header Background */}
          <div className="h-32 bg-gradient-to-r from-sky-400 to-blue-500" />

          {/* Avatar Section */}
          <div className="relative px-6 pb-6 pt-0">
            <div className="mb-4">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="h-32 w-32 -mt-16 rounded-2xl border-4 border-white bg-slate-100 object-cover shadow-lg"
                />
              ) : (
                <div className="h-32 w-32 -mt-16 rounded-2xl border-4 border-white bg-slate-200 flex items-center justify-center text-4xl font-bold text-slate-400">
                  {profile.name.charAt(0)}
                </div>
              )}
            </div>

            {/* Profile Info */}
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-950">{profile.name}</h1>
              {profile.title && <p className="text-lg font-semibold text-sky-600">{profile.title}</p>}
              {profile.location && (
                <p className="flex items-center gap-2 text-slate-600">
                  <span>📍</span> {profile.location}
                </p>
              )}
              {profile.email && (
                <p className="flex items-center gap-2 text-slate-600">
                  <span>✉️</span>
                  <a href={`mailto:${profile.email}`} className="hover:text-sky-600 hover:underline">
                    {profile.email}
                  </a>
                </p>
              )}
              {profile.phone && (
                <p className="flex items-center gap-2 text-slate-600">
                  <span>📱</span> {profile.phone}
                </p>
              )}
              {profile.memberSince && (
                <p className="text-sm text-slate-500 pt-2">
                  Member since {new Date(profile.memberSince).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                  })}
                </p>
              )}
            </div>

            {/* Bio */}
            {profile.bio && (
              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <h2 className="mb-2 font-semibold text-slate-950">About</h2>
                <p className="whitespace-pre-wrap text-slate-700 leading-relaxed">{profile.bio}</p>
              </div>
            )}

            {/* Social Links */}
            {Object.entries(profile.socialLinks).some(([_, url]) => url) && (
              <div className="mt-6 pt-6 border-t border-slate-200">
                <h2 className="mb-4 font-semibold text-slate-950">Follow</h2>
                <div className="flex flex-wrap gap-3">
                  {socialPlatforms.map(({ key, label, icon, color }) => {
                    const url = profile.socialLinks[key];
                    if (!url) return null;

                    return (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 font-medium transition ${color}`}
                        title={label}
                      >
                        <span className="text-lg">{icon}</span>
                        <span className="text-sm">{label}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Back Link */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-sky-600 hover:underline font-medium">
            ← Back to news
          </Link>
        </div>
      </div>
    </div>
  );
}
