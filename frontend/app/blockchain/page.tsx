"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import API from "@/services/api";
import useAutoRefresh from "@/hooks/useAutoRefresh";
import BlockchainIntegrityChart from "@/components/BlockchainIntegrityChart";

export default function BlockchainPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [currentTime, setCurrentTime] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchLogs = async () => {
    try {
      const res = await API.get("/blockchain");

      const data = Array.isArray(res.data)
        ? res.data
        : [];

      setLogs(data);

    } catch (error) {
      console.error(error);
      setLogs([]);
    }
  };
  
  const clearBlockchain = async () => {
    try {
      await API.delete("/blockchain");

      setLogs([]);

    } catch (error) {
      console.error(error);
    }
  };

  useAutoRefresh(fetchLogs);

  useEffect(() => {
    setCurrentTime(new Date().toLocaleString());

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleString());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const resolveLog = async (id: number) => {
    try {
      await API.put(`/blockchain/${id}`, {
        status: "Verified",
      });

      const res = await API.get("/blockchain");

      setLogs(res.data);
    } catch (error) {
      console.error(error);
      alert("Failed to resolve record");
    }
  };

  const simulateTampering = async () => {
    try {

      const verifiedRecord = logs.find(
        (log) => log.status === "Verified"
      );

      if (!verifiedRecord) {
        alert("No verified records available.");
        return;
      }

      await API.put(`/blockchain/${verifiedRecord.id}`, {
        status: "Tampered",
      });

      const res = await API.get("/blockchain");

      setLogs(res.data);

    } catch (error) {
      console.error(error);
      alert("Failed to simulate tampering");
    }
  };

  const downloadCSV = () => {
    const headers = [
      "ID",
      "Event",
      "Threat Type",
      "Location",
      "Hash",
      "Status",
      "Time",
    ];

    const rows = filteredLogs.map((log) => [
      log.id,
      log.event,
      log.threatType,
      log.location,
      log.hash,
      log.status,
      log.timestamp,
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
    link.download = "Blockchain_Report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const verifiedLogs = logs.filter(
    (log) => log.status === "Verified"
  ).length;

  const tamperedLogs = logs.filter(
    (log) => log.status === "Tampered"
  ).length;

  const integrityScore =
    logs.length > 0
      ? Math.round((verifiedLogs / logs.length) * 100)
      : 0;
  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      (log.event || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      (log.threatType || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      (log.location || "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||

      (log.hash || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" ||
      log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <main className="min-h-screen bg-[#030712] text-white flex">
      <Sidebar />

      <section className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-green-400">
          Blockchain Security Logs
        </h1>

        <p className="text-cyan-400 mt-2 mb-8 text-sm">
          {currentTime}
        </p>

        {tamperedLogs > 0 && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/20 border border-red-500 text-red-300 font-bold">
            ⚠ Blockchain Integrity Alert: {tamperedLogs} tampered
            record(s) detected.
          </div>
        )}

        <div className="grid grid-cols-3 gap-6 mb-10">
          <div className="p-6 rounded-xl bg-white/5 border border-green-500/20">
            <p className="text-gray-400">Total Records</p>

            <h2 className="text-4xl font-bold text-green-300">
              {logs.length}
            </h2>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-green-500/20">
            <p className="text-gray-400">Verified Records</p>

            <h2 className="text-4xl font-bold text-green-400">
              {verifiedLogs}
            </h2>
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-cyan-500/20">
            <p className="text-gray-400">Integrity Score</p>

            <h2 className="text-4xl font-bold text-cyan-300">
              {logs.length === 0 ? "N/A" : `${integrityScore}%`}
            </h2>
          </div>
        </div>

        {logs.length > 0 && (
          <div className="mb-8 flex gap-4">
            <button
              onClick={simulateTampering}
              className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl font-semibold text-white"
            >
              Simulate Tampering
            </button>
          </div>
        )}

        <div className="mb-10 p-6 rounded-xl bg-green-500/10 border border-green-500/20">
          <h2 className="text-2xl font-bold text-green-400 mb-4">
            AI Security Assessment
          </h2>

          <p className="text-gray-300">
            {
              logs.length === 0
                ? "No blockchain records available."
                : tamperedLogs > 0
                ? "Blockchain integrity violation detected. Immediate verification required."
                : "Blockchain integrity remains secure. All records are verified and protected against tampering."
            }
          </p>
        </div>

        <div className="mb-10">
           
          
          {
            logs.length === 0 ? (
              <div className="p-10 text-center text-gray-400 border border-white/10 rounded-xl">
                No blockchain records available
              </div>
            ) : (
              <BlockchainIntegrityChart
                verified={verifiedLogs}
                tampered={tamperedLogs}
                integrityScore={integrityScore}
              />
            )
          }
        </div>

        <div className="mb-10 grid grid-cols-5 gap-4">

          <div className="bg-white/5 border border-green-500/20 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Chain Status</p>
            <p className="text-green-400 font-bold text-xl">
              {
                logs.length === 0
                  ? "NO DATA"
                  : tamperedLogs > 0
                  ? "WARNING"
                  : "SECURE"
              }
            </p>
          </div>

          <div className="bg-white/5 border border-cyan-500/20 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Latest Block</p>
            <p className="text-cyan-400 font-bold text-xl">
              {logs.length > 0 ? `#${logs.length}` : "#0"}
            </p>
          </div>

          <div className="bg-white/5 border border-purple-500/20 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Verification Rate</p>
            <p className="text-purple-400 font-bold text-xl">
              {logs.length === 0 ? "N/A" : `${integrityScore}%`}
            </p>
          </div>

          <div className="bg-white/5 border border-yellow-500/20 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Hash Consistency</p>
            <p className="text-yellow-400 font-bold text-xl">
              {
                logs.length === 0
                  ? "N/A"
                  : tamperedLogs > 0
                  ? "FAIL"
                  : "PASS"
              }
            </p>
          </div>

          <div className="bg-white/5 border border-red-500/20 rounded-xl p-4">
            <p className="text-gray-400 text-sm">Network Nodes</p>
            <p className="text-red-400 font-bold text-xl">
              {logs.length}
            </p>
          </div>

        </div>

        <div className="mb-10 bg-white/5 border border-green-500/20 rounded-xl p-6">

          <h2 className="text-2xl font-bold text-green-400 mb-4">
            Blockchain Strength
          </h2>

          <div className="w-full h-6 bg-gray-700 rounded-full overflow-hidden">

            <div
              className="h-full bg-green-500"
              style={{
                width: `${integrityScore}%`,
              }}
            />

          </div>

          <p className="mt-3 text-green-300">
            {
              logs.length === 0
                ? "No blockchain records available"
                : `Network Security Strength: ${integrityScore}%`
            }
          </p>
        </div>

        <div className="mb-10 p-6 rounded-xl bg-cyan-500/10 border border-cyan-500/20">

          <h2 className="text-2xl font-bold text-cyan-400 mb-4">
            AI Blockchain Analysis
          </h2>

          <div className="space-y-3">

            <div className="flex justify-between">
              <span>Tampering Probability</span>

              <span className="text-red-400">
                {
                  logs.length === 0
                    ? "N/A"
                    : tamperedLogs > 0
                    ? "15%"
                    : "2%"
                }
              </span>
            </div>

            <div className="flex justify-between">
              <span>Security Rating</span>
              <span className="text-green-400">
                {
                  logs.length === 0
                    ? "N/A"
                    : integrityScore >= 90
                    ? "A+"
                    : "B+"
                }
              </span>
            </div>

            <div className="flex justify-between">
              <span>Recommendation</span>
              <span className="text-cyan-400">
                {
                  logs.length === 0
                    ? "No Blockchain Records"
                    : tamperedLogs > 0
                    ? "Verify Records"
                    : "Continue Monitoring"
                }
              </span>
            </div>

          </div>

        </div>

        <div className="mb-10 bg-white/5 border border-green-500/20 rounded-xl p-6">

          <h2 className="text-2xl font-bold text-green-400 mb-6">
            Blockchain Audit Trail
          </h2>

          <div className="space-y-5">
            {logs.length === 0 && (
              <p className="text-gray-400">
                No blockchain audit records available
              </p>
            )}

            {logs.slice(0, 5).map((log) => (

              <div
                key={log.id}
                className="flex justify-between items-start border-b border-white/10 pb-4"
              >

                <div className="flex gap-4">

                  <div className="mt-1">
                    <div
                      className={`w-4 h-4 rounded-full ${
                        log.status === "Verified"
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    />
                  </div>

                  <div>

                    <p className="font-semibold text-white text-lg">
                      🔗 {log.event}
                    </p>

                    <p className="text-gray-400 text-sm mt-1">
                      Threat Type: {log.threatType}
                    </p>

                    <p className="text-gray-400 text-sm">
                      Location: {log.location}
                    </p>

                    <p className="text-gray-500 text-xs mt-1">
                      {log.timestamp
                        ? new Date(log.timestamp).toLocaleString()
                        : "-"}
                    </p>

                  </div>

                </div>

                <div
                  className={`font-bold ${
                    log.status === "Verified"
                      ? "text-green-400"
                      : "text-red-400"
                  }`}
                >
                  {log.status === "Verified"
                    ? "✓ Verified"
                    : "⚠ Tampered"}
                </div>

              </div>

            ))}

          </div>

        </div>

        <div className="mb-6 flex gap-4 items-center">

          <input
            type="text"
            placeholder="Search event, threat type, location or hash..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 p-3 rounded-xl bg-white/5 border border-green-500/20 text-white placeholder-gray-400"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-3 rounded-xl bg-[#0f172a] border border-green-500/20 text-white"
          >
            <option value="All">All Status</option>
            <option value="Verified">Verified</option>
            <option value="Tampered">Tampered</option>
          </select>

          <button
            onClick={downloadCSV}
            disabled={logs.length === 0}
            className={`px-5 py-3 rounded-xl font-semibold transition whitespace-nowrap ${
              logs.length === 0
                ? "bg-gray-600 cursor-not-allowed text-gray-300"
                : "bg-green-500 hover:bg-green-600 text-black"
            }`}
          >
            Download CSV
          </button>
          
          <button
            onClick={clearBlockchain}
            disabled={logs.length === 0}
            className={`px-5 py-3 rounded-xl font-semibold whitespace-nowrap ${
              logs.length === 0
                ? "bg-gray-600 text-gray-300 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            Clear Records
          </button>

        </div>

        <p className="text-green-300 text-sm mb-4">
          Showing {filteredLogs.length} of {logs.length} records
        </p>

        <div className="bg-white/5 border border-green-500/20 rounded-xl overflow-hidden">
          <div className="grid grid-cols-8 bg-green-500/10 p-4 font-bold">
            <div>ID</div>
            <div>Event</div>
            <div>Threat Type</div>
            <div>Location</div>
            <div>Hash</div>
            <div>Status</div>
            <div>Time</div>
            <div>Action</div>
          </div>

          {filteredLogs.map((log, index) => (
            <div
              key={log.id}
              className="grid grid-cols-8 p-4 border-t border-white/10"
            >
              <div>{index + 1}</div>

              <div>🔗 {log.event}</div>

              <div>{log.threatType || "-"}</div>

              <div>{log.location || "-"}</div>

              <div className="text-gray-400 truncate">
                {log.hash}
              </div>

              <div
                className={
                  log.status === "Verified"
                    ? "text-green-400 font-bold"
                    : "text-red-400 font-bold"
                }
              >
                {log.status === "Verified"
                  ? "✓ Verified"
                  : "⚠ Tampered"}
              </div>

              <div className="text-sm">
                {log.timestamp
                  ? new Date(log.timestamp).toLocaleString()
                  : "-"}
              </div>

              <div>
                {log.status === "Tampered" && (
                  <button
                    onClick={() => resolveLog(log.id)}
                    className="px-3 py-1 bg-green-500 hover:bg-green-600 rounded-lg text-sm"
                  >
                    Resolve
                  </button>
        
                )}
              </div>
            </div>
          ))}
          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              No blockchain records found
            </div>
          )}
        </div>
      </section>
    </main>
  );
}