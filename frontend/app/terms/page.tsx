import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service | Khabar Deklo", description: "Terms of Service for Khabar Deklo." };

const TERMS = [
  { title: "Acceptance of Terms", content: "By accessing or using Khabar Deklo, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service." },
  { title: "Use of Content", content: "All content published on Khabar Deklo — including articles, images, videos, and graphics — is protected by copyright. You may not reproduce, distribute, or commercially exploit any content without prior written permission." },
  { title: "User Conduct", content: "You agree not to use our platform for any unlawful purpose, to transmit spam or malicious content, to impersonate any person or entity, or to interfere with the proper functioning of the website." },
  { title: "User-Submitted Content", content: "If you submit news tips, comments, or other content, you grant Khabar Deklo a non-exclusive, royalty-free license to use, publish, and display such content. You are solely responsible for content you submit." },
  { title: "Accuracy of Information", content: "While we strive for accuracy, Khabar Deklo does not warrant the completeness or accuracy of any information. News is provided for general informational purposes only and should not be relied upon as professional advice." },
  { title: "Third-Party Links", content: "Our platform may contain links to third-party websites. These links are provided for convenience only. Khabar Deklo has no control over the content of those sites and accepts no responsibility for them." },
  { title: "Limitation of Liability", content: "To the maximum extent permitted by law, Khabar Deklo shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of our services." },
  { title: "Changes to Terms", content: "We reserve the right to modify these Terms at any time. Continued use of the platform after changes constitutes acceptance of the new terms. We will post the updated terms with a new effective date." },
  { title: "Governing Law", content: "These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of New Delhi." },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800 py-16 sm:py-24">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <span className="mb-3 inline-block rounded-full bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-300">Legal</span>
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl" style={{ fontFamily: "'Poppins',sans-serif" }}>Terms of Service</h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-slate-400">Effective Date: January 1, 2024 · Last Updated: December 2024</p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-2xl border border-amber-100 bg-amber-50 p-5">
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>Please read carefully.</strong> These terms govern your use of Khabar Deklo. By using this site, you accept these terms in full.
          </p>
        </div>

        <div className="space-y-5">
          {TERMS.map((term, i) => (
            <div key={term.title} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white">{i + 1}</span>
                <h2 className="text-[17px] font-bold text-slate-900">{term.title}</h2>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{term.content}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl border border-slate-200 bg-slate-50 p-6 text-center">
          <p className="text-sm text-slate-600">Questions about these terms?</p>
          <a href="/contact" className="mt-2 inline-flex items-center gap-1.5 text-sm font-bold text-sky-600 hover:text-sky-700">
            Contact Us
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </a>
        </div>
      </div>
    </main>
  );
}
