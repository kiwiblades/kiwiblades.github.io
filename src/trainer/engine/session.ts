import type { ArithmeticConfig, Attempt, Problem, SessionResult, SessionState } from "../types";
import { generateArithmeticProblem } from "../generators/arithmetic";
import { gradeAnswer } from "./grade";

function now(): number {
    return Date.now();
}

function shouldFinish(cfg: ArithmeticConfig, attemptsCount: number): boolean {
    if (cfg.timed) return false; // timed finishing is handled by the actual timer in ui
    return attemptsCount >= cfg.questionCount;
}

// these are the only functions the frontend should call

export function startSession(config: ArithmeticConfig): SessionState {
    const current = generateArithmeticProblem(config);
    const t = now();
    return {
        status: "running",
        config,
        startedAt: t,
        questionStartedAt: t,
        attempts: [],
        current,
        timeLimitSec: config.timed ? config.timeLimitSec : undefined,
        elapsedSec: config.timed ? 0 : undefined,
    };
}

export function submitAnswer(state: SessionState, userAnswer: string): SessionState {
    if (state.status !== "running") return state;

    // collect the finishing time and grade the submitted answer
    const t = now();
    const correct = gradeAnswer(state.current, userAnswer);

    // parse info about the current attempt
    const attempt: Attempt = {
        problemId: state.current.id,
        prompt: state.current.prompt,
        correctAnswer: state.current.answer,
        userAnswer,
        correct,
        timeMs: t - state.questionStartedAt,
        tags: state.current.tags,
        opTag: state.current.tags.find(tag => ["add","sub","mult","div"].includes(tag)) ?? "unknown",
    };
    const attempts = [...state.attempts, attempt]; // append the current attempt

    // if the session finished, provide the total session result
    if (shouldFinish(state.config, attempts.length)) {
        const result: SessionResult = {
            startedAt: state.startedAt,
            endedAt: t,
            config: state.config,
            attempts,
        };
        return { status: "finished", result };
    }

    // otherwise, generate the next problem and continue evaluating
    const next: Problem = generateArithmeticProblem(state.config);
    return {
        ...state,
        attempts,
        current: next,
        questionStartedAt: t,
    };
}

export function finishSession(state: SessionState): SessionState {
    if (state.status !== "running") return state;

    const t = now();
    const result: SessionResult = {
        startedAt: state.startedAt,
        endedAt: t,
        config: state.config,
        attempts: state.attempts,
    };
    return { status: "finished", result };
}