import Image from "next/image";

type ScreenshotItem = {
  title: string;
  description: string;
  image: string;
};

const screenshots: ScreenshotItem[] = [
  {
    title: "Dashboard",
    description:
      "Central AI Command Center showing city-wide threat monitoring, blockchain integrity, traffic status, and live alerts.",
    image: "dashboard.png",
  },
  {
    title: "AI Monitoring",
    description:
      "Real-time AI surveillance and monitoring system for smart city security operations.",
    image: "monitoring.png",
  },
  {
    title: "Threat Analytics",
    description:
      "Threat detection, risk classification, BFS traversal, Priority Queue, Merge Sort, and Huffman Coding implementations.",
    image: "threats.png",
  },
  {
    title: "Smart Traffic",
    description:
      "Traffic optimization system using Dijkstra, Floyd-Warshall, Kruskal MST, Activity Selection, and Knapsack algorithms.",
    image: "traffic.png",
  },
  {
    title: "Blockchain Logs",
    description:
      "Tamper-proof blockchain-based audit logs for city security events.",
    image: "blockchain.png",
  },
  {
    title: "Admin Panel",
    description:
      "Administrative control center for managing threats, traffic data, and monitoring operations.",
    image: "admin.png",
  },
  {
    title: "DAA Overview",
    description:
      "Complete summary of all Design and Analysis of Algorithms integrated into CityShield AI.",
    image: "daa-overview.png",
  },
];

export default function ProjectGallery() {
  return (
    <div className="mt-10">
      <div className="mb-6">
        <h2 className="text-3xl font-semibold text-cyan-400">Project Screenshots</h2>
        <p className="mt-2 text-gray-300 max-w-2xl">
          Visual overview of all CityShield AI modules and implemented DAA concepts.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {screenshots.map((item) => (
          <article
            key={item.title}
            className="group overflow-hidden rounded-xl border border-cyan-500/20 bg-white/5 shadow-sm transition duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-cyan-500/10"
          >
            <div className="relative h-64 overflow-hidden">
              <Image
                src={`/assets/screenshots/${item.image}`}
                alt={`${item.title} screenshot`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
              />
            </div>

            <div className="space-y-3 p-5">
              <h3 className="text-xl font-semibold text-cyan-300">{item.title}</h3>
              <p className="text-sm leading-6 text-gray-300">{item.description}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
