import type { Problem } from "../types";

export function gradeAnswer(problem: Problem, raw: string): boolean {
    const trimmed = raw.trim();
    if (!trimmed) return false;

    const n = Number(trimmed);
    if (Number.isNaN(n)) return false;

    return n === problem.answer;
}