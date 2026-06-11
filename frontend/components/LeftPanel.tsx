"use client";

import { motion } from "framer-motion";

export default function LeftPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
      className="w-1/2 relative flex flex-col justify-center items-center bg-gradient-to-br from-black via-slate-950 to-cyan-950 overflow-hidden"
    >

      {/* Glow Effect */}
      <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-3xl rounded-full animate-pulse"></div>

      {/* Content */}
      <div className="z-10 text-center px-10">

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-6xl font-extrabold text-cyan-400 mb-6"
        >
          CityShield AI
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="space-y-4"
        >

          <p className="text-gray-300 text-xl max-w-lg leading-relaxed">
            AI Powered Secure Smart City Intelligence Platform
          </p>

          <div className="flex items-center gap-3 mt-6">

            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>

            <span className="text-green-300 tracking-wider uppercase text-sm">
              System Online
            </span>

          </div>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-10 flex gap-6 justify-center"
        >

          <div className="px-5 py-3 border border-cyan-400 rounded-xl text-cyan-300 hover:bg-cyan-500/10 hover:scale-105 transition-all cursor-pointer">
            AI Powered
          </div>

          <div className="px-5 py-3 border border-purple-400 rounded-xl text-purple-300 hover:bg-purple-500/10 hover:scale-105 transition-all cursor-pointer">
            Blockchain Secure
          </div>

          <div className="px-5 py-3 border border-green-400 rounded-xl text-green-300 hover:bg-green-500/10 hover:scale-105 transition-all cursor-pointer">
            Cyber Defense
          </div>

        </motion.div>

      </div>

    </motion.div>
  );
}