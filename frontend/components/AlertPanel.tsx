"use client";

import { motion } from "framer-motion";

interface AlertPanelProps {
  alerts: any[];
}

export default function AlertPanel({
  alerts = [],
}: AlertPanelProps) {
  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-cyan-500/20 mt-8">

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold text-cyan-300">
          Live AI Alerts
        </h2>

        <div className="flex items-center gap-2">

          <div
            className={`w-3 h-3 rounded-full ${
              alerts.length > 0
                ? "bg-green-400 animate-pulse"
                : "bg-red-400"
            }`}
          />

          <span
            className={`text-sm uppercase tracking-widest ${
              alerts.length > 0
                ? "text-green-300"
                : "text-red-300"
            }`}
          >
            {alerts.length > 0
              ? "Live Feed"
              : "No Data"}
          </span>

        </div>

      </div>

      <div className="space-y-4">

        {alerts.length === 0 ? (

          <div className="text-center py-8 text-gray-400">
            No active alerts available
          </div>

        ) : (

          alerts.slice(0, 5).map((alert, index) => {

            const color =
              alert.risk === "High"
                ? "red"
                : alert.risk === "Medium"
                ? "yellow"
                : "green";

            return (
              <motion.div
                key={alert.id || index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                className={`p-5 rounded-xl border cursor-pointer
                  ${
                    color === "red"
                      ? "bg-red-500/10 border-red-500/20"
                      : color === "yellow"
                      ? "bg-yellow-500/10 border-yellow-500/20"
                      : "bg-green-500/10 border-green-500/20"
                  }
                `}
              >

                <div className="flex justify-between items-center">

                  <div>

                    <h3 className="font-semibold text-lg">
                      {alert.type}
                    </h3>

                    <p className="text-sm text-gray-400 mt-1">
                      Location: {alert.location}
                    </p>

                    <p className="text-xs text-gray-500 mt-1">
                      {alert.timestamp || "No timestamp"}
                    </p>

                  </div>

                  <div
                    className={`px-3 py-1 rounded-full text-xs font-bold
                      ${
                        color === "red"
                          ? "bg-red-500 text-white"
                          : color === "yellow"
                          ? "bg-yellow-400 text-black"
                          : "bg-green-500 text-black"
                      }
                    `}
                  >
                    {alert.risk}
                  </div>

                </div>

              </motion.div>
            );
          })

        )}

      </div>

    </div>
  );
}