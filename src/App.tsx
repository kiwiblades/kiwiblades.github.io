import { useState } from 'react';
import { Navbar } from './components/Navbar';
import Home from "./pages/Home";
import Projects from "./pages/Projects";
import ToolMathTrainer from "./pages/Tools";

type Page = "home" | "projects" | "tools";

function App() {
  const [page, setPage] = useState<Page>("home");

  return (
    <div>
      <Navbar page={page} onNavigate={setPage} />
      <div className="pt-16">
        {page === "home" && <Home />}
        {page === "projects" && <Projects />}
        {page === "tools" && <ToolMathTrainer />}
      </div>
    </div>
  );
}

export default App