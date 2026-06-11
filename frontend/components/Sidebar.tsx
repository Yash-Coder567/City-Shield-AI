"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-[260px] bg-black/40 border-r border-cyan-500/20 p-6">

      <h1 className="text-3xl font-bold text-cyan-400 mb-10">
        CityShield AI
      </h1>

      <nav className="space-y-4">

        <Link href="/dashboard">
          <div className="p-4 rounded-xl hover:bg-white/5 cursor-pointer transition-all">
            Dashboard
          </div>
        </Link>

        <Link href="/monitoring">
          <div className="p-4 rounded-xl hover:bg-white/5 cursor-pointer transition-all">
            AI Monitoring
          </div>
        </Link>

        <Link href="/threats">
          <div className="p-4 rounded-xl hover:bg-white/5 cursor-pointer transition-all">
            Threat Analytics
          </div>
        </Link>

        <Link href="/blockchain">
          <div className="p-4 rounded-xl hover:bg-white/5 cursor-pointer transition-all">
            Blockchain Logs
          </div>
        </Link>

        <Link href="/traffic">
          <div className="p-4 rounded-xl hover:bg-white/5 cursor-pointer transition-all">
            Smart Traffic
          </div>
        </Link>

        <Link href="/daa-overview">
          <div className="p-4 rounded-xl hover:bg-white/5 cursor-pointer transition-all">
            DAA Overview
          </div>
        </Link>

        <Link href="/admin">
        <div className="p-4 rounded-xl hover:bg-white/5 cursor-pointer transition-all">
            Admin Panel
        </div>
        </Link>

      </nav>

    </aside>
  );
}