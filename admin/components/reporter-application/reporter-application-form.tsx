"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";

export function ReporterApplicationForm() {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    setPending(true);
    setMessage(null);
    setError(null);

    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") || "").trim(),
      email: String(formData.get("email") || "").trim(),
      password: String(formData.get("password") || ""),
      role: "reporter",
    };

    try {
      const response = await fetch(`${backendUrl}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = (await response.json().catch(() => null)) as { message?: string } | null;

      if (!response.ok && response.status !== 202) {
        throw new Error(data?.message || "Unable to submit reporter application");
      }

      setMessage(data?.message || "Application submitted. Wait for admin approval.");
      form.reset();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "Unable to submit reporter application");
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="grid gap-5 rounded-[2rem] border border-white/70 bg-white/85 p-4 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur-xl sm:p-5 lg:grid-cols-[0.95fr_1.05fr] lg:p-8">
      <div className="rounded-[1.5rem] bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900 p-5 text-white shadow-lg sm:p-6">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white/70 sm:text-xs">Reporter application</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight sm:mt-4 sm:text-4xl">Apply for access</h1>
        <p className="mt-3 text-sm leading-6 text-white/85">Your account stays inactive until an admin approves it. After approval, the same login becomes active immediately.</p>
        <div className="mt-5 rounded-2xl border border-white/15 bg-white/5 p-4 text-sm text-white/85">
          <p className="font-semibold text-white">What happens next</p>
          <p className="mt-2 leading-6">Submit your details, wait for approval, then use the reporter login to enter the workspace.</p>
        </div>
      </div>

      <div className="rounded-[1.5rem] border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-xl font-black text-slate-950 sm:text-2xl">Reporter application form</h2>
        <form className="mt-5 space-y-3 sm:mt-6 sm:space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white sm:text-base"
            name="name"
            placeholder="Full name"
            required
          />
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white sm:text-base"
            name="email"
            placeholder="Email address"
            type="email"
            required
          />
          <input
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 focus:bg-white sm:text-base"
            name="password"
            placeholder="Create password"
            type="password"
            required
          />
          {error ? <p className="text-sm font-medium text-rose-600">{error}</p> : null}
          {message ? <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{message}</p> : null}
          <Button
            className="w-full bg-gradient-to-r from-emerald-500 via-lime-400 to-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-70"
            disabled={pending}
            type="submit"
          >
            {pending ? "Submitting..." : "Submit application"}
          </Button>
        </form>
        <p className="mt-4 text-sm text-slate-600">
          Already approved? <Link href="/login/reporter" className="font-semibold text-emerald-700 hover:text-emerald-800">Go to reporter login</Link>
        </p>
      </div>
    </section>
  );
}