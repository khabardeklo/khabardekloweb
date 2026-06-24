"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { logout } from "@/lib/auth";

export function LogoutButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleLogout = async () => {
    setPending(true);

    try {
      await logout();
    } finally {
      setPending(false);
      router.push("/");
      router.refresh();
    }
  };

  return (
    <button
      className="rounded-full border border-slate-200 bg-white px-3 sm:px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-300 hover:text-emerald-700 sm:text-sm disabled:cursor-not-allowed disabled:opacity-60 min-h-10 min-w-10"
      disabled={pending}
      onClick={handleLogout}
      type="button"
    >
      {pending ? "Logging out..." : "Logout"}
    </button>
  );
}
