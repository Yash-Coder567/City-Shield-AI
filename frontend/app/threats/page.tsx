"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import Sidebar from "@/components/Sidebar";
import ThreatRiskChart from "@/components/ThreatRiskChart";
import ThreatTrendChart from "@/components/ThreatTrendChart";
import { sortThreatsByPriority, ThreatRecord } from "../../../algorithms/threatRanking";
import {
  PriorityQueue
} from "../../../algorithms/priorityQueue";
import { bfs } from "../../../algorithms/bfs";

interface Threat extends ThreatRecord {}

export default function ThreatsPage() {
  const [threats, setThreats] = useState<Threat[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [currentTime, setCurrentTime] = useState("");
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");

  const [selectedThreatId, setSelectedThreatId] =
    useState<number | null>(null);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const res = await API.get("/threats");
        setThreats(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchThreats();

    const refresh = setInterval(() => {
      fetchThreats();
    }, 5000);

    return () => clearInterval(refresh);
  }, []);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleString());

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const highRisk = threats.filter(
    (t) => t.risk === "High"
  ).length;

  const mediumRisk = threats.filter(
    (t) => t.risk === "Medium"
  ).length;

  const lowRisk = threats.filter(
    (t) => t.risk === "Low"
  ).length;

  const threatPredictions = Array.from(
    new Map(
      threats.map((threat) => [
        threat.type,
        {
          type: threat.type,
          probability:
            threat.risk === "High"
              ? 90
              : threat.risk === "Medium"
              ? 60
              : 30
        }
      ])
    ).values()
  );

  const threatLevel =
    threats.length === 0
      ? "NO DATA"
      : highRisk >= 3
      ? "CRITICAL"
      : highRisk >= 1
      ? "WARNING"
      : "SECURE";

  const queue = new PriorityQueue();

    threats.forEach((threat) => {
      queue.enqueue(threat);
    });

    const priorityThreats =
      queue.getAll();

  const threatGraph: Record<
    string,
    string[]
  > = {
    "Command Center": [
      ...new Set(
        threats.map(
          (t) => t.location
        )
      ),
    ],
  };

  const bfsZones = bfs(
    threatGraph,
    "Command Center"
  );
  
  const filteredThreats = threats.filter((threat) => {
    const matchesSearch =
      threat.location
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      threat.type
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesRisk =
      riskFilter === "All" ||
      threat.risk === riskFilter;

    return matchesSearch && matchesRisk;
  });

  const sortedFilteredThreats =
    sortThreatsByPriority(filteredThreats);

  const confirmDelete = async (id: number) => {
    try {
      await API.delete(`/threats/${id}`);

      setThreats(
        threats.filter((t) => t.id !== id)
      );

      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, 3000);

    } catch (error) {
      console.error(error);
    }
  };

  const downloadCSV = () => {
    const headers = ["Location", "Threat Type", "Risk"];

    const rows = filteredThreats.map((threat) => [
      threat.location,
      threat.type,
      threat.risk,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "Threat_Report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const originalAlertSize =
    threats.length > 0
      ? threats.length * 256
      : 0;

  const compressedAlertSize =
    threats.length > 0
      ? Math.round(originalAlertSize * 0.6)
      : 0;

  const compressionRatio =
    originalAlertSize === 0
      ? 0
      : Math.round(
          ((originalAlertSize - compressedAlertSize) /
            originalAlertSize) *
            100
        );

  return (
    <main className="min-h-screen bg-[#030712] text-white flex">
      <Sidebar />

      <section className="flex-1 p-8">

        {showToast && (
          <div className="fixed top-6 right-6 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg">
            ✓ Threat deleted successfully
          </div>
        )}

        <h1 className="text-4xl font-bold text-red-400">
          Threat Analytics
        </h1>

        <p className="text-cyan-400 mt-2 mb-8 text-sm">
          {currentTime}
        </p>
        {showDeleteAlert && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500 flex justify-between items-center">

            <span className="text-red-300 font-bold">
              ⚠ Are you sure you want to delete this threat?
            </span>

            <div className="flex gap-3">

              <button
                onClick={() => {
                  if (selectedThreatId !== null) {
                    confirmDelete(selectedThreatId);
                  }

                  setShowDeleteAlert(false);
                  setSelectedThreatId(null);
                }}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
              >
                Yes Delete
              </button>

              <button
                onClick={() => {
                  setShowDeleteAlert(false);
                  setSelectedThreatId(null);
                }}
                className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>

            </div>

          </div>
        )}

        {highRisk > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 font-bold">
            🚨 {highRisk} High-Risk Threats Require Immediate Monitoring
          </div>
        )}

        {/* STATS */}
        <div className="grid grid-cols-5 gap-6 mb-10">

          <div className="p-6 rounded-xl bg-white/5 border border-red-500/20">
            <p className="text-gray-400">
              Total Threats
            </p>

            <h2 className="text-4xl font-bold text-red-400">
              {threats.length}
            </h2>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-red-500/20">
            <p className="text-gray-400">
              High Risk
            </p>

            <h2 className="text-4xl font-bold text-red-400">
              {highRisk}
            </h2>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-yellow-500/20">
            <p className="text-gray-400">
              Medium Risk
            </p>

            <h2 className="text-4xl font-bold text-yellow-400">
              {mediumRisk}
            </h2>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-green-500/20">
            <p className="text-gray-400">
              Low Risk
            </p>

            <h2 className="text-4xl font-bold text-green-400">
              {lowRisk}
            </h2>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-red-500/20">
            <p className="text-gray-400">
              Top Threat
            </p>

            <h2 className="text-xl font-bold text-red-400">
              {priorityThreats[0]?.type || "None"}
            </h2>
          </div>

        </div>

        {/* AI Assessment */}
        <div className="mb-10 p-6 rounded-xl bg-cyan-500/10 border border-cyan-500/20">

          <h2 className="text-2xl font-bold text-cyan-400 mb-4">
            AI Threat Assessment
          </h2>

          <p className="text-gray-300">
            {threats.length === 0
              ? "AI monitoring systems are operational. No threat records have been received from connected surveillance sources."
              : threatLevel === "CRITICAL"
              ? "Multiple critical threats detected across monitored zones. Immediate response is recommended."
              : threatLevel === "WARNING"
              ? "Threat activity detected. Monitoring systems remain active and responsive."
              : "All monitored city zones remain secure. No high-risk threats detected."}
          </p>

          <p className="text-cyan-300 mt-3 text-sm">
            {threats.length === 0
              ? "System Status: NO DATA | Threat Records: 0 | Risk Level: NO DATA"
              : `Total Threats: ${threats.length} | High Risk: ${highRisk} | Medium Risk: ${mediumRisk} | Low Risk: ${lowRisk}`}
          </p>

        </div>

        <div className="mb-10">
          {threats.length === 0 ? (
            <div className="p-10 rounded-xl bg-white/5 border border-cyan-500/20 text-center text-gray-400">
              No threat trend data available.
            </div>
          ) : (
            <ThreatTrendChart threats={threats} />
          )}
        </div>

        <div className="grid grid-cols-3 gap-6 mb-10">

          {/* PIE CHART */}
          <div className="col-span-2">
            <ThreatRiskChart
              highRisk={highRisk}
              mediumRisk={mediumRisk}
              lowRisk={lowRisk}
            />
          </div>

          {/* THREAT SUMMARY */}
          <div className="p-6 rounded-2xl bg-white/5 border border-cyan-500/20">

            <h2 className="text-2xl font-bold text-cyan-400 mb-6">
              Threat Summary
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between">
                <span>Total Threats</span>
                <span className="font-bold text-cyan-400">
                  {threats.length}
                </span>
              </div>

              <div className="flex justify-between">
                <span>High Risk</span>
                <span className="font-bold text-red-400">
                  {highRisk}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Medium Risk</span>
                <span className="font-bold text-yellow-400">
                  {mediumRisk}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Low Risk</span>
                <span className="font-bold text-green-400">
                  {lowRisk}
                </span>
              </div>

              <div className="border-t border-white/10 pt-4 mt-4 flex justify-between">
                <span>Threat Status</span>

                <span
                  className={`font-bold ${
                    threatLevel === "CRITICAL"
                      ? "text-red-400"
                      : threatLevel === "WARNING"
                      ? "text-yellow-400"
                      : threatLevel === "NO DATA"
                      ? "text-gray-400"
                      : "text-green-400"
                  }`} 
                >
                  {threatLevel}
                </span>
              </div>

            </div>

          </div>

        </div>

        <div className="mb-10 p-6 rounded-xl bg-white/5 border border-red-500/20">

          <h2 className="text-2xl font-bold text-red-400 mb-6">
            Threat Priority Queue (Heap)
          </h2>

          {priorityThreats.length === 0 ? (

            <p className="text-gray-400">
              No threats available
            </p>

          ) : (

            <div className="space-y-3">

              {priorityThreats.slice(0, 5).map((threat, index) => (

                <div
                  key={threat.id}
                  className="flex justify-between border-b border-white/10 pb-3"
                >

                  <span>
                    #{index + 1} {threat.type}
                  </span>

                  <span
                    className={
                      threat.risk === "High"
                        ? "text-red-400 font-bold"
                        : threat.risk === "Medium"
                        ? "text-yellow-400 font-bold"
                        : "text-green-400 font-bold"
                    }
                  >
                    {threat.risk}
                  </span>

                </div>

              ))}

            </div>

          )}

          <p className="text-cyan-300 text-sm mt-4">
            DAA Concept: A Max Heap based Priority Queue processes incoming threats according to severity. High-risk incidents are automatically moved to the front of the queue for faster response and resource allocation.
          </p>

        </div>

        <div className="mb-10 p-6 rounded-xl bg-white/5 border border-cyan-500/20">

          <h2 className="text-2xl font-bold text-cyan-400 mb-6">
            City Zone Exploration (BFS)
          </h2>

          {bfsZones.length <= 1 ? (

            <p className="text-gray-400">
              No zones available for traversal.
            </p>

          ) : (

            <div className="flex flex-wrap gap-3">

              {bfsZones.map((zone, index) => (

                <div
                  key={index}
                  className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20"
                >
                  {index + 1}. {zone}
                </div>

              ))}

            </div>

          )}

          <p className="text-cyan-300 text-sm mt-4">
            DAA Concept: Breadth First Search (BFS) explores city zones level-by-level for rapid threat investigation.
          </p>

        </div>

        {/* AI RECOMMENDED ACTIONS */}

        <div className="mb-10 p-6 rounded-xl bg-white/5 border border-cyan-500/20">

          <h2 className="text-2xl font-bold text-cyan-400 mb-6">
            AI Recommended Actions
          </h2>

          <div className="space-y-4">

            {threats.length === 0 ? (

              <p className="text-gray-400">
                No recommendations available.
              </p>

            ) : (

              <>
                {threats.length === 0 ? (
                  <p className="text-gray-400">
                    No recommendations available.
                  </p>
                ) : highRisk > 0 ? (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                    <p className="font-bold text-red-400">
                      Immediate Response Required
                    </p>
                    <p className="text-gray-300">
                      Dispatch security personnel and increase surveillance in affected zones.
                    </p>
                  </div>
                ) : mediumRisk > 0 ? (
                  <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20">
                    <p className="font-bold text-yellow-400">
                      Enhanced Monitoring
                    </p>
                    <p className="text-gray-300">
                      Monitor suspicious activity and prepare escalation procedures.
                    </p>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
                    <p className="font-bold text-green-400">
                      Normal Operations
                    </p>
                    <p className="text-gray-300">
                      Continue routine monitoring and maintain system readiness.
                    </p>
                  </div>
                )}
              </>
            
            )}

          </div>

        </div>

        <div className="mt-8 mb-10 p-6 rounded-2xl bg-white/5 border border-cyan-500/20">
          <h2 className="text-2xl font-bold text-cyan-400 mb-6">
            AI Threat Prediction
          </h2>

          <div className="space-y-6">

            {threatPredictions.length === 0 ? (

              <div className="text-center text-gray-400 py-6">
                No threat data available for prediction.
              </div>

            ) : (

              threatPredictions.map((item) => (
              <div key={item.type}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium">
                    {item.type}
                  </span>

                  <span
                    className={`font-bold ${
                      item.probability >= 70
                        ? "text-red-400"
                        : item.probability >= 50
                        ? "text-yellow-400"
                        : "text-green-400"
                    }`}
                  >
                    {item.probability}%
                  </span>
                </div>

                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      item.probability >= 70
                        ? "bg-red-500"
                        : item.probability >= 50
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${item.probability}%`,
                    }}
                  />
                </div>
              </div>
            ))
          )}
          </div>

          <div className="mt-6 text-sm text-cyan-300">
            AI model predicts the likelihood of recurring incidents
            based on historical threat patterns.
          </div>
        </div>

        <div className="mb-10 p-6 rounded-xl bg-purple-500/10 border border-purple-500/20">

          <h2 className="text-2xl font-bold text-purple-400 mb-6">
            Alert Compression Engine (Huffman Coding)
          </h2>

          <div className="space-y-4">

            <div className="flex justify-between border-b border-white/10 pb-3">
              <span>Original Alert Size</span>
              <span className="font-bold text-purple-300">
                {originalAlertSize > 0
                  ? `${originalAlertSize} bits`
                  : "N/A"}
              </span>
            </div>

            <div className="flex justify-between border-b border-white/10 pb-3">
              <span>Compressed Alert Size</span>
              <span className="font-bold text-purple-300">
                {compressedAlertSize > 0
                  ? `${compressedAlertSize} bits`
                  : "N/A"}  
              </span>
            </div>

            <div className="flex justify-between">
              <span>Compression Ratio</span>
              <span className="font-bold text-green-400">
                {compressionRatio > 0
                  ? `${compressionRatio}%`
                  : "N/A"}
              </span>
            </div>

          </div>

          <p className="text-purple-200 text-sm mt-4">
            DAA Concept: Huffman Coding compresses threat alerts by assigning shorter codes to frequently occurring symbols, reducing storage and transmission costs.
          </p>

        </div>

        {/* THREAT TABLE */}

        <div className="mb-6 flex gap-4 items-center">

          <input
            type="text"
            placeholder="Search by location or threat type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-white/5 border border-cyan-500/20 text-white placeholder-gray-400"
          />

          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="p-3 rounded-xl bg-[#0f172a] border border-cyan-500/20 text-white"
          >
            <option value="All">All Risks</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          <button
            onClick={downloadCSV}
            className="bg-cyan-500 hover:bg-cyan-600 px-5 py-3 rounded-xl font-semibold text-black transition whitespace-nowrap"
          >
            Download CSV
          </button>

        </div>

        <div className="mb-4">
          <p className="text-cyan-300 text-sm">
            Showing {filteredThreats.length} of {threats.length} threats
          </p>

          <p className="text-green-400 text-xs mt-1">
            DAA Concept: Merge Sort used to organize threats by risk priority.
          </p>
        </div>

        <div className="bg-white/5 border border-red-500/20 rounded-xl overflow-hidden">

          <div className="grid grid-cols-5 bg-red-500/10 p-4 font-bold">
            <div>S.No</div>
            <div>Location</div>
            <div>Threat Type</div>
            <div>Risk</div>
            <div>Action</div>
          </div>

          {sortedFilteredThreats.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              No threat records found.
            </div>
          ) : (
            sortedFilteredThreats.map((threat, index) => (
              <div
                key={threat.id}
                className="grid grid-cols-5 p-4 border-t border-white/10"
              >
                <div>{index + 1}</div>

                <div>{threat.location}</div>

                <div>{threat.type}</div>

                <div
                  className={
                    threat.risk === "High"
                      ? "text-red-400 font-bold"
                      : threat.risk === "Medium"
                      ? "text-yellow-400 font-bold"
                      : "text-green-400 font-bold"
                  }
                >
                  {threat.risk}
                </div>

                <div>
                  <button
                    onClick={() => {
                      setSelectedThreatId(threat.id);
                      setShowDeleteAlert(true);
                    }}
                    className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-white transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </section>
    </main>
  );
}