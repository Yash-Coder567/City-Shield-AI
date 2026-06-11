"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginCard() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    setError("");

    // Default Admin Account
    if (
      email === "admin@cityshield.ai" &&
      password === "cityshield123"
    ) {
      setLoading(true);

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);

      return;
    }

    // Registered Users
    const users = JSON.parse(
      localStorage.getItem("cityshieldUsers") || "[]"
    );

    const validUser = users.find(
      (user: any) =>
        user.email === email &&
        user.password === password
    );

    if (validUser) {
      setLoading(true);

      setTimeout(() => {
        router.push("/dashboard");
      }, 1500);
    } else {
      setError("Invalid email or password");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1 }}
      className="w-1/2 flex items-center justify-center bg-[#050816]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="w-[420px] p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-[0_0_50px_rgba(0,255,255,0.15)]"
      >
        <h2 className="text-4xl font-bold text-white mb-3">
          Welcome Back
        </h2>

        <p className="text-gray-400 mb-8">
          Sign in to access CityShield AI
        </p>

        {/* Email */}
        <div className="mb-5">
          <label className="block text-gray-300 mb-2">
            Email
          </label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            placeholder="admin@cityshield.ai"
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-cyan-500/30 text-white outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all"
          />
        </div>

        {/* Password */}
        <div className="mb-5">
          <label className="block text-gray-300 mb-2">
            Password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleLogin();
              }
            }}
            placeholder="••••••••"
            className="w-full px-4 py-3 rounded-xl bg-black/40 border border-cyan-500/30 text-white outline-none focus:border-cyan-400 focus:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-all"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 text-red-400 text-sm font-medium">
            {error}
          </div>
        )}

        {/* Login Button */}
        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 hover:scale-105 hover:shadow-[0_0_30px_rgba(0,255,255,0.7)] transition-all text-black font-bold text-lg"
        >
          {loading ? "Authenticating..." : "Secure Login"}
        </button>

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          Protected by AI + Blockchain Security
        </div>

        {/* Signup Link */}
        <div className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account?

          <button
            onClick={() => router.push("/signup")}
            className="ml-2 text-cyan-400 hover:text-cyan-300"
          >
            Create Account
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}