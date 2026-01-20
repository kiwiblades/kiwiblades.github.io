export type Problem = {
    id: string;
    prompt: string;
    answer: number;
    tags: string[];
};

export type Attempt = {
    problemId: string;
    prompt: string;
    correctAnswer: number;
    userAnswer: string;
    correct: boolean;
    timeMs: number;
    tags: string[];
    opTag: string;
};

export type SessionResult = {
    startedAt: number;
    endedAt: number;
    config: ArithmeticConfig;
    attempts: Attempt[];
}

export type SessionState =
    | { status: "idle" }
    | {
        status: "running";
        config: ArithmeticConfig;
        startedAt: number;
        questionStartedAt: number;
        attempts: Attempt[];
        current: Problem;
        // for timed mode
        timeLimitSec?: number;
        elapsedSec?: number;
    }
    | { status: "finished"; result: SessionResult };

export type PresetId = "easy" | "medium" | "hard" | "custom"; // subjective, so custom config will be allowed
export type Operations = "+" | "-" | "*" | "/"; // basic enum for arithmetic problems

export type ArithmeticConfig = {
    mode: "arithmetic";
    operations: Operations[];
    range: { min: number; max: number };
    allowNegatives: boolean;
    allowDecimals: boolean; // false for now
    timed: boolean;
    timeLimitSec: number; // used if timed
    questionCount: number; // used if not timed
}