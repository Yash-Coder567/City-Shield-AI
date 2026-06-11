"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import API from "@/services/api";

export default function AIAssistant() {
  const [open, setOpen] = useState(false);

  const [threats, setThreats] = useState<any[]>([]);
  const [traffic, setTraffic] = useState<any[]>([]);
  const [blockchain, setBlockchain] = useState<any[]>([]);
  const [cameras, setCameras] = useState(0);

  const [input, setInput] = useState("");

  const [notification, setNotification] =
    useState("");
  
  const [alertIndex, setAlertIndex] =
    useState(0);

  const [chatMessages, setChatMessages] =
    useState<any[]>([
      {
        sender: "AI",
        text: "Welcome Commander. CityShield AI is online and monitoring threats, traffic, blockchain security, and surveillance systems.",
      },
    ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const threatsRes = await API.get("/threats");
        const trafficRes = await API.get("/traffic");
        const blockchainRes = await API.get("/blockchain");

        setThreats(threatsRes.data);
        setTraffic(trafficRes.data);
        setBlockchain(blockchainRes.data);

        setCameras(threatsRes.data.length);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    const refresh = setInterval(fetchData, 5000);

    return () => clearInterval(refresh);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [chatMessages]);

  useEffect(() => {
    const highRiskThreats = threats.filter(
      (t) => t.risk === "High"
    );

    if (highRiskThreats.length === 0) {
      setNotification("");
      return;
    }

    const current =
      highRiskThreats[
        alertIndex % highRiskThreats.length
      ];

    setNotification(
      `🚨 ${highRiskThreats.length} High-Risk Threats Active`
    );

    const interval = setInterval(() => {
      setAlertIndex(
        (prev) =>
          (prev + 1) % highRiskThreats.length
      );
    }, 3000);

    return () => clearInterval(interval);

  }, [threats, alertIndex]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "USER",
      text: input,
    };

    const question = input.toLowerCase();

    let aiResponse =
      "CityShield AI is analyzing available city intelligence.";

    if (question.includes("threat")) {
      const highRisk = threats.filter(
        (t) => t.risk === "High"
      ).length;

      aiResponse =
        `There are currently ${threats.length} active threats. ` +
        `${highRisk} are classified as HIGH risk. ` +
        `Primary concern: ${threats[0]?.type || "None"} at ${
          threats[0]?.location || "N/A"
        }.`;
    }

    else if (
      question.includes("high risk") ||
      question.includes("danger")
    ) {
      const highThreats = threats.filter(
        (t) => t.risk === "High"
      );

      if (highThreats.length === 0) {
        aiResponse =
          "No high-risk threats are currently active.";
      } else {
        aiResponse =
          `Detected ${highThreats.length} high-risk threats. ` +
          highThreats
            .map((t) => `${t.type} (${t.location})`)
            .join(", ");
      }
    }

    else if (question.includes("traffic")) {
      const avgTraffic =
        traffic.length > 0
          ? Math.round(
              traffic.reduce(
                (sum: number, item: any) =>
                  sum + item.congestion,
                0
              ) / traffic.length
            )
          : 0;

      aiResponse =
        `Average city congestion is ${avgTraffic}%. ` +
        `AI recommends signal optimization and route diversion.`;
    }

    else if (
      question.includes("camera") ||
      question.includes("surveillance")
    ) {
      aiResponse =
        `${cameras} surveillance cameras are currently active throughout the city.`;
    }

    else if (
      question.includes("blockchain") ||
      question.includes("security")
    ) {
      aiResponse =
        `${blockchain.length} blockchain records verified. Integrity status remains secure.`;
    }

    else if (question.includes("drone")) {
      const drones = threats.filter((t) =>
        t.type?.toLowerCase().includes("drone")
      );

      aiResponse =
        drones.length > 0
          ? `${drones.length} drone-related incidents detected. Enhanced aerial monitoring recommended.`
          : "No active drone threats detected.";
    }

    else if (
      question.includes("vehicle") ||
      question.includes("suspicious")
    ) {
      aiResponse =
        "AI recommends validating vehicle registration records and reviewing nearby CCTV footage.";
    }

    else if (
      question.includes("summary") ||
      question.includes("status")
    ) {
      const high = threats.filter(
        (t) => t.risk === "High"
      ).length;

      const medium = threats.filter(
        (t) => t.risk === "Medium"
      ).length;

      const low = threats.filter(
        (t) => t.risk === "Low"
      ).length;

      aiResponse =
        `City Status Report:\n` +
        `Threats: ${threats.length}\n` +
        `High Risk: ${high}\n` +
        `Medium Risk: ${medium}\n` +
        `Low Risk: ${low}\n` +
        `Cameras Active: ${cameras}\n` +
        `Blockchain Records: ${blockchain.length}`;
    }

    setChatMessages((prev) => [
      ...prev,
      userMessage,
      {
        sender: "AI",
        text: aiResponse,
      },
    ]);

    setInput("");
  };

  return (
    <>
      {notification && (
        <div
          className="
            fixed
            top-5
            right-5
            z-[9999]
            bg-red-500
            text-white
            px-5
            py-3
            rounded-xl
            shadow-lg
            animate-pulse
          "
        >
          {notification}
        </div>
      )}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-cyan-500 text-black font-bold text-xl shadow-[0_0_30px_rgba(0,255,255,0.6)] z-[9999]"
      >
        AI
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-28 right-6 w-[380px] rounded-2xl overflow-hidden border border-cyan-500/20 bg-[#081120]/95 backdrop-blur-xl shadow-[0_0_40px_rgba(0,255,255,0.15)] z-[9999]"
          >
            <div className="p-4 border-b border-cyan-500/20 flex items-center justify-between">
              <div>
                <h2 className="text-cyan-300 font-bold text-lg">
                  CityShield AI
                </h2>

                <p className="text-xs text-green-400 mt-1">
                  Neural Intelligence Online
                </p>
              </div>

              <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>
            </div>

            <div className="p-4 space-y-4 h-[450px] overflow-y-auto">
              {chatMessages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                    msg.sender === "AI"
                      ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-100"
                      : "ml-auto bg-white/10 border border-white/10 text-yellow-300"
                  }`}
                >
                  <p className="text-xs mb-1 opacity-70">
                    {msg.sender}
                  </p>

                  <p className="whitespace-pre-line">
                    {msg.text}
                  </p>
                </motion.div>
              ))}

              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-cyan-500/20 flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) =>
                  setInput(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSend();
                  }
                }}
                placeholder="Ask CityShield AI..."
                className="flex-1 bg-black/30 border border-cyan-500/20 rounded-xl px-4 py-3 outline-none text-sm text-white"
              />

              <button
                onClick={handleSend}
                className="px-5 rounded-xl bg-cyan-500 hover:bg-cyan-400 transition-all text-black font-bold"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}