import type { Metadata } from "next";

export const metadata: Metadata = { title: "About Us | Khabar Deklo", description: "Learn about Khabar Deklo — India's trusted bilingual news platform." };

const TEAM = [
  { name: "Ravi Kumar", role: "Editor-in-Chief", avatar: "RK" },
  { name: "Priya Sharma", role: "Senior Reporter", avatar: "PS" },
  { name: "Amit Singh", role: "Tech Editor", avatar: "AS" },
  { name: "Neha Gupta", role: "Content Lead", avatar: "NG" },
];

const VALUES = [
  { icon: "🎯", title: "Accuracy First", desc: "Every story is fact-checked before publishing." },
  { icon: "⚡", title: "Speed & Depth", desc: "Breaking news delivered fast, with full context." },
  { icon: "🌐", title: "Bilingual", desc: "Serving readers in both Hindi and English." },
  { icon: "🔒", title: "Independent", desc: "No corporate or political bias — ever." },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 to-sky-950 py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(circle at 20% 50%, rgba(14,165,233,0.15) 0%, transparent 60%)" }} />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-black tracking-tight text-white sm:text-6xl" style={{ fontFamily: "'Poppins',sans-serif" }}>
            About <span className="text-sky-400">Khabar Deklo</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-slate-400 sm:text-lg">
            India's trusted bilingual news platform — delivering accurate, fast, and independent journalism since 2020.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {/* Mission */}
        <div className="mb-16 grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="mb-3 inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-widest text-sky-700">Our Mission</span>
            <h2 className="text-3xl font-black text-slate-900" style={{ fontFamily: "'Poppins',sans-serif" }}>
              Keeping India informed, one story at a time.
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Khabar Deklo was founded with a single purpose: to bring credible, unbiased news to every Indian citizen — in the language they are most comfortable with. We cover politics, business, sports, entertainment, technology, health and more.
            </p>
            <p className="mt-3 text-base leading-relaxed text-slate-600">
              Our team of experienced journalists and reporters work around the clock to ensure you never miss what matters most.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <span className="text-3xl">{v.icon}</span>
                <h3 className="mt-3 font-bold text-slate-900">{v.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { value: "10M+", label: "Monthly Readers" },
            { value: "500+", label: "Articles Published" },
            { value: "50+", label: "Expert Reporters" },
            { value: "2", label: "Languages" },
          ].map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 p-6 text-center border border-sky-100">
              <p className="text-3xl font-black text-sky-700" style={{ fontFamily: "'Poppins',sans-serif" }}>{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div>
          <h2 className="mb-8 text-2xl font-black text-slate-900" style={{ fontFamily: "'Poppins',sans-serif" }}>Meet the Team</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map((member) => (
              <div key={member.name} className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-6 shadow-sm text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-blue-600 text-xl font-black text-white shadow-md">
                  {member.avatar}
                </div>
                <h3 className="mt-4 font-bold text-slate-900">{member.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
