"use client";

import { useEffect, useState } from "react";
import API from "@/services/api";
import Sidebar from "@/components/Sidebar";
import { dijkstra } from "../../../algorithms/dijkstra";
import { kruskal } from "../../../algorithms/kruskal";
import { floydWarshall }
from "../../../algorithms/floydWarshall";
import {
  activitySelection,
} from "../../../algorithms/activitySelection";
import { knapsack } from "../../../algorithms/knapsack";

export default function TrafficPage() {
  const [trafficData, setTrafficData] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [loading, setLoading] = useState(true);

  const [showDeleteAlert, setShowDeleteAlert] =
    useState(false);

  const [selectedTrafficId, setSelectedTrafficId] =
    useState<number | null>(null);

  useEffect(() => {
    const fetchTraffic = async () => {
      try {
        const res = await API.get("/traffic");

        setTrafficData(res.data);

        setLastUpdated(
          new Date().toLocaleTimeString()
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTraffic();

    const interval = setInterval(fetchTraffic, 5000);

    return () => clearInterval(interval);
  }, []);

  const averageCongestion =
    trafficData.length > 0
      ? Math.round(
          trafficData.reduce(
            (sum, item) => sum + item.congestion,
            0
          ) / trafficData.length
        )
      : 0;

  const highCongestion = trafficData.filter(
    (item) => item.congestion >= 70
  ).length;

  const trafficStatus =
    trafficData.length === 0
      ? "NO DATA"
      : averageCongestion >= 70
      ? "CONGESTED"
      : averageCongestion >= 40
      ? "MODERATE"
      : "SMOOTH";

  const rankedZones = [...trafficData].sort(
    (a, b) => b.congestion - a.congestion
  );

  const cityNodes = trafficData.map(
    (item) => item.zone
  );

  const trafficGraph: Record<
    string,
    Record<string, number>
  > = {};

  cityNodes.forEach((zone, index) => {
    trafficGraph[zone] = {};

    if (index > 0) {
      trafficGraph[zone][cityNodes[index - 1]] =
        Math.abs(
          trafficData[index].congestion -
          trafficData[index - 1].congestion
        );
    }

    if (index < cityNodes.length - 1) {
      trafficGraph[zone][cityNodes[index + 1]] =
        Math.abs(
          trafficData[index].congestion -
          trafficData[index + 1].congestion
        );
    }


  });

  const routeResult =
    cityNodes.length >= 2
      ? dijkstra(
          trafficGraph,
          cityNodes[0],
          cityNodes[cityNodes.length - 1]
        )
      : null;

  const prediction =
    averageCongestion >= 70
      ? "AI predicts severe traffic congestion across multiple zones. Immediate traffic diversion is recommended."
      : averageCongestion >= 40
      ? "AI predicts moderate traffic buildup during peak hours. Traffic flow remains manageable."
      : "AI predicts smooth traffic flow with minimal congestion expected.";

  const deleteTraffic = async (id: number) => {
    try {
      await API.delete(`/traffic/${id}`);

      setTrafficData(
        trafficData.filter(
          (item) => item.id !== id
        )
      );

      setShowDeleteAlert(false);
      setSelectedTrafficId(null);

    } catch (error) {
      console.error(error);
    }
  };

  const graphMatrix = cityNodes.map(
    (_, i) =>
      cityNodes.map((_, j) => {
        if (i === j) return 0;

        if (Math.abs(i - j) === 1) {
          return Math.abs(
            trafficData[i].congestion -
            trafficData[j].congestion
          );
        }

        return 999;
      })
  );

  const shortestPaths =
    graphMatrix.length > 0
      ? floydWarshall(graphMatrix)
      : [];

  const graphEdges = cityNodes
    .slice(0, cityNodes.length - 1)
    .map((zone, index) => ({
      from: zone,
      to: cityNodes[index + 1],
      weight: Math.abs(
        trafficData[index]?.congestion -
        trafficData[index + 1]?.congestion
      ),
    }));

  const mstEdges =
    trafficData.length > 0
      ? kruskal(cityNodes, graphEdges)
      : [];

  const totalMSTCost = mstEdges.reduce(
    (sum, edge) => sum + edge.weight,
    0
  );

  const signalSchedules = trafficData.map(
    (zone, index) => ({
      zone: zone.zone,
      start: index * 2 + 1,
      end: index * 2 + 3,
    })
  );

  const selectedSignals =
    activitySelection(signalSchedules);

  const emergencyResources =
    trafficData.map((item) => ({
      zone: item.zone,
      value: item.congestion,
      cost: Math.ceil(
        item.congestion / 20
      ),
  }));

  const knapsackCapacity = 10;

  const selectedResources =
    knapsack(
      emergencyResources,
      knapsackCapacity
    );

  const totalValue =
    selectedResources.reduce(
      (sum, item) => sum + item.value,
      0
    );

  const totalCost =
    selectedResources.reduce(
      (sum, item) => sum + item.cost,
      0
    );

  return (
    <main className="min-h-screen bg-[#030712] text-white flex">
      <Sidebar />

      <section className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-cyan-400 mb-2">
          Smart Traffic Monitoring
        </h1>

        <div className="flex items-center justify-between mb-8">
          <p className="text-gray-400">
            Last Updated: {lastUpdated}
          </p>

          <div
            className={`flex items-center gap-2 font-semibold ${
              trafficData.length > 0
                ? "text-green-400"
                : "text-red-400"
            }`}
          >
            <span
              className={`w-3 h-3 rounded-full ${
                trafficData.length > 0
                  ? "bg-green-400 animate-pulse"
                  : "bg-red-400"
              }`}
            ></span>

            {trafficData.length > 0
              ? "LIVE"
              : "OFFLINE"}
          </div>
        </div>

        {loading ? (
          <div className="text-center text-gray-400 text-xl mt-20">
            Loading Traffic Data...
          </div>
        ) : (
          <>
            {/* STATS */}
            <div className="grid grid-cols-4 gap-6 mb-10">
              <div className="p-6 rounded-xl bg-white/5 border border-cyan-500/20">
                <p className="text-gray-400">
                  Total Zones
                </p>

                <h2 className="text-4xl font-bold text-cyan-300">
                  {trafficData.length}
                </h2>
              </div>

              <div className="p-6 rounded-xl bg-white/5 border border-yellow-500/20">
                <p className="text-gray-400">
                  Average Congestion
                </p>

                <h2 className="text-4xl font-bold text-yellow-300">
                  {trafficData.length === 0
                    ? "N/A"
                    : `${averageCongestion}%`}
                </h2>
              </div>

              <div className="p-6 rounded-xl bg-white/5 border border-red-500/20">
                <p className="text-gray-400">
                  High Congestion Zones
                </p>

                <h2 className="text-4xl font-bold text-red-400">
                  {trafficData.length === 0
                  ? "N/A"
                  : highCongestion}
                </h2>
              </div>

              <div className="p-6 rounded-xl bg-white/5 border border-green-500/20">
                <p className="text-gray-400">
                  Traffic Status
                </p>

                <h2
                  className={`text-4xl font-bold ${
                    trafficStatus === "CONGESTED"
                      ? "text-red-400"
                      : trafficStatus === "MODERATE"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }`}
                >
                  {
                    trafficData.length === 0
                      ? "NO DATA"
                      : trafficStatus
                  }
                </h2>
              </div>
            </div>

            <div className="mb-10 p-6 rounded-xl bg-cyan-500/10 border border-cyan-500/20">

            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              AI Traffic Assessment
            </h2>

            <p className="text-gray-300">
              {
                trafficData.length === 0
                  ? "No traffic data available."
                  : prediction
              }
            </p>

            <p className="text-cyan-300 mt-3 text-sm">
              {
                trafficData.length === 0
                  ? "No traffic zones available."
                  : `Total Zones: ${trafficData.length} | Average Congestion: ${averageCongestion}% | High Congestion Zones: ${highCongestion} | Status: ${trafficStatus}`
              }
            </p>

          </div>

          <div className="mb-10 p-6 rounded-xl bg-white/5 border border-yellow-500/20">

            <h2 className="text-2xl font-bold text-yellow-400 mb-6">
              Congestion Ranking
            </h2>
          
            <div className="space-y-4">

              {trafficData.length === 0 ? (
                <p className="text-gray-400">
                  No congestion data available
                </p>
              ) : (
                rankedZones.map((zone, index) => (
                  <div
                    key={index}
                    className="flex justify-between border-b border-white/10 pb-3"
                  >
                    <span>
                      #{index + 1} {zone.zone}
                    </span>

                    <span
                      className={
                        zone.congestion >= 70
                          ? "text-red-400"
                          : zone.congestion >= 40
                          ? "text-yellow-400"
                          : "text-green-400"
                      }
                    >
                      {zone.congestion}%
                    </span>
                  </div>
                ))
              )}

            </div>

          </div>

          <div className="mb-10 p-6 rounded-xl bg-white/5 border border-cyan-500/20">

            <h2 className="text-2xl font-bold text-cyan-400 mb-6">
              AI Recommended Actions
            </h2>

            <div className="space-y-4">

              {trafficData.length === 0 ? (
                <p className="text-gray-400">
                  No recommendations available
                </p>
              ) : (
                rankedZones.map((zone, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-cyan-500/10 border border-cyan-500/20"
                  >
                    <p className="font-bold">
                      {zone.zone}
                    </p>

                    <p className="text-gray-300 mt-1">
                      {zone.congestion >= 70
                        ? "Increase green signal duration and activate alternate routes."
                        : zone.congestion >= 40
                        ? "Monitor traffic buildup and optimize signal timing."
                        : "Traffic flow is stable. No intervention required."}
                    </p>
                  </div>
                ))
              )}

            </div>

          </div>

          <div className="mb-10 p-6 rounded-xl bg-green-500/10 border border-green-500/20">

            <h2 className="text-2xl font-bold text-green-400 mb-6">
              Route Optimization Engine
            </h2>

            {trafficData.length === 0 ? (

              <p className="text-gray-400">
                No route optimization data available
              </p>

            ) : (

              <div className="grid grid-cols-2 gap-6">

                <div>
                  <p className="text-gray-400">Source</p>
                  <p className="text-xl font-bold">
                    {cityNodes[0]}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Destination</p>
                  <p className="text-xl font-bold">
                    {cityNodes[cityNodes.length - 1]}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Optimal Route</p>
                  <div>
                    <p className="text-gray-400">
                      Route Cost
                    </p>

                    <p className="text-yellow-400 font-bold">
                      {routeResult?.distance ?? "N/A"}
                    </p>

                    <p className="text-gray-400 mt-4">
                      Optimal Route
                    </p>

                  </div>
                  <p className="text-green-400 font-bold">
                    {routeResult?.path?.length
                      ? routeResult.path.join(" → ")
                      : "No route found"}
                  </p>
                </div>

                <div>
                  <p className="text-gray-400">Algorithm</p>
                  <p className="text-cyan-400 font-bold">
                    Dijkstra's Algorithm
                  </p>
                </div>

              </div>

            )}

          </div>

          <div className="mb-10 p-6 rounded-xl bg-purple-500/10 border border-purple-500/20">

            <h2 className="text-2xl font-bold text-purple-400 mb-6">
              City Connectivity Matrix (Floyd-Warshall)
            </h2>

            {trafficData.length === 0 ? (
              <p className="text-gray-400">
                No connectivity data available.
              </p>
            ) : (
              <div className="overflow-x-auto">

              <table className="w-full text-center">

                <thead>
                  <tr>
                    <th className="p-3"></th>

                    {cityNodes.map((city) => (
                      <th
                        key={city}
                        className="p-3 text-cyan-400"
                      >
                        {city}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>

                  {shortestPaths.map((row: number[], i: number) => (
                    <tr key={i}>

                      <td className="font-bold text-cyan-300 p-3">
                        {cityNodes[i]}
                      </td>

                      {row.map((distance: number, j: number) => (
                        <td
                          key={j}
                          className="p-3 border border-white/10"
                        >
                          {distance}
                        </td>
                      ))}

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

            <p className="text-purple-300 text-sm mt-4">
              DAA Concept: Floyd-Warshall computes the shortest paths between every pair of city zones in O(V³) time.
            </p>

          </div>

            <div className="mb-10 p-6 rounded-xl bg-orange-500/10 border border-orange-500/20">

              <h2 className="text-2xl font-bold text-orange-400 mb-6">
                City Network Optimization (Kruskal MST)
              </h2>

              <div className="space-y-4">

                {mstEdges.length === 0 ? ( 

                <p className="text-gray-400">
                  No network optimization data available.
                </p>

              ) : (

              mstEdges.map((edge, index) => (

                <div
                  key={index}
                  className="flex justify-between border-b border-white/10 pb-3"
                >
                  <span>
                    {edge.from} → {edge.to}
                  </span>

                  <span className="text-orange-300 font-bold">
                    {edge.weight}
                  </span>
                </div>

              ))

            )}

          </div>

          <div className="mt-6 text-orange-300 font-bold">
              Total MST Cost :
              {trafficData.length > 0 ? totalMSTCost : " N/A"}
            </div>

            <p className="text-orange-200 text-sm mt-4">
              DAA Concept: Kruskal's Algorithm constructs a Minimum Spanning Tree by selecting the lowest-cost edges while avoiding cycles.
            </p>
          </div>

          <div className="mb-10 p-6 rounded-xl bg-blue-500/10 border border-blue-500/20">

            <h2 className="text-2xl font-bold text-blue-400 mb-6">
              Traffic Signal Scheduling (Activity Selection)
            </h2>

            <div className="space-y-3">

              {selectedSignals.length === 0 ? (
                <p className="text-gray-400">
                  No signal schedules available.
                </p>
              ) : (
                selectedSignals.map((signal, index) => (

                <div
                  key={index}
                  className="flex justify-between border-b border-white/10 pb-3"
                >
                  <span>
                    {signal.zone}
                  </span>

                  <span className="text-blue-300 font-bold">
                    {signal.start}:00 - {signal.end}:00
                  </span>

                </div>

              ))
              )}
            </div>


            <div className="mt-6 text-blue-300 font-bold">
              Selected Signals :
                {trafficData.length > 0
                  ? selectedSignals.length
                  : " N/A"}
            </div>

            <p className="text-blue-200 text-sm mt-4">
              DAA Concept: Activity Selection uses a Greedy strategy to choose the maximum number of non-overlapping traffic signal schedules.
            </p>

          </div>

          <div className="mb-10 p-6 rounded-xl bg-green-500/10 border border-green-500/20">

            <h2 className="text-2xl font-bold text-green-400 mb-6">
              Emergency Resource Allocation (Knapsack)
            </h2>

            <div className="space-y-4">

              {selectedResources.length === 0 ? (
                <p className="text-gray-400">
                  No resource allocation available.
                </p>
              ) : (
                selectedResources.map((resource, index) => (

                <div
                  key={index}
                  className="flex justify-between border-b border-white/10 pb-3"
                >
                  <div>

                    <p className="font-bold">
                      {resource.zone}
                    </p>

                    <p className="text-gray-400 text-sm">
                      Resource Cost: {resource.cost}
                    </p>

                  </div>

                  <div className="text-green-300 font-bold">
                    Value: {resource.value}
                  </div>

                </div>

              ))
              )}

            </div>

            <div className="mt-6 space-y-2">

              <p className="text-green-300 font-bold">
                Total Value :
                  {trafficData.length > 0
                    ? totalValue
                    : " N/A"}
              </p>

              <p className="text-green-300 font-bold">
                Capacity Used :
                  {trafficData.length > 0
                    ? `${totalCost}/${knapsackCapacity}`
                    : " N/A"}
              </p>

            </div>

            <p className="text-green-200 text-sm mt-4">
              DAA Concept: 0/1 Knapsack maximizes emergency response effectiveness while operating within limited city resource capacity.
            </p>

          </div>

            {/* TRAFFIC BARS */}
            <div className="space-y-6 mb-10">
              {trafficData.map((item, index) => (
                <div
                  key={index}
                  className="bg-white/5 border border-cyan-500/20 rounded-xl p-6"
                >
                  <div className="flex justify-between mb-4">
                    <h2 className="text-2xl">
                      {item.zone}
                    </h2>

                    <span
                      className={
                        item.congestion >= 70
                          ? "text-red-400 font-bold"
                          : item.congestion >= 40
                          ? "text-yellow-300 font-bold"
                          : "text-green-400 font-bold"
                      }
                    >
                      {item.congestion}%
                    </span>
                  </div>

                  <div className="w-full bg-gray-700 rounded-full h-4">
                    <div
                      className={
                        item.congestion >= 70
                          ? "bg-red-400 h-4 rounded-full transition-all duration-1000"
                          : item.congestion >= 40
                          ? "bg-yellow-400 h-4 rounded-full transition-all duration-1000"
                          : "bg-green-400 h-4 rounded-full transition-all duration-1000"
                      }
                      style={{
                        width: `${item.congestion}%`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
              {trafficData.length === 0 && (
                <div className="p-8 text-center text-gray-400">
                  No traffic zones found
                </div>
              )}
            </div>

            {/* TABLE */}
            <div className="bg-white/5 border border-cyan-500/20 rounded-xl overflow-hidden">

              {trafficData.length === 0 ? (

                <div className="p-10 text-center text-gray-400">
                  No traffic records available
                </div>

              ) : (

                <>
                  <div className="grid grid-cols-4 bg-cyan-500/10 p-4 font-bold">
                    <div>Zone</div>
                    <div>Congestion</div>
                    <div>Status</div>
                    <div>Action</div>
                  </div>

                  {trafficData.map((item, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 p-4 border-t border-white/10"
                >
                  <div>{item.zone}</div>

                  <div>{item.congestion}%</div>

                  <div
                    className={
                      item.congestion >= 70
                        ? "text-red-400 font-bold"
                        : item.congestion >= 40
                        ? "text-yellow-300 font-bold"
                        : "text-green-400 font-bold"
                    }
                  >
                    {item.congestion >= 70
                      ? "Heavy"
                      : item.congestion >= 40
                      ? "Moderate"
                      : "Smooth"}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedTrafficId(item.id);
                        setShowDeleteAlert(true);
                      }}
                      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
                </>
              )}

            </div>

            {showDeleteAlert && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

                <div className="bg-[#111827] border border-red-500 rounded-2xl p-8 w-[500px]">

                  <h2 className="text-2xl font-bold text-red-400 mb-4">
                    Delete Traffic Record
                  </h2>

                  <p className="text-gray-300 mb-6">
                    Are you sure you want to delete this traffic record?
                  </p>

                  <div className="flex justify-end gap-4">

                    <button
                      onClick={() => {
                        setShowDeleteAlert(false);
                        setSelectedTrafficId(null);
                      }}
                      className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => {
                        if (selectedTrafficId !== null) {
                          deleteTraffic(selectedTrafficId);
                        }
                      }}
                      className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg"
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>
           )}

          </>
        )}
      </section>
    </main>
  );
}