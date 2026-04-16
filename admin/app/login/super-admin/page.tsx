"use client";

import Link from "next/link";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { loginWithRole } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function SuperAdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setPending(true);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    try {
      await loginWithRole("admin", email, password);
      router.push("/dashboard");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Login failed");
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.22),_transparent_32%),radial-gradient(circle_at_right,_rgba(16,185,129,0.22),_transparent_28%),linear-gradient(180deg,#eff6ff_0%,#ffffff_46%,#f0fdf4_100%)]">
      <div className="pointer-events-none absolute left-[-6rem] top-[-4rem] h-40 w-40 rounded-full bg-blue-400/30 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute right-[-5rem] top-24 h-52 w-52 rounded-full bg-emerald-400/30 blur-3xl animate-pulse [animation-delay:1s]" />
      <div className="pointer-events-none absolute bottom-[-5rem] left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-cyan-300/30 blur-3xl animate-pulse [animation-delay:2s]" />
      <SiteHeader />
      <main className="relative mx-auto flex w-full max-w-4xl items-center px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:min-h-[calc(100vh-140px)]">
        <section className="grid w-full gap-5 rounded-[2rem] border border-white/70 bg-white/85 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-5 lg:grid-cols-[0.9fr_1.1fr] lg:p-8">
          <div className="rounded-[1.5rem] bg-gradient-to-br from-blue-600 via-cyan-500 to-emerald-400 p-5 text-white shadow-lg sm:p-6">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/80 sm:text-xs">Super Admin</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight sm:mt-4 sm:text-4xl">Login</h1>
            <p className="mt-2 text-sm leading-6 text-white/90">Full access role.</p>
          </div>

          <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="text-xl font-black text-slate-950 sm:text-2xl">Sign in</h2>
            <form className="mt-5 space-y-3 sm:mt-6 sm:space-y-4" onSubmit={handleSubmit}>
              <div>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white sm:text-base"
                  id="admin-email"
                  name="email"
                  placeholder="Admin email"
                  type="email"
                />
              </div>
              <div>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:bg-white sm:text-base"
                  id="admin-password"
                  name="password"
                  placeholder="Password"
                  type="password"
                />
              </div>
              {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
              <button
                className="inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-400 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
                disabled={pending}
                type="submit"
              >
                {pending ? "Signing in..." : "Continue"}
              </button>
            </form>
            <Link href="/dashboard" className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:text-blue-800 sm:mt-4">
              Dashboard preview
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
