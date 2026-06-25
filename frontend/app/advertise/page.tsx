"use client";

import { useState } from "react";

const AD_PACKAGES = [
  {
    name: "Starter",
    price: "₹5,000",
    period: "/month",
    highlight: false,
    features: ["Banner Ad — Homepage", "50,000 impressions/month", "Basic analytics report", "Email support"],
  },
  {
    name: "Growth",
    price: "₹15,000",
    period: "/month",
    highlight: true,
    features: ["Banner + Article Ads", "2,00,000 impressions/month", "Weekly analytics report", "Priority support", "Social media mention"],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    highlight: false,
    features: ["Full-site takeover options", "Sponsored articles", "Custom impression targets", "Dedicated account manager", "Co-branded campaigns"],
  },
];

export default function AdvertisePage() {
  const [form, setForm] = useState({ name: "", company: "", email: "", phone: "", package: "Growth", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-violet-900 via-indigo-900 to-slate-900 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(circle at 25% 55%, rgba(139,92,246,0.2) 0%, transparent 55%), radial-gradient(circle at 80% 25%, rgba(99,102,241,0.18) 0%, transparent 55%)" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-violet-500/20 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-violet-300 ring-1 ring-violet-500/30">
            Advertise
          </span>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl" style={{ fontFamily: "'Poppins',sans-serif" }}>
            Reach Millions of<br className="hidden sm:block" /> <span className="text-violet-400">Indian Readers</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-300 sm:text-lg">
            Advertise with Khabar Deklo and connect with over 10 million engaged news readers every month across India.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-center">
            {[["10M+", "Monthly Readers"], ["50+", "Cities Reached"], ["2", "Languages"], ["85%", "Mobile Users"]].map(([v, l]) => (
              <div key={l} className="rounded-2xl bg-white/10 px-6 py-4 backdrop-blur-sm">
                <p className="text-2xl font-black text-white">{v}</p>
                <p className="mt-0.5 text-xs text-slate-300">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Packages */}
        <div className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-black text-slate-900" style={{ fontFamily: "'Poppins',sans-serif" }}>Advertising Packages</h2>
          <div className="grid gap-6 sm:grid-cols-3">
            {AD_PACKAGES.map((pkg) => (
              <div key={pkg.name} className={`relative flex flex-col rounded-3xl border p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl ${pkg.highlight ? "border-violet-500 bg-gradient-to-br from-violet-600 to-indigo-700 text-white" : "border-slate-200 bg-white text-slate-900"}`}>
                {pkg.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-xs font-black text-amber-900">Most Popular</span>
                )}
                <h3 className={`text-xl font-black ${pkg.highlight ? "text-white" : "text-slate-900"}`}>{pkg.name}</h3>
                <div className="mt-3 flex items-end gap-1">
                  <span className={`text-4xl font-black ${pkg.highlight ? "text-white" : "text-violet-700"}`}>{pkg.price}</span>
                  {pkg.period && <span className={`mb-1 text-sm ${pkg.highlight ? "text-violet-200" : "text-slate-500"}`}>{pkg.period}</span>}
                </div>
                <ul className="mt-6 flex-1 space-y-3">
                  {pkg.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${pkg.highlight ? "text-violet-100" : "text-slate-600"}`}>
                      <svg className={`h-4 w-4 flex-shrink-0 ${pkg.highlight ? "text-violet-200" : "text-emerald-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => setForm({ ...form, package: pkg.name })}
                  className={`mt-7 rounded-xl px-5 py-2.5 text-sm font-bold transition active:scale-95 ${pkg.highlight ? "bg-white text-violet-700 hover:bg-violet-50" : "bg-violet-600 text-white hover:bg-violet-700"}`}>
                  {pkg.name === "Enterprise" ? "Contact Us" : "Get Started"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Enquiry Form */}
        <div className="mx-auto max-w-2xl rounded-3xl border border-slate-100 bg-white p-7 shadow-md sm:p-10">
          {submitted ? (
            <div className="flex flex-col items-center gap-4 py-10 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-violet-100 text-3xl">🎉</div>
              <h3 className="text-xl font-black text-slate-900">Enquiry Received!</h3>
              <p className="text-slate-500">Our advertising team will contact you within 24 hours.</p>
              <button onClick={() => setSubmitted(false)} className="mt-2 rounded-xl bg-violet-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-violet-700">
                Submit Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h2 className="text-xl font-black text-slate-900">Advertise Enquiry</h2>
                <p className="mt-1 text-sm text-slate-500">Fill in your details and we'll get back to you with a custom proposal.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Your Name</label>
                  <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full Name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Company Name</label>
                  <input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} placeholder="Your Company"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Email</label>
                  <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@company.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-slate-700">Phone</label>
                  <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Package Interested In</label>
                <select value={form.package} onChange={(e) => setForm({ ...form, package: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-violet-400">
                  {AD_PACKAGES.map((p) => <option key={p.name} value={p.name}>{p.name} — {p.price}{p.period}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-semibold text-slate-700">Additional Requirements</label>
                <textarea rows={4} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tell us about your campaign goals, target audience, or budget..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100" />
              </div>
              <button type="submit" disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-md transition hover:opacity-90 disabled:opacity-60 active:scale-[0.98]">
                {loading && <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>}
                {loading ? "Sending..." : "Submit Enquiry"}
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
