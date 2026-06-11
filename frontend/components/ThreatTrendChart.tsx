"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Threat {
  id: number;
  type: string;
  location: string;
  risk: string;
}

interface Props {
  threats: Threat[];
}

export default function ThreatTrendChart({
  threats,
}: Props) {

  const data = threats.map((_, index) => ({
    time: `T${index + 1}`,
    threats: index + 1,
  }));

  if (threats.length === 0) {
    return (
      <div className="p-6 rounded-2xl bg-white/5 border border-cyan-500/20">
        <h2 className="text-2xl font-bold text-cyan-400 mb-6">
          Threat Trend Analysis
        </h2>

        <div className="h-[300px] flex items-center justify-center text-gray-400">
          No trend data available
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-cyan-500/20">
      <h2 className="text-2xl font-bold text-cyan-400 mb-6">
        Threat Trend Analysis
      </h2>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="time" />
            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="threats"
              stroke="#06b6d4"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}