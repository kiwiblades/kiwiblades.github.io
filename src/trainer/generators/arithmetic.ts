import type { ArithmeticConfig, Problem, Operations } from "../types";

// ---- helper functions ----

function randInt(min: number, max: number): number {
    // inclusive
    const lo = Math.ceil(min);
    const hi = Math.floor(max);
    return Math.floor(Math.random() * (hi - lo + 1)) + lo;
}

function pickOne<T>(arr: readonly T[]): T {
    return arr[randInt(0, arr.length-1)];
}

// generate an id for the problem, includes fallback if browser doesn't support
function makeId(): string {
    return typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `p_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function clampRangeForNegatives(cfg: ArithmeticConfig) {
    if (!cfg.allowNegatives && cfg.range.min < 0) {
        return { ...cfg, range: { ...cfg.range, min: 0 } };
    }
    return cfg;
}

// ---- tagging helpers ----

function magnitudeTag(n: number): string {
    const a = Math.abs(n);
    if (a < 10) return "one-digit";
    if (a < 100) return "two-digit";
    return "three-plus-digit";
}

function opTag(op: Operations): string {
    switch (op) {
        case "+": return "add";
        case "-": return "sub";
        case "*": return "mult";
        case "/": return "div";
    }
}

// ---- core generator ----

export function generateArithmeticProblem(config: ArithmeticConfig): Problem {
    // pick operation, pick numbers based on the config
    const cfg = clampRangeForNegatives(config);
    const op = pickOne(cfg.operations);

    // generate operands with constraints per op
    let a: number;
    let b: number;
    let answer: number;

    if (op === "/") { // only div needs special consideration for divisor 0
        // avoid division by 0 and enforce clean integer results
        // strategy: choose divisor b, choose quotient q, set a = b*q
        const bMin = Math.max(cfg.range.min, cfg.allowNegatives ? -12 : 1);
        const bMax = Math.max(1, Math.min(cfg.range.max, 12));
        let divisor = randInt(bMin, bMax);

        if (divisor === 0) divisor = 1;

        const qMin = cfg.allowNegatives ? -12 : 0;
        const qMax = 12;
        const quotient = randInt(qMin, qMax);

        a = divisor * quotient;
        b = divisor;

        // if negatives aren't allowed, force non-negative operands
        if (!cfg.allowNegatives) {
            a = Math.abs(a);
            b = Math.abs(b);
        }

        answer = a/b;
    } else { // add, sub, mult
        a = randInt(cfg.range.min, cfg.range.max);
        b = randInt(cfg.range.min, cfg.range.max);

        if (!cfg.allowNegatives) {
            a = Math.abs(a);
            b = Math.abs(b);
        }

        switch (op) {
            case "+":
                answer = a+b;
                break;
            case "-":
                // prevent negative answer if negatives aren't allowed
                if (!cfg.allowNegatives) [a,b]=[Math.max(a,b),Math.min(a,b)];
                answer = a-b;
                break;
            case "*":
                answer = a*b;
                break;
            default:
                // should be unreachable, "/" is handled prior
                answer = 0;
        }
    }
    
    const tags: string[] = [
        "arithmetic",
        opTag(op),
        magnitudeTag(a),
        magnitudeTag(b),
    ];
    if (cfg.allowNegatives && (a<0 || b<0 || answer < 0)) tags.push("negatives");

    const prompt = `${a} ${op} ${b} = ?`;

    return {
        id: makeId(),
        prompt,
        answer,
        tags,
    };
}