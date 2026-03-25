"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RescueForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    animalType: "Dog",
    condition: "Injured — Needs Urgent Care",
    location: "",
    city: "Dhaka",
    description: "",
    urgency: "MEDIUM",
  });

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/rescue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        router.refresh();
        setForm({ animalType: "Dog", condition: "Injured — Needs Urgent Care", location: "", city: "Dhaka", description: "", urgency: "MEDIUM" });
        alert("Rescue request submitted! A team will respond shortly.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-forest-400/70 mb-1.5">Animal Type</label>
          <select value={form.animalType} onChange={(e) => set("animalType", e.target.value)}
            className="w-full bg-cream-100 border border-forest-500/15 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-forest-500/40">
            <option>Dog</option><option>Cat</option><option>Bird</option><option>Other</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-forest-400/70 mb-1.5">Urgency</label>
          <select value={form.urgency} onChange={(e) => set("urgency", e.target.value)}
            className="w-full bg-cream-100 border border-forest-500/15 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-forest-500/40">
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-forest-400/70 mb-1.5">Condition</label>
        <select value={form.condition} onChange={(e) => set("condition", e.target.value)}
          className="w-full bg-cream-100 border border-forest-500/15 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-forest-500/40">
          <option>Injured — Needs Urgent Care</option>
          <option>Stray — Seems Healthy</option>
          <option>Abandoned Pet</option>
          <option>Aggressive / Dangerous</option>
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-forest-400/70 mb-1.5">Location / Landmark</label>
        <input required value={form.location} onChange={(e) => set("location", e.target.value)}
          placeholder="e.g. Near Farmgate flyover, Dhaka"
          className="w-full bg-cream-100 border border-forest-500/15 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-forest-500/40" />
      </div>
      <div>
        <label className="block text-xs font-medium text-forest-400/70 mb-1.5">City</label>
        <input value={form.city} onChange={(e) => set("city", e.target.value)}
          className="w-full bg-cream-100 border border-forest-500/15 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-forest-500/40" />
      </div>
      <div>
        <label className="block text-xs font-medium text-forest-400/70 mb-1.5">Additional Details</label>
        <textarea value={form.description} onChange={(e) => set("description", e.target.value)}
          rows={3} placeholder="Describe the animal and situation..."
          className="w-full bg-cream-100 border border-forest-500/15 rounded-xl px-3 py-2.5 text-sm text-gray-900 outline-none focus:border-forest-500/40 resize-none" />
      </div>
      <button type="submit" disabled={loading}
        className="w-full bg-forest-500 text-white py-3 rounded-xl text-sm font-medium hover:bg-forest-400 transition-all disabled:opacity-60">
        {loading ? "Submitting..." : "Submit Rescue Request"}
      </button>
    </form>
  );
}
