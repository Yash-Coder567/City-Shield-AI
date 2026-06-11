    "use client";

    import { motion } from "framer-motion";
    import { useEffect, useState } from "react";
    import CityMap from "../../components/CityMap";
    import API from "@/services/api";
    import Link from "next/link";
    import AIAssistant from "../../components/AIAssistant";
    import AlertPanel from "../../components/AlertPanel";
    import AnalyticsChart from "@/components/AnalyticsChart";
    import Sidebar from "@/components/Sidebar";

    export default function Dashboard() {
      const [backendThreats, setBackendThreats] = useState<any[]>([]);
      const validThreats = backendThreats.filter(
        (threat) =>
          threat.lat !== undefined &&
          threat.lng !== undefined
      );
      const [trafficData, setTrafficData] = useState<any[]>([]);
      const [blockchainLogs, setBlockchainLogs] = useState<any[]>([]);

      const [cameras, setCameras] = useState(248);
      const [currentTime, setCurrentTime] = useState("");

      // Camera animation
      useEffect(() => { 
        const interval = setInterval(() => {
          setCameras((prev) =>
            Math.max(200, prev + Math.floor(Math.random() * 10 - 5))
          );
        }, 3000);
      
        return () => clearInterval(interval);
      }, []);
      useEffect(() => {
        setCurrentTime(new Date().toLocaleString());

        const timer = setInterval(() => {
          setCurrentTime(new Date().toLocaleString());
        }, 1000);

        return () => clearInterval(timer);
      }, []);

      // Backend API Fetch
      useEffect(() => {
        const fetchData = async () => {
          try {
            const threatsRes = await API.get("/threats");
            const trafficRes = await API.get("/traffic");

            setBackendThreats(threatsRes.data);

            setTrafficData(trafficRes.data);

            const blockchainRes = await API.get("/blockchain");
            setBlockchainLogs(blockchainRes.data);

          } catch (error) {
            console.error("Backend Error:", error);
          }
        };

        fetchData();

          const refresh = setInterval(() => {
            fetchData();
          }, 5000);

          return () => clearInterval(refresh);

          }, []);

      const highRiskThreats = backendThreats.filter(
        (threat) => threat.risk === "High"
      ).length;

      const verifiedRecords = blockchainLogs.filter(
        (log) => log.status === "Verified"
      ).length;

      const blockchainIntegrity =
        blockchainLogs.length > 0
          ? Math.round(
              (verifiedRecords / blockchainLogs.length) * 100
            )
          : null;
          
      const systemStatus =
        backendThreats.length === 0 &&
        blockchainLogs.length === 0 &&
        trafficData.length === 0
          ? "NO DATA"
          : highRiskThreats >= 3
          ? "CRITICAL"
          : highRiskThreats >= 1
          ? "WARNING"
          : "SECURE";

      const averageCongestion =
        trafficData.length > 0
          ? Math.round(
              trafficData.reduce(
                (sum, item) => sum + item.congestion,
                0
              ) / trafficData.length
            )
          : 0;

      const trafficEfficiency = 100 - averageCongestion;
      const trafficStatus =
        trafficData.length === 0
          ? "NO DATA"
          : trafficEfficiency >= 70
          ? "Smooth"
          : trafficEfficiency >= 40
          ? "Moderate"
          : "Congested";

      return (
        <main className="min-h-screen bg-[#030712] text-white flex">

          <Sidebar />

          {/* MAIN CONTENT */}
          <section className="flex-1 p-8">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-10">

              <div>
                <h2 className="text-4xl font-bold">
                  AI Command Center
                </h2>

                <p className="text-gray-400 mt-2">
                  Real-time Smart City Intelligence Dashboard
                </p>

                <p className="text-cyan-400 mt-2 text-sm">
                  {currentTime}
                </p>
              </div>

              <div className="flex items-center gap-3">

                <div
                  className={`w-3 h-3 rounded-full ${
                    systemStatus === "CRITICAL"
                      ? "bg-red-500 animate-pulse"
                      : systemStatus === "WARNING"
                      ? "bg-yellow-400 animate-pulse"
                      : systemStatus === "NO DATA"
                      ? "bg-gray-500"
                      : "bg-green-400 animate-pulse"
                  }`}
                ></div>

                <span
                  className={`uppercase tracking-widest text-sm ${
                    systemStatus === "CRITICAL"
                      ? "text-red-400"
                      : systemStatus === "WARNING"
                      ? "text-yellow-400"
                      : systemStatus === "NO DATA"
                      ? "text-gray-400"
                      : "text-green-300"
                  }`}
                >
                  {systemStatus}
                </span>

              </div>

            </div>

            {highRiskThreats > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 font-bold">
                🚨 {highRiskThreats} High-Risk Threat{
                  highRiskThreats > 1 ? "s" : ""
                } Require Immediate Attention
              </div>
            )}

            {/* STATS CARDS */}
            <div className="grid grid-cols-4 gap-6">

              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 30px rgba(255,0,0,0.4)",
                }}
                className="p-6 rounded-2xl bg-white/5 border border-cyan-500/20"
              >
                <h3 className="text-gray-400 mb-2">
                  Active Threats
                </h3>

                <p className="text-5xl font-bold text-red-400">
                  {backendThreats.length}
                </p>
              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 30px rgba(0,255,255,0.4)",
                }}
                className="p-6 rounded-2xl bg-white/5 border border-purple-500/20"
              >
                <h3 className="text-gray-400 mb-2">
                  Blockchain Integrity
                </h3>

                <p className="text-5xl font-bold text-cyan-300">
                  {
                    blockchainIntegrity === null
                      ? "N/A"
                      : `${blockchainIntegrity}%`
                  }
                </p>
              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 30px rgba(0,255,120,0.4)",
                }}
                className="p-6 rounded-2xl bg-white/5 border border-green-500/20"
              >
                <h3 className="text-gray-400 mb-2">
                  Verified Records
                </h3>

                <p className="text-5xl font-bold text-green-300">
                  {verifiedRecords}
                </p>
              </motion.div>

              <motion.div
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0px 0px 30px rgba(255,255,0,0.4)",
                }}
                className="p-6 rounded-2xl bg-white/5 border border-yellow-500/20"
              >
                <h3 className="text-gray-400 mb-2">
                  Traffic Status
                </h3>

                <p className="text-4xl font-bold text-yellow-300">
                  {trafficStatus}
                </p>
              </motion.div>

            </div>

            {/* AI CITY ASSESSMENT */}
            <div className="mt-8 p-6 rounded-2xl bg-cyan-500/10 border border-cyan-500/20">
              <h2 className="text-2xl font-bold text-cyan-400 mb-4">
                AI City Assessment
              </h2>

              <p className="text-gray-300">
                {
                  backendThreats.length === 0 &&
                  blockchainLogs.length === 0 &&
                  trafficData.length === 0
                    ? "No system data available."
                    : systemStatus === "CRITICAL"
                    ? "Multiple high-risk threats detected. Immediate intervention recommended."
                    : systemStatus === "WARNING"
                    ? "Threat activity detected. Monitoring systems remain active and responsive."
                    : "City infrastructure operating normally. No critical threats detected."
                }
              </p>

              <p className="text-sm text-cyan-300 mt-3">
                Active Threats: {backendThreats.length} |
                High Risk Threats: {highRiskThreats} |
                Verified Records: {verifiedRecords} |
                Traffic Status: {trafficStatus}
              </p>
            </div>

            {/* CHART */}
            <div className="mt-8">
              {
                backendThreats.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 bg-white/5 rounded-2xl border border-cyan-500/20">
                    No threat analytics available
                  </div>
                ) : (
                  <AnalyticsChart threats={backendThreats} />
                )
              }
            </div>

            <div className="grid grid-cols-2 gap-6 mt-8">

              {/* RECENT ALERTS */}
              <div className="p-6 rounded-2xl bg-white/5 border border-red-500/20">

                <h3 className="text-2xl font-bold mb-6 text-red-400">
                  Recent Alerts
                </h3>

                <div className="space-y-4">

                  {backendThreats.length === 0 && (
                    <p className="text-gray-400">
                      No recent alerts
                    </p>
                  )}

                  {backendThreats.slice(0, 5).map((threat) => (

                    <div
                      key={threat.id}
                      className="p-4 rounded-xl bg-red-500/10 border border-red-500/20"
                    >
                      <div className="font-bold">
                        {threat.type}
                      </div>

                      <div className="text-gray-400 text-sm">
                        {threat.location}
                      </div>

                      <div
                        className={`${
                          threat.risk === "High"
                            ? "text-red-400"
                            : threat.risk === "Medium"
                            ? "text-yellow-400"
                            : "text-green-400"
                        }`}
                      >
                        Risk: {threat.risk}
                      </div>
                    </div>

                  ))}

                </div>

              </div>

              {/* BLOCKCHAIN SUMMARY */}
              <div className="p-6 rounded-2xl bg-white/5 border border-green-500/20">

                <h3 className="text-2xl font-bold mb-6 text-green-400">
                  Blockchain Summary
                </h3>

                <div className="grid grid-cols-2 gap-4">

                  <div className="bg-green-500/10 p-4 rounded-xl">
                    <p className="text-gray-400 text-sm">
                      Integrity Score
                    </p>
                    <p className="text-3xl font-bold text-green-400">
                      {
                        blockchainIntegrity === null
                          ? "N/A"
                          : `${blockchainIntegrity}%`
                      }
                    </p>
                  </div>

                  <div className="bg-cyan-500/10 p-4 rounded-xl">
                    <p className="text-gray-400 text-sm">
                      Verified Records
                    </p>
                    <p className="text-3xl font-bold text-cyan-400">
                      {
                        blockchainLogs.length === 0
                          ? "N/A"
                          : verifiedRecords
                      }
                    </p>
                  </div>

                  <div className="bg-red-500/10 p-4 rounded-xl">
                    <p className="text-gray-400 text-sm">
                      Tampered Records
                    </p>
                    <p className="text-3xl font-bold text-red-400">
                      {
                        blockchainLogs.length === 0
                          ? "N/A"
                          : blockchainLogs.filter(
                              (log) => log.status === "Tampered"
                            ).length
                      }
                    </p>
                  </div>

                  <div className="bg-purple-500/10 p-4 rounded-xl">
                    <p className="text-gray-400 text-sm">
                      Total Records
                    </p>
                    <p className="text-3xl font-bold text-purple-400">
                      {blockchainLogs.length}
                    </p>
                  </div>

                </div>

              </div>

            </div>

            <div className="mt-8">
              <CityMap threats={validThreats} />
            </div>

            {/* ALERT PANEL */}
            <AlertPanel alerts={backendThreats} />

          </section>

          <AIAssistant />

        </main>
      );
    }