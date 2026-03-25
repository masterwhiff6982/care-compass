import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import RescueForm from "@/components/rescue/RescueForm";
import { AlertTriangle, Clock } from "lucide-react";

export default async function RescuePage() {
  const recentReports = await prisma.rescueReport.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { reporter: { select: { name: true } } },
  });

  const organizations = await prisma.serviceProvider.findMany({
    where: { type: "RESCUE", isActive: true },
    take: 4,
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-3xl font-bold text-gray-900">Animal Rescue Network</h1>
        <p className="text-sm text-forest-400/60 mt-1">Report injured or stray animals. Our network responds 24/7.</p>
      </div>

      {/* Emergency banner */}
      <div className="bg-forest-500 rounded-2xl p-6 mb-6 flex items-center gap-5">
        <div className="text-5xl flex-shrink-0">🚨</div>
        <div className="flex-1">
          <h2 className="font-display text-xl font-bold text-white mb-1">Emergency Rescue Hotline</h2>
          <p className="text-sm text-white/70">For life-threatening situations, call our 24/7 emergency line immediately.</p>
        </div>
        <a href="tel:01700732783" className="bg-forest-100 text-forest-500 px-6 py-3 rounded-xl font-semibold text-sm hover:bg-white transition-colors flex-shrink-0">
          Call Now
        </a>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Report form */}
        <div>
          <div className="bg-white border border-forest-500/10 rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold mb-5">Report an Animal</h2>
            <RescueForm />
          </div>
        </div>

        {/* Right side */}
        <div className="space-y-5">
          {/* Active organizations */}
          <div className="bg-white border border-forest-500/10 rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold mb-4">Active Rescue Organizations</h2>
            {organizations.length === 0 ? (
              <p className="text-sm text-forest-400/60">No organizations listed yet.</p>
            ) : (
              <div className="space-y-3">
                {organizations.map((org) => (
                  <div key={org.id} className="flex items-center gap-3 p-3 bg-cream-100 rounded-xl">
                    <div className="w-9 h-9 bg-forest-50 rounded-lg flex items-center justify-center text-lg flex-shrink-0">🏥</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">{org.name}</div>
                      <div className="text-xs text-forest-400/60">{org.city} · {org.phone}</div>
                    </div>
                    <span className="text-[10px] font-medium bg-forest-100 text-forest-500 px-2.5 py-1 rounded-full">Active</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent reports */}
          <div className="bg-white border border-forest-500/10 rounded-2xl p-6">
            <h2 className="font-display text-lg font-semibold mb-4">Recent Reports</h2>
            {recentReports.length === 0 ? (
              <p className="text-sm text-forest-400/60">No recent reports.</p>
            ) : (
              <div className="space-y-3">
                {recentReports.map((r) => (
                  <div key={r.id} className="flex items-start gap-3 p-3 bg-cream-100 rounded-xl">
                    <div className="text-xl flex-shrink-0">{ANIMAL_EMOJI[r.animalType] ?? "🐾"}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {r.animalType} — {r.location}
                      </div>
                      <div className="text-xs text-forest-400/60 mt-0.5">{r.condition}</div>
                      <div className="flex items-center gap-1 mt-1 text-[10px] text-forest-400/40">
                        <Clock className="w-3 h-3" />
                        {new Date(r.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${URGENCY_STYLE[r.urgency]}`}>
                      {r.urgency}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const ANIMAL_EMOJI: Record<string, string> = { Dog: "🐕", Cat: "🐈", Bird: "🦜", Other: "🐾" };
const URGENCY_STYLE: Record<string, string> = {
  LOW: "bg-forest-100 text-forest-500",
  MEDIUM: "bg-amber-light text-amber-dark",
  HIGH: "bg-clay-light text-clay",
  CRITICAL: "bg-red-100 text-red-600",
};
