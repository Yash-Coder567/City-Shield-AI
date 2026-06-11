"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function AnalyticsChart({
  threats,
}: {
  threats: any[];
}) {
  const data = threats.map(
    (threat: any, index: number) => ({
      time: threat.timestamp
        ? new Date(threat.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })
        : threat.location,

      threats: index + 1,

      type: threat.type,
      location: threat.location,
      risk: threat.risk,
    })
  );

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-cyan-500/20">
      <h3 className="text-2xl font-bold mb-6 text-cyan-300">
        Threat Activity Analytics
      </h3>

      <div className="w-full h-[350px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart data={data}>
            <XAxis
              dataKey="time"
              stroke="#94a3b8"
            />

            <YAxis
              stroke="#94a3b8"
              allowDecimals={false}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "#081120",
                border: "1px solid #06b6d4",
                borderRadius: "12px",
                color: "#ffffff",
              }}
              formatter={(value: any) => [
                value,
                "Threat Count",
              ]}
              labelFormatter={(label) =>
                `Time / Location: ${label}`
              }
            />

            <Line
              type="monotone"
              dataKey="threats"
              stroke="#06b6d4"
              strokeWidth={4}
              dot={{
                r: 5,
                fill: "#06b6d4",
              }}
              activeDot={{
                r: 7,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}