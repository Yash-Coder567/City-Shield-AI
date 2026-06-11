"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Props {
  verified: number;
  tampered: number;
  integrityScore: number;
}


export default function BlockchainIntegrityChart({
  verified,
  tampered,
  integrityScore,
}: Props) {

    console.log(
    "verified:", verified,
    "tampered:", tampered,
    "integrityScore:", integrityScore
    );

  const data = [
    {
      name: "Verified",
      value: verified,
    },
    {
      name: "Tampered",
      value: tampered,
    },
  ].filter((item) => item.value > 0);

  const COLORS = [
    "#22c55e",
    "#ef4444",
  ];

  return (
    <div className="bg-white/5 border border-green-500/20 rounded-xl p-6">

      <h2 className="text-2xl font-bold text-green-400 mb-6">
        Blockchain Integrity Distribution
      </h2>

      <div className="h-[300px] flex items-center justify-center gap-20">

        <ResponsiveContainer width={350} height={250}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={90}
              label
            >
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={
                    entry.name === "Verified"
                      ? "#22c55e"
                      : "#ef4444"
                  }
                />
              ))}
            </Pie>

            <Tooltip />
          </PieChart>
        </ResponsiveContainer>

        <div className="space-y-4">

          <div className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>

            <span>
              Verified ({verified}) — {String(integrityScore)}% Integrity Score
            </span>
          </div>

          {tampered > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>

              <span>
                Tampered ({tampered}) — {String(100 - integrityScore)}% Integrity Score
              </span>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}