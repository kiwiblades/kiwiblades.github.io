export type OpenFdaShortage = {
    generic_name?: string;
    
    route?: string;
    substance_name?: string;
    status?: string;
    availability?: string;
    shortage_reason?: string;
    update_date?: string;

    openfda?: {
        manufacturer_name?: string;
        package_ndc?: string[]
        brand_name?: string;
    }

    presentation?: string;

    [key: string]: unknown;
};

export type OpenFdaResponse = {
    meta?: { results?: { total?: number } };
    results?: OpenFdaShortage[];
    error?: { message?: string };
};

export function formatYmd(yyyymmdd?: string) {
    if (!yyyymmdd || yyyymmdd.length !== 8) return yyyymmdd ?? "";
    return `${yyyymmdd.slice(0,4)}-${yyyymmdd.slice(4,6)}-${yyyymmdd.slice(6,8)}`;
}

export function buildSearchQuery(q: string) {
    const safe = q.replaceAll(`"`, `\\"`);
    const hasSpace = /\s/.test(safe);

    // exact phrase matching for multi-word queries
    if (hasSpace) {
        return `openfda.brand_name:"${safe}" OR generic_name:"${safe}"`;
    }

    // single word, prefix wildcard
    return `openfda.brand_name:${safe}* OR generic_name:${safe}*`;
}

export async function fetchShortages(q: string, limit=10) {
    const url = new URL("https://api.fda.gov/drug/shortages.json");
    url.searchParams.set("search", buildSearchQuery(q));
    url.searchParams.set("limit", String(limit));

    const res = await fetch(url);
    const data = (await res.json()) as OpenFdaResponse;

    if (!res.ok) {
        throw new Error(data?.error?.message ?? `Request failed (${res.status})`);
    }

    console.log(data);

    return {
        total: data.meta?.results?.total ?? null,
        results: data.results ?? [],
        url: url.toString(),
    };
}