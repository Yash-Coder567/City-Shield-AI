"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [error, setError] = useState("");

  const handleSignup = () => {
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const users = JSON.parse(
      localStorage.getItem("cityshieldUsers") || "[]"
    );

    users.push({
      name,
      email,
      password,
    });

    localStorage.setItem(
      "cityshieldUsers",
      JSON.stringify(users)
    );

    alert("Account created successfully");

    router.push("/");
  };

  return (
    <main className="min-h-screen bg-[#030712] flex items-center justify-center text-white">
      <div className="w-[450px] p-10 rounded-3xl bg-white/5 border border-cyan-500/20">

        <h1 className="text-3xl font-bold text-cyan-400 mb-8">
          Create Account
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl bg-black/30"
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl bg-black/30"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 rounded-xl bg-black/30"
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) =>
            setConfirmPassword(e.target.value)
          }
          className="w-full mb-4 p-3 rounded-xl bg-black/30"
        />

        {error && (
          <p className="text-red-400 mb-4">
            {error}
          </p>
        )}

        <button
          onClick={handleSignup}
          className="w-full py-3 rounded-xl bg-cyan-500 text-black font-bold"
        >
          Create Account
        </button>

      </div>
    </main>
  );
}