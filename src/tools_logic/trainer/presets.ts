import type { ArithmeticConfig, PresetId } from "./types";

export const PRESETS: Record<Exclude<PresetId, "custom">, ArithmeticConfig> = {
    easy: {
        mode: "arithmetic",
        operations: ["+", "-"],
        range: { min: 0, max: 100},
        allowNegatives: false,
        allowDecimals: false,
        timed: true,
        timeLimitSec: 60,
        questionCount: 20,
    },
    medium: {
        mode: "arithmetic",
        operations: ["+", "-", "*", "/"],
        range: { min: 0, max: 1000},
        allowNegatives: false,
        allowDecimals: false,
        timed: true,
        timeLimitSec: 60,
        questionCount: 20,
    },
    hard: {
        mode: "arithmetic",
        operations: ["+", "-", "*", "/"],
        range: { min: -1000, max: 1000},
        allowNegatives: true,
        allowDecimals: false,
        timed: true,
        timeLimitSec: 60,
        questionCount: 20,
    },
};

export const DEFAULT_PRESET: PresetId = "easy";