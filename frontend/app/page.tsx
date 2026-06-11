import BackgroundEffects from "../components/BackgroundEffects";
import LeftPanel from "../components/LeftPanel";
import LoginCard from "../components/LoginCard";

export default function Home() {
  return (
    <main className="min-h-screen bg-black flex overflow-hidden relative">

      <BackgroundEffects />

      <LeftPanel />

      <LoginCard />

    </main>
  );
}