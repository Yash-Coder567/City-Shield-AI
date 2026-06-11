"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import API from "@/services/api";

export default function AdminPage() {

  const [threats, setThreats] = useState<any[]>([]);
  const [trafficZones, setTrafficZones] = useState<any[]>([]);
  const [blockchainLogs, setBlockchainLogs] = useState<any[]>([]);
  
  const [type, setType] = useState("");
  const [location, setLocation] = useState("");
  const [risk, setRisk] = useState("");

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [zone, setZone] = useState("");
  const [congestion, setCongestion] = useState("");
  
  const loadData = async () => {
    try {
      const threatsRes = await API.get("/threats");
      const trafficRes = await API.get("/traffic");
      const blockchainRes = await API.get("/blockchain");

      setThreats(threatsRes.data);
      setTrafficZones(trafficRes.data);
      setBlockchainLogs(blockchainRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadData();

    const refresh = setInterval(() => {
      loadData();
    }, 5000);

    return () => clearInterval(refresh);
  }, []);

  const highRiskThreats = threats.filter(
    (t) => t.risk === "High"
  ).length;

  const monitoringHealth =
    threats.length > 0 ? 98 : 0;

  const analyticsHealth =
    threats.length > 0 ? 96 : 0;

  const blockchainHealth =
    blockchainLogs.length > 0 ? 100 : 0;

  const trafficHealth =
    trafficZones.length > 0 ? 94 : 0;

  const handleAddThreat = async () => {
    if (!type || !location || !lat || !lng || !risk) {
      alert("Please fill all fields");
      return;
    }

    try {
      await API.post("/threats", {
        type,
        location,
        risk,
        lat: Number(lat),
        lng: Number(lng),
        timestamp: new Date().toISOString(),
      });

      const blockchainRecord = {
        event: "Threat Logged",
        hash:
          "0x" +
          Math.random()
            .toString(16)
            .substring(2, 10)
            .toUpperCase(),
        status: "Verified",
        threatType: type,
        location,
        timestamp: new Date().toISOString(),
      };

      await API.post("/blockchain", blockchainRecord);

      await loadData();

      alert("Threat Added Successfully");

      setType("");
      setLocation("");
      setRisk("");
      setLat("");
      setLng("");
    } catch (error) {
      console.error(error);
      alert("Failed to add threat");
    }
  };

  const handleAddTraffic = async () => {
    if (!zone || !congestion) {
      alert("Please fill all traffic fields");
      return;
    }

    try {
      await API.post("/traffic", {
        zone,
        congestion: Number(congestion),
      });

      await loadData();

      alert("Traffic Zone Added Successfully");

      setZone("");
      setCongestion("");
    } catch (error) {
      console.error(error);
      alert("Failed to add traffic zone");
    }
  };

  const simulateTampering = async () => {
    try {
      const blockchainRes = await API.get("/blockchain");

      const logs = blockchainRes.data;

      if (logs.length === 0) {
        alert("No blockchain records available.");
        return;
      }

      const latestLog = logs[logs.length - 1];

      await API.put(
        `/blockchain/${latestLog.id}`,
        {
          ...latestLog,
          status: "Tampered",
        }
      );

      await loadData();

      alert(
        "Blockchain integrity violation simulated."
      );
    } catch (error) {
      console.error(error);

      alert(
        "Failed to simulate blockchain tampering."
      );
    }
  };

  const generateReport = () => {
    const reportData = [
      ["Metric", "Value"],
      ["Total Threats", threats.length],
      ["High Risk Threats", highRiskThreats],
      ["Traffic Zones", trafficZones.length],
      ["Blockchain Records", blockchainLogs.length],
      ["AI Monitoring Health", `${monitoringHealth}%`],
      ["Threat Analytics Health", `${analyticsHealth}%`],
      ["Blockchain Health", `${blockchainHealth}%`],
      ["Traffic Engine Health", `${trafficHealth}%`],
    ];

    const csvContent = reportData
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "CityShield_Report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-[#030712] text-white flex">
      <Sidebar />

      <section className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-red-400 mb-8">
          Admin Control Panel
        </h1>

        <p className="text-cyan-400 mb-8">
          Real-Time Smart City Monitoring & Threat Management System
        </p>

        {/* SYSTEM OVERVIEW */}
        <div className="grid grid-cols-4 gap-6 mb-8">

          <div className="p-6 rounded-xl bg-white/5 border border-red-500/20">
            <p className="text-gray-400">Total Threats</p>
            <h2 className="text-4xl font-bold text-red-400">
              {threats.length}
            </h2>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-yellow-500/20">
            <p className="text-gray-400">High Risk Threats</p>
            <h2 className="text-4xl font-bold text-yellow-400">
              {highRiskThreats}
            </h2>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-cyan-500/20">
            <p className="text-gray-400">Traffic Zones</p>
            <h2 className="text-4xl font-bold text-cyan-400">
              {trafficZones.length}
            </h2>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-green-500/20">
            <p className="text-gray-400">Blockchain Records</p>
            <h2 className="text-4xl font-bold text-green-400">
              {blockchainLogs.length}
            </h2>
          </div>

        </div>

        {/* SYSTEM HEALTH */}
        <div className="mb-8 p-6 rounded-xl bg-white/5 border border-cyan-500/20">

          <h2 className="text-2xl font-bold text-cyan-400 mb-6">
            System Health
          </h2>

          <div className="space-y-5">

            {[
              ["AI Monitoring", threats.length > 0],
              ["Threat Analytics", threats.length > 0],
              ["Blockchain", blockchainLogs.length > 0],
              ["Traffic Engine", trafficZones.length > 0],
            ].map(([name, value]) => (

              <div key={String(name)}>

                <div className="flex justify-between mb-2">
                  <span>{name}</span>
                  <span
                    className={
                      value
                        ? "text-green-400"
                        : "text-red-400"
                    }
                  >
                    {value ? "ONLINE" : "OFFLINE"}
                  </span>
                </div>

              </div>

            ))}

          </div>

        </div>

        {/* QUICK ACTIONS */}
        <div className="grid grid-cols-4 gap-4 mb-8">

          <button
            onClick={() => window.location.reload()}
            className="p-4 rounded-xl bg-cyan-500 hover:bg-cyan-600 font-bold"
          >
            Refresh System
          </button>

          <button
            onClick={generateReport}
            className="p-4 rounded-xl bg-green-500 hover:bg-green-600 font-bold"
          >
            Generate Report
          </button>

          <button
            onClick={() => alert("Alerts Reset")}
            className="p-4 rounded-xl bg-purple-500 hover:bg-purple-600 font-bold"
          >
            Reset Alerts
          </button>

          <button
            onClick={simulateTampering}
            className="p-4 rounded-xl bg-yellow-500 hover:bg-yellow-600 font-bold text-black"
          >
            Tamper Test
          </button>

        </div>

        {/* ALGORITHM SUMMARY */}
        <div className="mb-8 p-6 rounded-xl bg-white/5 border border-green-500/20">

          <h2 className="text-2xl font-bold text-green-400 mb-6">
            Algorithm Usage Summary
          </h2>

          <div className="space-y-4">

            {trafficZones.length > 0 && (
              <div className="flex justify-between">
                <span>Dijkstra Algorithm</span>
                <span className="text-cyan-400">
                  Route Optimization
                </span>
              </div>
            )}

            {threats.length > 0 && (
              <>
                <div className="flex justify-between">
                  <span>Threat Ranking</span>
                  <span className="text-cyan-400">
                    Risk Prioritization
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>AI Classification</span>
                  <span className="text-cyan-400">
                    Threat Detection
                  </span>
                </div>
              </>
            )}

            {blockchainLogs.length > 0 && (
              <div className="flex justify-between">
                <span>Hash Verification</span>
                <span className="text-cyan-400">
                  Blockchain Integrity
                </span>
              </div>
            )}

            {threats.length === 0 &&
            trafficZones.length === 0 &&
            blockchainLogs.length === 0 && (

              <p className="text-gray-400">
                No algorithms currently active
              </p>

            )}

          </div>

        </div>

        {/* RECENT ACTIVITY */}
        <div className="mb-8 p-6 rounded-xl bg-white/5 border border-yellow-500/20">

          <h2 className="text-2xl font-bold text-yellow-400 mb-6">
            Recent Activity
          </h2>

          <div className="space-y-4">

            {threats.length === 0 ? (

              <p className="text-gray-400">
                No recent activity available
              </p>

            ) : (

              threats.slice(-5).reverse().map((threat) => (

                <div
                  key={threat.id}
                  className="border-b border-white/10 pb-3"
                >
                  {threat.type} detected at {threat.location}
                </div>

              ))

            )}

          </div>

        </div>

        <div className="grid grid-cols-2 gap-6 mt-8">

          {/* LEFT SIDE - THREAT MANAGEMENT */}
          <div className="bg-white/5 border border-red-500/20 rounded-xl p-6">

            <h2 className="text-2xl font-bold text-red-400 mb-6">
              Threat Management
            </h2>

            <div className="mb-5">
              <label className="block mb-2">
                Threat Type
              </label>

              <input
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full p-3 rounded bg-black/30 border border-white/10"
                placeholder="Drone Activity"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2">
                Location Name
              </label>

              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full p-3 rounded bg-black/30 border border-white/10"
                placeholder="Metro Station"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2">
                Latitude
              </label>

              <input
                type="number"
                step="any"
                value={lat}
                onChange={(e) => setLat(e.target.value)}
                className="w-full p-3 rounded bg-black/30 border border-white/10"
                placeholder="12.9750"
              />
            </div>

            <div className="mb-5">
              <label className="block mb-2">
                Longitude
              </label>

              <input
                type="number"
                step="any"
                value={lng}
                onChange={(e) => setLng(e.target.value)}
                className="w-full p-3 rounded bg-black/30 border border-white/10"
                placeholder="77.6050"
              />
            </div>

            <div className="mb-6">
              <label className="block mb-2">
                Risk Level
              </label>

              <select
                value={risk}
                onChange={(e) => setRisk(e.target.value)}
                className="w-full p-3 rounded bg-black/30 border border-white/10"
              >
                <option value="" disabled>
                  Select Risk Level
                </option>

                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>
              </select>
            </div>

            <button
              onClick={handleAddThreat}
              className="w-full py-3 rounded-xl bg-red-500 hover:bg-red-600 transition-all font-bold mb-6"
            >
              Add Threat
            </button>

            <div className="border-t border-white/10 pt-6">

              <h2 className="text-2xl font-bold text-cyan-400 mb-4">
                Traffic Management
              </h2>

              <div className="mb-5">
                <label className="block mb-2">
                  Zone Name
                </label>

                <input
                  value={zone}
                  onChange={(e) => setZone(e.target.value)}
                  className="w-full p-3 rounded bg-black/30 border border-white/10"
                  placeholder="Silk Board"
                />
              </div>

              <div className="mb-5">
                <label className="block mb-2">
                  Congestion (%)
                </label>

                <input
                  type="number"
                  value={congestion}
                  onChange={(e) => setCongestion(e.target.value)}
                  className="w-full p-3 rounded bg-black/30 border border-white/10"
                  placeholder="85"
                />
              </div>

              <button
                onClick={handleAddTraffic}
                className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 transition-all font-bold mb-6"
              >
                Add Traffic Zone
              </button>

              <button
                onClick={simulateTampering}
                className="w-full py-3 rounded-xl bg-yellow-500 hover:bg-yellow-600 transition-all font-bold text-black"
              >
                Simulate Blockchain Tampering
              </button>

            </div>

          </div>

          {/* RIGHT SIDE - SYSTEM STATUS */}
          <div className="bg-white/5 border border-cyan-500/20 rounded-xl p-6 self-start">

            <h2 className="text-2xl font-bold text-cyan-400 mb-6">
              System Status
            </h2>

            <div className="space-y-5">

              <div className="flex justify-between">
                <span>Total Threats</span>
                <span className="font-bold text-red-400">
                  {threats.length}
                </span>
              </div>

              <div className="flex justify-between">
                <span>High Risk Threats</span>
                <span className="font-bold text-yellow-400">
                  {highRiskThreats}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Traffic Zones</span>
                <span className="font-bold text-cyan-400">
                  {trafficZones.length}
                </span>
              </div>

              <div className="flex justify-between">
                <span>Blockchain Records</span>
                <span className="font-bold text-green-400">
                  {blockchainLogs.length}
                </span>
              </div>

              <div className="border-t border-white/10 pt-5">

                <div className="flex justify-between mb-3">
                  <span>AI Monitoring</span>
                  <span className={monitoringHealth ? "text-green-400" : "text-red-400"}>
                    {monitoringHealth ? "ONLINE" : "OFFLINE"}
                  </span>
                </div>

                <div className="flex justify-between mb-3">
                  <span>Threat Analytics</span>
                  <span className={analyticsHealth ? "text-green-400" : "text-red-400"}>
                    {analyticsHealth ? "ONLINE" : "OFFLINE"}
                  </span>
                </div>

                <div className="flex justify-between mb-3">
                  <span>Blockchain Engine</span>
                  <span className={blockchainHealth ? "text-green-400" : "text-red-400"}>
                    {blockchainHealth ? "ONLINE" : "OFFLINE"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span>Traffic Engine</span>
                  <span className={trafficHealth ? "text-green-400" : "text-red-400"}>
                    {trafficHealth ? "ONLINE" : "OFFLINE"}
                  </span>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>
    </main>
  );
}