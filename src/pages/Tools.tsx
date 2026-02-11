import DrugShortage from "../components/tools/DrugShortage";
import MathTrainer from "../components/tools/MathTrainer";

export default function Tools() {
    
    return (
        <main className="mx-auto max-w-5xl px-6 py-16">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Tools</h1>
                <p className="mt-2 text-zinc-300">Small utilities I've built for myself.</p>
            </header>

           {/* Math trainer tool */}
           <MathTrainer />
            <br></br>
           {/* Drug shortage checker */}
           <DrugShortage />
        </main>
    );
}