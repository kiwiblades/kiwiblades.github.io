import { useState } from "react";

type Page = "home" | "projects" | "tools";

export function Navbar({
    page,
    onNavigate,
}: {
    page: Page;
    onNavigate: (p: Page) => void;
}) {
    const [open, setOpen] = useState(false);

    function go(p: Page) {
        onNavigate(p);
        setOpen(false);
    }

    const linkBase = "rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-zinc-800/60";
    const linkActive = "bg-violet-500/15 text-violet-200 ring-1 ring-violet-500/30";
    const linkIdle = "text-zinc-200";

    return (
        <nav className="fixed top-0 z-20 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur">
            <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
                <button
                onClick={() => go("home")}
                className="text-base font-semibold text-white">
                Rye Armstrong
                </button>

                {/* Desktop links */}
                <div className="hidden items-center gap-2 md:flex">
                <button
                    onClick={() => go("home")}
                    className={`${linkBase} ${page === "home" ? linkActive : linkIdle}`}>
                    Home
                </button>
                <button
                    onClick={() => go("projects")}
                    className={`${linkBase} ${
                    page === "projects" ? linkActive : linkIdle
                    }`}>
                    Projects
                </button>
                <button
                    onClick={() => go("tools")}
                    className={`${linkBase} ${
                    page === "tools" ? linkActive : linkIdle
                    }`}>
                    Tools
                </button>
                </div>

                {/* Mobile menu button */}
                <button
                onClick={() => setOpen((v) => !v)}
                className="md:hidden rounded-lg p-2 text-zinc-200 hover:bg-zinc-800/60"
                aria-label="Open menu"
                aria-expanded={open}
                >
                <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                >
                    <path
                    d="M5 7h14M5 12h14M5 17h14"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    />
                </svg>
                </button>
            </div>

            {/* Mobile dropdown */}
            {open && (
                <div className="border-t border-zinc-800 md:hidden">
                <div className="mx-auto max-w-5xl px-6 py-3 flex flex-col gap-2">
                    <button
                    onClick={() => go("home")}
                    className={`${linkBase} ${page === "home" ? linkActive : linkIdle} text-left`}>
                    Home
                    </button>
                    <button
                    onClick={() => go("projects")}
                    className={`${linkBase} ${
                        page === "projects" ? linkActive : linkIdle
                    } text-left`}>
                    Projects
                    </button>
                    <button
                    onClick={() => go("tools")}
                    className={`${linkBase} ${
                        page === "tools" ? linkActive : linkIdle
                    } text-left`}>
                    Tools
                    </button>
                </div>
                </div>
            )}
        </nav>
    );
}