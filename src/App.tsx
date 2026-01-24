import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import Tools from "./pages/Tools";

type Page = "home" | "projects" | "tools";
const IMGS = [
  "/renderhoneycombv1.png",
  "/renderhoneycombv2.png",
];

function preloadImages(urls: string[]) {
  urls.forEach((src) => {
    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    img.src = src;
  })
}

function App() {
  const [page, setPage] = useState<Page>("home");
  const [bg, setBg] = useState<string>(IMGS[0]);

  useEffect(() => {
    preloadImages(IMGS);
  }, []);

  return (
    <div className="min-h-screen relative">
      {/* Global background */}
      <div className="fixed inset-0 -z-20" style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }} />
      {/* Dim overlay */}
      <div className="fixed inset-0 -z-10 bg-black/30 pointer-events-none"  />

      {/* Content */}
      <div className="relative z-0">
        <Navbar page={page} onNavigate={setPage} />
        <div className="pt-16">
          {page === "home" && <Home onNavigate={setPage} setBg={setBg} />}
          {page === "projects" && <Projects setBg={setBg} />}
          {page === "tools" && <Tools />}
        </div>
      </div>
    </div>
  );
}

export default App