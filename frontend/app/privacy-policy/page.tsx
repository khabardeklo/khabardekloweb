import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy | Khabar Deklo", description: "Privacy Policy for Khabar Deklo — how we collect, use, and protect your data." };

const SECTIONS = [
  {
    title: "Information We Collect",
    content: "We collect information you provide directly (name, email when subscribing to newsletter), and information collected automatically (IP address, browser type, pages visited, time spent on pages) through cookies and similar technologies.",
  },
  {
    title: "How We Use Your Information",
    content: "We use the information to deliver news content, personalize your experience, send newsletters (if subscribed), analyze site traffic to improve our service, and comply with legal obligations.",
  },
  {
    title: "Cookies",
    content: "We use cookies to remember your language preference, analyze traffic via analytics tools, and serve relevant advertisements. You may disable cookies in your browser settings; however, some features may not function correctly.",
  },
  {
    title: "Third-Party Services",
    content: "We may use third-party analytics providers (e.g., Google Analytics) and advertising networks. These services have their own privacy policies. We do not sell your personal data to third parties.",
  },
  {
    title: "Data Retention",
    content: "We retain personal data only as long as necessary to fulfill the purposes outlined in this policy, or as required by law. Newsletter subscriber data is retained until you unsubscribe.",
  },
  {
    title: "Your Rights",
    content: "You have the right to access, correct, or delete your personal data. To exercise these rights, contact us at privacy@khabardeklo.com. We will respond within 30 days.",
  },
  {
    title: "Children's Privacy",
    content: "Our services are not directed to children under 13. We do not knowingly collect personal information from children. If you believe we have collected data from a child, please contact us immediately.",
  },
  {
    title: "Changes to This Policy",
    content: "We may update this Privacy Policy periodically. We will notify you of significant changes by posting the new policy on this page with an updated effective date.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 py-16 sm:py-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="mb-3 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-300">Legal</span>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl" style={{ fontFamily: "'Poppins',sans-serif" }}>Privacy Policy</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-400">Effective Date: January 1, 2024 · Last Updated: December 2024</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl border border-sky-100 bg-sky-50 p-5">
          <p className="text-sm text-sky-800 leading-relaxed">
            <strong>Summary:</strong> Khabar Deklo respects your privacy. We collect minimal data, never sell your information, and give you control over your data. Read below for full details.
          </p>
        </div>

        <div className="space-y-6">
          {SECTIONS.map((section, i) => (
            <div key={section.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">{i + 1}</span>
                <h2 className="text-[17px] font-bold text-slate-900">{section.title}</h2>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{section.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
          <p className="text-sm text-slate-600">Questions about this policy?</p>
          <a href="/contact" className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700">
            Contact our Privacy Team
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>
      </div>
    </main>
  );
}
