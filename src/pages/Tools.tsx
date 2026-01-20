import { useEffect, useMemo, useState } from "react";

import type { ArithmeticConfig, PresetId, SessionState } from "../trainer/types";
import { PRESETS } from "../trainer/presets";
import { startSession, submitAnswer, finishSession } from "../trainer/engine/session";

export default function ToolMathTrainer() {
    // ---- config state ----
    const [preset, setPreset] = useState<PresetId>("easy");
    const [config, setConfig] = useState<ArithmeticConfig>(PRESETS.easy);

    // when user clicks a preset
    function applyPreset(next: Exclude<PresetId, "custom">) {
        setPreset(next);
        setConfig(PRESETS[next]);
    }

    // if user edits any settings manually, switch to custom
    // function updateConfig(patch: Partial<ArithmeticConfig>) {
    //     setPreset("custom");
    //     setConfig((prev) => ({ ...prev, ...patch }));
    // }

    // ---- session state ----
    const [session, setSession] = useState<SessionState>({ status: "idle" });

    // the user's input for the current problem
    const [answer, setAnswer] = useState("");
    const [error, setError] = useState<string | null>(null);

    // a tick to re-render timer display while running
    const [tick, setTick] = useState(0);

    // ---- start / submit / finish ----
    function onStart() {
        setError(null);
        setAnswer("");
        setTick(0);
        setSession(startSession(config));
    }

    function onSubmit() {
        setError(null);

        // basic validation
        if (answer.trim() === "") {
            setError("Type an answer first.");
            return;
        }

        setSession((prev) => submitAnswer(prev, answer));
        setAnswer("");
    }

    function onFinishEarly() {
        setSession((prev) => finishSession(prev));
    }

    // ---- timed mode loop ----
    useEffect(() => {
        if (session.status !== "running") return;
        if (!session.config.timed) return;

        const id = window.setInterval(() => {
            // This forces a re-render so remaining time updates
            setTick((t) => t + 1);

            const elapsed = Math.floor((Date.now() - session.startedAt) / 1000);
            const remaining = session.config.timeLimitSec - elapsed;

            if (remaining <= 0) {
                setSession((prev) => finishSession(prev));
            }
        }, 250);

        return () => window.clearInterval(id);
    }, [session]);

    // ---- derived values for display ----
    const remainingSec = useMemo(() => {
        if (session.status !== "running") return null;
        if (!session.config.timed) return null;
        const elapsed = Math.floor((Date.now() - session.startedAt) / 1000);
        return Math.max(0, session.config.timeLimitSec - elapsed);
    }, [session, tick]);

    const attemptsCount = useMemo(() => {
        if (session.status === "idle") return [];
        if (session.status === "running") return session.attempts?.length ?? 0;
        return 0;
    }, [session]);

    // basic result summary (wip)
    const resultSummary = useMemo(() => {
        if (session.status !== "finished") return null;
        const attempts = session.result.attempts;
        const total = attempts.length;
        const correct = attempts.filter((a) => a.correct).length;
        const accuracy = total > 0 ? Math.round((correct/total)*100) : 0;
        const avgMs = total > 0 ? Math.round(attempts.reduce((s,a) => s + a.timeMs, 0) / total) : 0;

        return { total, correct, accuracy, avgMs };
    }, [session]);

    // ---- render ----
    const primaryBtn = "rounded-lg bg-violet-500 px-4 py-2 text-sm font-medium text-white hover:bg-violet-400 transition disabled:opacity-50 disabled:hover:bg-violet-500";
    const ghostBtn = "rounded-lg border border-zinc-700 bg-transparent px-4 py-2 text-sm font-medium text-zinc-100 hover:bg-zinc-800/60 transition";

    return (
        <main className="mx-auto max-w-5xl px-6 py-16">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Tools</h1>
                <p className="mt-2 text-zinc-300">Small utilities I've built for myself.</p>
            </header>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
                            Math Trainer
                        </h2>
                        <p className="mt-1 text-sm text-zinc-300">
                            Quick arithmetic drills with timing + stats.
                        </p>
                    </div>

                    {/* small status pill */}
                    <div className="rounded-full border border-zinc-700 bg-zinc-950/40 px-3 py-1 text-xs text-zinc-200">
                        {session.status === "idle" && "Ready"}
                        {session.status === "running" && "Running"}
                        {session.status === "finished" && "Finished"}
                    </div>
                </div>

                {/* CONTENT */}
                <div className="mt-6">
                    {session.status === "idle" && (
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-2">
                        {(["easy", "medium", "hard"] as const).map((p) => {
                            const active = preset === p;
                            return (
                            <button
                                key={p}
                                onClick={() => applyPreset(p)}
                                aria-pressed={active}
                                className={
                                "rounded-lg px-3 py-2 text-sm font-medium transition " +
                                (active
                                    ? "bg-violet-500/15 text-violet-200 ring-1 ring-violet-500/30"
                                    : "border border-zinc-700 text-zinc-200 hover:bg-zinc-800/60")
                                }
                            >
                                {p[0].toUpperCase() + p.slice(1)}
                            </button>
                            );
                        })}

                        {/* Custom */}
                        <button
                            onClick={() => setPreset("custom")}
                            aria-pressed={preset === "custom"}
                            className={
                            "rounded-lg px-3 py-2 text-sm font-medium transition " +
                            (preset === "custom"
                                ? "bg-violet-500/15 text-violet-200 ring-1 ring-violet-500/30"
                                : "border border-zinc-700 text-zinc-200 hover:bg-zinc-800/60")
                            }
                        >
                            Custom
                        </button>
                        </div>

                        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
                        <div className="text-sm text-zinc-300">
                            Preset:{" "}
                            <span className="font-semibold text-zinc-100">{preset}</span>
                            {config.timed && (
                            <>
                                {" "}
                                • Timed{" "}
                                <span className="font-semibold text-zinc-100">
                                {config.timeLimitSec}s
                                </span>
                            </>
                            )}
                        </div>

                        <button className={primaryBtn} onClick={onStart}>
                            Start
                        </button>
                        </div>
                    </div>
                    )}

                    {session.status === "running" && (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
                        <div className="text-sm text-zinc-300">
                            {remainingSec !== null ? (
                            <>
                                Time left:{" "}
                                <span className="font-semibold text-zinc-100">
                                {remainingSec}s
                                </span>
                            </>
                            ) : (
                            <>
                                Problems answered:{" "}
                                <span className="font-semibold text-zinc-100">
                                {attemptsCount}
                                </span>
                            </>
                            )}
                        </div>

                        <button className={ghostBtn} onClick={onFinishEarly}>
                            Finish
                        </button>
                        </div>

                        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-6 text-center">
                        <div className="text-3xl font-semibold tracking-tight text-zinc-100">
                            {session.current.prompt}
                        </div>

                        <div className="mt-4 flex justify-center">
                            <input
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") onSubmit();
                            }}
                            autoFocus
                            inputMode="numeric"
                            className="w-48 rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-center text-xl text-zinc-100 outline-none focus:ring-2 focus:ring-violet-500/40"
                            placeholder="Answer"
                            />
                        </div>

                        {error && (
                            <div className="mt-3 text-sm text-red-400">{error}</div>
                        )}

                        <div className="mt-5 flex justify-center gap-2">
                            <button className={primaryBtn} onClick={onSubmit}>
                            Submit
                            </button>
                            <button className={ghostBtn} onClick={() => setAnswer("")}>
                            Clear
                            </button>
                        </div>
                        </div>
                    </div>
                    )}

                    {session.status === "finished" && resultSummary && (
                    <div className="space-y-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
                            <div className="text-xs text-zinc-400">Accuracy</div>
                            <div className="mt-1 text-2xl font-semibold text-zinc-100">
                            {resultSummary.accuracy}%
                            </div>
                        </div>
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
                            <div className="text-xs text-zinc-400">Avg time</div>
                            <div className="mt-1 text-2xl font-semibold text-zinc-100">
                            {(resultSummary.avgMs / 1000).toFixed(2)}s
                            </div>
                        </div>
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
                            <div className="text-xs text-zinc-400">Correct</div>
                            <div className="mt-1 text-2xl font-semibold text-zinc-100">
                            {resultSummary.correct} / {resultSummary.total}
                            </div>
                        </div>
                        <div className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-4">
                            <div className="text-xs text-zinc-400">Total</div>
                            <div className="mt-1 text-2xl font-semibold text-zinc-100">
                            {resultSummary.total}
                            </div>
                        </div>
                        </div>

                        <div className="flex items-center justify-end gap-2">
                        <button className={ghostBtn} onClick={() => setSession({ status: "idle" })}>
                            Back
                        </button>
                        <button className={primaryBtn} onClick={onStart}>
                            Retry
                        </button>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </main>
    );
}

