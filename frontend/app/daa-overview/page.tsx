"use client";

import Sidebar from "@/components/Sidebar";

const algorithms = [
  {
    name: "Merge Sort",
    module: "Threat Analytics",
    purpose: "Risk Sorting",
    complexity: "O(n log n)",
  },
  {
    name: "BFS",
    module: "Threat Analytics",
    purpose: "Zone Exploration",
    complexity: "O(V+E)",
  },
  {
    name: "Priority Queue",
    module: "Threat Analytics",
    purpose: "Threat Prioritization",
    complexity: "O(log n)",
  },
  {
    name: "Huffman Coding",
    module: "Threat Analytics",
    purpose: "Alert Compression",
    complexity: "O(n log n)",
  },
  {
    name: "Dijkstra",
    module: "Smart Traffic",
    purpose: "Route Optimization",
    complexity: "O(E log V)",
  },
  {
    name: "Floyd-Warshall",
    module: "Smart Traffic",
    purpose: "Shortest Paths",
    complexity: "O(V³)",
  },
  {
    name: "Kruskal MST",
    module: "Smart Traffic",
    purpose: "Network Optimization",
    complexity: "O(E log E)",
  },
  {
    name: "Activity Selection",
    module: "Smart Traffic",
    purpose: "Signal Scheduling",
    complexity: "O(n log n)",
  },
  {
    name: "Knapsack",
    module: "Smart Traffic",
    purpose: "Resource Allocation",
    complexity: "O(nW)",
  },
  {
    name: "Branch & Bound",
    module: "AI Monitoring",
    purpose: "Emergency Planning",
    complexity: "Pruned Exponential",
  },
];

export default function DAAOverview() {
  return (

    <main className="min-h-screen bg-[#030712] text-white flex">
      <Sidebar />

      <section className="flex-1 p-8">

        <h1 className="text-4xl font-bold text-cyan-400 mb-2">
          DAA Overview
        </h1>

        <p className="text-gray-400 mb-8">
          Design and Analysis of Algorithms used in CityShield AI
        </p>

        <div className="mb-8 p-6 rounded-xl bg-cyan-500/10 border border-cyan-500/20">

            <h2 className="text-2xl font-bold text-cyan-400 mb-3">
                Project Algorithm Summary
            </h2>

            <p className="text-gray-300">
                CityShield AI integrates 10 Design and Analysis of Algorithms
                across AI Monitoring, Threat Analytics, Smart Traffic,
                Blockchain Security, and Emergency Response modules.
            </p>

            <div className="mt-4 text-cyan-300 font-semibold">
                Total Algorithms Implemented: 10
            </div>

        </div>

        <div className="bg-white/5 border border-cyan-500/20 rounded-xl overflow-hidden">

          <div className="grid grid-cols-4 bg-cyan-500/10 p-4 font-bold">
            <div>Algorithm</div>
            <div>Module</div>
            <div>Purpose</div>
            <div>Complexity</div>
          </div>

          {algorithms.map((algo, index) => (
            <div
              key={index}
              className="grid grid-cols-4 p-4 border-t border-white/10"
            >
              <div>{algo.name}</div>
              <div>{algo.module}</div>
              <div>{algo.purpose}</div>
              <div className="text-cyan-300">
                {algo.complexity}
              </div>
            </div>
          ))}

        </div>

      </section>
    </main>
  );
}