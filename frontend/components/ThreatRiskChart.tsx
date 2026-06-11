"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  highRisk: number;
  mediumRisk: number;
  lowRisk: number;
}

export default function ThreatRiskChart({
  highRisk,
  mediumRisk,
  lowRisk,
}: Props) {
  const data = [
    {
      name: "High Risk",
      value: highRisk,
    },
    {
      name: "Medium Risk",
      value: mediumRisk,
    },
    {
      name: "Low Risk",
      value: lowRisk,
    },
  ];

  const COLORS = [
    "#ef4444",
    "#facc15",
    "#22c55e",
  ];

  if (
    highRisk === 0 &&
    mediumRisk === 0 &&
    lowRisk === 0
  ) {
    return (
      <div className="p-6 rounded-xl bg-white/5 border border-cyan-500/20">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6">
          Threat Risk Distribution
        </h2>

        <div className="h-[300px] flex items-center justify-center text-gray-400">
          No threat distribution data available.
        </div>
      </div>
    );
  }

  return (
    
    <div className="p-6 rounded-xl bg-white/5 border border-cyan-500/20">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6">
        Threat Risk Distribution
        </h2>

        <div className="grid grid-cols-2 items-center">

        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
            <Pie
                data={data}
                dataKey="value"
                outerRadius={100}
                label
            >
                {data.map((entry, index) => (
                <Cell
                    key={index}
                    fill={COLORS[index]}
                />
                ))}
            </Pie>

            <Tooltip />
            </PieChart>
        </ResponsiveContainer>

        <div className="space-y-4">
            <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span>High Risk ({highRisk})</span>
            </div>

            <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            <span>Medium Risk ({mediumRisk})</span>
            </div>

            <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span>Low Risk ({lowRisk})</span>
            </div>
        </div>

        </div>
    </div>
    );
}