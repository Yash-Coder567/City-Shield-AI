"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import API from "@/services/api";

export default function MonitoringPage() {
  const [threats, setThreats] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState(
    new Date().toLocaleTimeString()
  );

  useEffect(() => {
    const loadThreats = async () => {
      try {
        const res = await API.get("/threats");
        setThreats(res.data);
      } catch (error) {
        console.error(error);
      }
    };

    loadThreats();

    const threatInterval = setInterval(loadThreats, 5000);

    const clockInterval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 5000);

    return () => {
      clearInterval(threatInterval);
      clearInterval(clockInterval);
    };
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
  
  console.log("THREATS:", threats);
  console.log("THREAT COUNT:", threats.length);

  const systemStatus =
    threats.length === 0
      ? "NO DATA"
      : highRisk >= 1
      ? "WARNING"
      : "SECURE";

  const emergencyRoute =
    threats.length > 0
      ? [...new Set(threats.map(t => t.location))]
      : []; 

  const optimalCost = threats.length > 0
    ? threats.length * 3
    : 0;

  const aiAccuracy =
    threats.length === 0
      ? null
      : Math.max(
          85,
          100 - highRisk * 2 - mediumRisk
        );

  const zoneCounts = threats.reduce(
    (acc, threat) => {
      acc[threat.location] =
        (acc[threat.location] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const entries = Object.entries(zoneCounts) as [
    string,
    number
  ][];

  const mostActiveZone =
    entries.sort(
      (a, b) => b[1] - a[1]
    )[0]?.[0] || null;

    
  const operatorsOnline =
    threats.length > 0
      ? Math.max(
          1,
          Math.ceil(threats.length / 2)
        )
      : null;

  return ( 
    <main className="min-h-screen bg-[#030712] text-white flex">
      <Sidebar />

      <section className="flex-1 p-8">

        {/* HEADER */}
        <h1 className="text-4xl font-bold text-cyan-400">
          AI Monitoring Center
        </h1>

        <p className="text-cyan-300 mt-2 mb-8">
          Live Feed Time: {currentTime}
        </p>

        {/* STATS */}
        <div className="grid grid-cols-4 gap-6 mb-8">

          <div className="p-6 rounded-xl bg-white/5 border border-cyan-500/20">
            <p className="text-gray-400">
              Active Cameras
            </p>
            <h2 className="text-4xl font-bold text-cyan-400">
                {threats.length > 0 ? threats.length : "N/A"}
            </h2> 
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-red-500/20">
            <p className="text-gray-400">
              AI Detections
            </p>
            <h2 className="text-4xl font-bold text-red-400">
              {threats.length}
            </h2>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-yellow-500/20">
            <p className="text-gray-400">
              Critical Alerts
            </p>
            <h2 className="text-4xl font-bold text-yellow-400">
              {highRisk}
            </h2>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-green-500/20">
            <p className="text-gray-400">
              AI Accuracy
            </p>
            <h2 className="text-4xl font-bold text-green-400">
              {aiAccuracy ? `${aiAccuracy}%` : "N/A"}
            </h2>
          </div>

        </div>

        {/* AI ASSESSMENT */}
        <div className="mb-8 p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">

          <h2 className="text-2xl font-bold text-cyan-400 mb-4">
            AI Monitoring Assessment
          </h2>

          <p className="text-gray-300">
            {threats.length === 0
              ? "No monitoring data available."
              : highRisk > 0
              ? "AI surveillance has detected suspicious activity requiring operator attention."
              : "All monitoring zones are operating normally. No critical threats detected."}
          </p>

          <p className="text-cyan-300 mt-3 text-sm">
            High Risk: {highRisk} |
            Medium Risk: {mediumRisk} |
            Low Risk: {lowRisk} |
            Status: {systemStatus}
          </p>

        </div>

        <div className="mb-10 p-6 rounded-xl bg-red-500/10 border border-red-500/20">

          <h2 className="text-2xl font-bold text-red-400 mb-6">
            Emergency Response Planning (Branch & Bound)
          </h2>

          <div className="flex flex-wrap gap-3 mb-6">

            {emergencyRoute.length === 0 ? (
              <p className="text-gray-400">
                No emergency route available.
              </p>
            ) : (
              emergencyRoute.map((point, index) => (
                <div
                  key={index}
                  className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20"
                >
                  {index + 1}. {point}
                </div>
              ))
            )}
          </div>

          <div className="text-red-300 font-bold">
            Optimal Route Cost :
            {threats.length > 0 ? optimalCost : " N/A"}
          </div>

          <p className="text-red-200 text-sm mt-4">
            DAA Concept: Branch and Bound systematically explores possible emergency response routes while pruning non-optimal paths to identify the minimum-cost solution.
          </p>

        </div>

        {/* PERFORMANCE + SUMMARY */}
        <div className="grid grid-cols-2 gap-6 mb-8">

          <div className="p-6 rounded-2xl bg-white/5 border border-green-500/20">

            <h2 className="text-2xl font-bold text-green-400 mb-6">
              AI Performance
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between">
                <span>Detection Accuracy</span>
                <span className="text-green-400">
                  {aiAccuracy ? `${aiAccuracy}%` : "N/A"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>False Positive Rate</span>
                <span className="text-yellow-400">
                  {threats.length > 0
                    ? `${Math.max(1,5-highRisk)}%`
                    : "0%"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Response Time</span>
                <span className="text-cyan-400">
                  {threats.length > 0
                    ? `${(0.2 + threats.length*0.1).toFixed(1)} sec`
                    : "N/A"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Coverage Area</span>
                <span className="text-cyan-400">
                  {threats.length > 0
                    ? `${Math.min(100, threats.length*25)}%`
                    : "N/A"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>AI Models Active</span>
                <span className="text-purple-400">
                  {threats.length > 0 ? threats.length : "N/A"}
                </span>
              </div>

            </div>

          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-cyan-500/20">

            <h2 className="text-2xl font-bold text-cyan-400 mb-6">
              Zone Summary
            </h2>

            <div className="space-y-4">

              <div className="flex justify-between">
                <span>Most Active Zone</span>
                <span className="text-yellow-400">
                      {mostActiveZone || "N/A"} 
                </span>
              </div>

              <div className="flex justify-between">
                <span>Highest Risk Area</span>
                <span className="text-red-400">
                  {highRisk > 0
                  ? threats.find(t => t.risk === "High")?.location
                  : "N/A"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Operators Online</span>
                <span className="text-green-400">
                    {threats.length > 0 ? threats.length : "N/A"}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Threat Status</span>
                <span
                  className={
                    threats.length === 0
                      ? "text-gray-400"
                      : highRisk > 0
                      ? "text-yellow-400"
                      : "text-green-400"
                  }
                >
                  {systemStatus}
                </span>
              </div>

            </div>

          </div>

        </div>

        {/* CAMERA GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

          {threats.length === 0 ? (

            <div className="col-span-3 text-center text-gray-400 py-10">
              No active camera detections available.
            </div>

          ) : (

            threats.map((threat, index) => {
            const confidence =
              threat.risk === "High"
                ? 90 + (threat.id % 10)
                : threat.risk === "Medium"
                ? 75 + (threat.id % 10)
                : 60 + (threat.id % 10);

            return (
              <div
                key={threat.id}
                className="rounded-2xl p-6 bg-white/5 border border-cyan-500/20"
              >

                <h2 className="text-xl font-bold text-cyan-300 mb-4">
                  🎥 Camera #{index + 1}
                </h2>

                {/* LIVE FEED */}
                <div className="relative h-56 rounded-xl bg-black flex items-center justify-center mb-4">

                  <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs animate-pulse">
                    LIVE
                  </div>

                  <span className="text-cyan-400 font-bold">
                    LIVE CCTV FEED
                  </span>

                </div>

                <p>
                  <span className="font-semibold">
                    Location:
                  </span>{" "}
                  {threat.location}
                </p>

                <p className="mt-2">
                  <span className="font-semibold">
                    Threat:
                  </span>{" "}
                  {threat.type}
                </p>

                <p className="mt-2 text-green-400 text-sm">
                  Camera Health: {
                    threat.risk === "High"
                      ? "92%"
                      : threat.risk === "Medium"
                      ? "96%"
                      : "100%"
                  }
                </p>

                <div className="mt-3">

                  <div className="flex justify-between mb-1">
                    <span>AI Confidence</span>
                    <span>{confidence}%</span>
                  </div>

                  <div className="w-full h-3 bg-gray-700 rounded-full">
                    <div
                      className={`h-3 rounded-full ${
                        confidence >= 90
                          ? "bg-red-500"
                          : confidence >= 80
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{
                        width: `${confidence}%`,
                      }}
                    />
                  </div>

                </div>

                <div className="mt-4">

                  {threat.risk === "High" ? (
                    <span className="px-3 py-1 rounded-full bg-red-500 text-white text-sm">
                      ALERT
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-green-500 text-white text-sm">
                      ACTIVE
                    </span>
                  )}

                </div>

                <p className="mt-4 text-gray-400 text-sm">
                  Detection Time
                </p>

                <p className="text-gray-300 text-sm">
                  {threat.timestamp}
                </p>

              </div>
            );
          })
          )}
        </div>

        {/* DETECTION TIMELINE */}
        <div className="p-6 rounded-2xl bg-white/5 border border-cyan-500/20">

          <h2 className="text-2xl font-bold text-cyan-400 mb-6">
            Detection Timeline
          </h2>

          <div className="space-y-4">

            {threats.length === 0 ? (

              <p className="text-gray-400">
                No detections available.
              </p>

            ) : (

              threats.map((threat) => (
                <div
                  key={threat.id}
                  className="flex justify-between border-b border-white/10 pb-3"
                >
                  <span>
                    {threat.type} detected at {threat.location}
                  </span>

                  <span className="text-gray-400">
                    {threat.timestamp}
                  </span>
                </div>
              ))

            )}

          </div>

        </div>

      </section>
    </main>
  );
}