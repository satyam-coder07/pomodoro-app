"use client";

import { useEffect, useState } from "react";

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function Home() {
  const [remainingTime, setremainingTime] = useState(FOCUS_TIME);
  const [isTimerActive, setisTimerActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [completedSessions, setcompletedSessions] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("completedSessions");
      setcompletedSessions(saved ? parseInt(saved) : 0);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isTimerActive && remainingTime > 0) {
      timer = setInterval(() => {
        setremainingTime((t) => t - 1);
      }, 1000);
    } else if (remainingTime === 0) {
      const nextIsBreak = !isBreak;
      setIsBreak(nextIsBreak);
      setremainingTime(nextIsBreak ? BREAK_TIME : FOCUS_TIME);
      if (!nextIsBreak && typeof window !== "undefined") {
        setcompletedSessions((prev) => {
          const updated = prev + 1;
          localStorage.setItem("completedSessions", updated.toString());
          return updated;
        });
      }
    }
    return () => clearInterval(timer);
  }, [isTimerActive, remainingTime, isBreak]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const total = isBreak ? BREAK_TIME : FOCUS_TIME;
  const percentage = ((total - remainingTime) / total) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-200 p-4">
      <div className="max-w-sm w-full rounded-2xl shadow-xl p-6 bg-white">
        <div className="flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            {isBreak ? "Break Time" : "Focus Time"}
          </h1>
          <div className="relative w-40 h-40 mb-6">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="50%"
                cy="50%"
                r="60"
                stroke="#e5e7eb"
                strokeWidth="10"
                fill="none"
              />
              <circle
                cx="50%"
                cy="50%"
                r="60"
                stroke="#6366f1"
                strokeWidth="10"
                fill="none"
                strokeDasharray={2 * Math.PI * 60}
                strokeDashoffset={(1 - percentage / 100) * 2 * Math.PI * 60}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-3xl font-mono text-indigo-700">
              {formatTime(remainingTime)}
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setisTimerActive(!isTimerActive)}
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition cursor-pointer"
            >
              {isTimerActive ? "Pause" : "Start"}
            </button>
            <button
              onClick={() => {
                setisTimerActive(false);
                setremainingTime(isBreak ? BREAK_TIME : FOCUS_TIME);
              }}
              className="px-4 py-2 rounded-lg border border-indigo-600 text-indigo-600 hover:bg-indigo-100 transition cursor-pointer"
            >
              Reset
            </button>
          </div>
          <div className="text-sm text-gray-500 mt-6">
            Sessions completed:{" "}
            <span className="font-semibold text-indigo-700">{completedSessions}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
