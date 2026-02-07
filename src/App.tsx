import { useState } from 'react';
import { Navbar } from './components/Navbar';
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Tools from "./pages/Tools";
import BackgroundStack from './components/BackgroundStack';

type Page = "home" | "projects" | "tools";

const BG_STEPS = [
  { id: "bg-home-1", src: "/renderhoneycombv1.png"},
  { id: "bg-home-2", src: "/renderhoneycombv2.png"}
]

function App() {
  const [page, setPage] = useState<Page>("home");

  return (
    <div className="min-h-screen relative">
      {/* Global background */}
      <BackgroundStack steps={BG_STEPS} dim={0.2} feather={0.25} />

      {/* Dim overlay */}
      <div className="fixed inset-0 -z-10 bg-black/30 pointer-events-none"  />

      {/* Content */}
      <div className="relative z-0">
        <Navbar page={page} onNavigate={setPage} />
        <div className="pt-16">
          {page === "home" && <Home onNavigate={setPage} />}
          {page === "projects" && <Projects />}
          {page === "tools" && <Tools />}
        </div>
      </div>
    </div>
  );
}

export default App