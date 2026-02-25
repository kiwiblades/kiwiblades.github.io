import { useEffect, useMemo, useState } from "react";
import { fetchShortages, formatYmd, type OpenFdaShortage } from "../../tools_logic/openfda/shortages";

export default function DrugShortage() {
    const [query, setQuery] = useState("");
    const [debounced, setDebounced] = useState("");
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const [items, setItems] = useState<OpenFdaShortage[]>([]);
    const [total, setTotal] = useState<number | null>(null);
    const [lastUrl, setLastUrl] = useState<string | null>(null);

    // debounce user typing
    useEffect(() => {
        const t = window.setTimeout(() => setDebounced(query.trim()), 400);
        return () => window.clearTimeout(t);
    }, [query]);

    const canSearch = useMemo(() => debounced.length >= 2, [debounced]);

    // separate from the debounced effect
    async function runSearch(q: string) {
        const trimmed = q.trim();
        if (!trimmed) return;

        setLoading(true);
        setErr(null);

        try {
            const out = await fetchShortages(trimmed, 10);
            setItems(out.results);
            setTotal(out.total);
            setLastUrl(out.url);
        } catch (e: any) {
            setErr(e?.message ?? "Request failed");
            setItems([]);
            setTotal(null);
            setLastUrl(null);
        } finally {
            setLoading(false);
        }
    }

    // auto-search when debounced query changes
    useEffect(() => {
    if (!canSearch) {
        setItems([]);
        setTotal(null);
        setLastUrl(null);
        setErr(null);
        return;
    }
    runSearch(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debounced, canSearch]);

    const primaryBtn = "rounded-xl border border-zinc-700 bg-zinc-950/30 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-900 disabled:opacity-60";
    const inputCls = "w-full rounded-xl border border-zinc-700 bg-zinc-950/30 px-4 py-2 text-zinc-100 placeholder:text-zinc-500 outline-none" 
        + "focus:ring-2 focus:ring-violet-500/40";

    return (
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6 shadow-sm backdrop-blur">
            <div className="flex items-start justify-between gap-4">
            <div>
                <h2 className="text-2xl font-semibold tracking-tight text-zinc-100">
                    FDA Drug Shortage Lookup
                </h2>
                <p className="mt-1 text-sm text-zinc-300">
                    Quick search for openFDA drug shortages
                </p>
            </div>

            <div className="rounded-full border border-zinc-700 bg-zinc-950/40 px-3 py-1 text-xs text-zinc-200">
                {loading ? "Searching" : "Ready"}
            </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder='Try "lisdex" or "nystatin"'
                className={inputCls}
            />

            <button
                type="button"
                className={primaryBtn}
                disabled={!query.trim() || loading}
                onClick={() => runSearch(query)}
            >
                Search
            </button>

            <button
                type="button"
                className={primaryBtn}
                disabled={!query.trim() || loading}
                onClick={() => {
                setQuery("");
                setDebounced("");
                setItems([]);
                setTotal(null);
                setErr(null);
                setLastUrl(null);
                }}
            >
                Clear
            </button>
            </div>

            <div className="mt-2 text-xs text-zinc-500">
            Tip: results are case-insensitive. For best matches, use the generic name.
            </div>

            {lastUrl && (
            <div className="mt-2 break-all text-xs text-zinc-600">
                Query URL: {lastUrl}
            </div>
            )}

            {err && (
            <div className="mt-4 rounded-xl border border-red-900/40 bg-red-950/30 p-3 text-sm text-red-200">
                {err}
            </div>
            )}

            {!loading && !err && canSearch && items.length === 0 && (
            <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-950/30 p-3 text-sm text-zinc-300">
                No matches found for{" "}
                <span className="font-semibold text-zinc-100">{debounced}</span>.
            </div>
            )}

            {items.length > 0 && (
            <div className="mt-5">
                <div className="text-sm text-zinc-300">
                Showing <span className="font-semibold text-zinc-100">{items.length}</span>
                {typeof total === "number" ? (
                    <>
                    {" "}
                    of <span className="font-semibold text-zinc-100">~{total}</span>
                    </>
                ) : null}
                {debounced ? (
                    <>
                    {" "}
                    for <span className="font-semibold text-zinc-100">{debounced}</span>
                    </>
                ) : null}
                </div>

                <ul className="mt-3 grid gap-3">
                {items.map((r, i) => {
                    const title = r.generic_name || r.openfda?.brand_name || "Unnamed drug";
                    const subtitle = r.openfda?.brand_name ? r.openfda.brand_name : null;

                    return (
                    <li
                        key={`${title}-${subtitle ?? ""}-${i}`}
                        className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-4"
                    >
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                        <div className="text-sm font-semibold text-zinc-100">
                            {title}
                        </div>
                        {subtitle && (
                            <span className="text-xs text-zinc-500">({subtitle})</span>
                        )}
                        </div>

                        <div className="mt-2 grid gap-1 text-sm text-zinc-300">
                        {r.status && (
                            <div>
                            <span className="text-zinc-400">Status:</span> {r.status}
                            </div>
                        )}
                        {r.availability && (
                            <div>
                            <span className="text-zinc-400">Availability:</span>{" "}
                            {r.availability}
                            </div>
                        )}
                        {r.shortage_reason && (
                            <div>
                            <span className="text-zinc-400">Reason:</span>{" "}
                            {r.shortage_reason}
                            </div>
                        )}
                        {r.openfda?.manufacturer_name && (
                            <div>
                            <span className="text-zinc-400">Manufacturer Name:</span>{" "}
                            {r.openfda.manufacturer_name}
                            </div>
                        )}
                        {r.openfda?.package_ndc && (
                            <div>
                            <span className="text-zinc-400">Package NDC:</span>{" "}
                            {r.openfda.package_ndc[0]}
                            </div>
                        )}
                        {r.update_date && (
                            <div>
                            <span className="text-zinc-400">Updated:</span>{" "}
                            {formatYmd(String(r.update_date))}
                            </div>
                        )}
                        </div>
                    </li>
                    );
                })}
                </ul>
            </div>
            )}

            <p className="mt-5 text-xs text-zinc-500">
                Data source: openFDA. This is informational and may not reflect real-time
                wholesaler availability.
            </p>
        </section>
    );
}