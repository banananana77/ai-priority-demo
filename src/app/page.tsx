"use client";

import { useState } from "react";
import InputPanel from "@/components/InputPanel";
import RankingPanel from "@/components/RankingPanel";
import ActionPanel from "@/components/ActionPanel";
import { Task, TaskResult } from "@/types";
import { analyzeTasks } from "@/lib/scoring";

const INITIAL_TASKS: Task[] = [
  {
    id: "task-1",
    name: "見積書の作成・送付",
    effort: "medium",
    frequency: "daily",
    personDependency: 2,
    typicality: 4,
    judgmentComplexity: 2,
  },
];

export default function Page() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [results, setResults] = useState<TaskResult[]>([]);
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    const valid = tasks.filter((t) => t.name.trim());
    if (valid.length === 0) return;

    setLoading(true);
    setTimeout(() => {
      setResults(analyzeTasks(tasks));
      setAnalyzed(true);
      setLoading(false);
    }, 600);
  };

  const handleReset = () => {
    setResults([]);
    setAnalyzed(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Nav */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-slate-800 rounded-lg flex items-center justify-center">
              <div className="w-3 h-3 border-2 border-white rounded-sm" />
            </div>
            <div>
              <span className="text-sm font-black text-slate-800 tracking-tight">
                ObserverDrivenAI
              </span>
              <span className="hidden sm:inline text-xs text-slate-400 ml-2 font-medium">
                業務 × AI導入優先度診断
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              DEMO
            </span>
          </div>
        </div>
      </header>

      {/* Hero Strip */}
      <div className="bg-slate-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="max-w-2xl">
            <h1 className="text-xl sm:text-2xl font-black tracking-tight mb-1.5">
              どの業務から AI を導入すべきか、
              <br className="hidden sm:block" />
              <span className="text-amber-400">30秒で診断します。</span>
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              業務の特性を入力するだけで、AI導入インパクトを自動スコアリング。
              <br className="hidden sm:block" />
              優先度・削減コスト・最小PoC案まで一気通貫で可視化します。
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* LEFT: Input */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <InputPanel tasks={tasks} onChange={setTasks} />

            {/* Diagnose Button */}
            <div className="mt-5">
              <button
                onClick={analyzed ? handleReset : handleAnalyze}
                disabled={loading || tasks.filter((t) => t.name.trim()).length === 0}
                className={`w-full py-3.5 rounded-xl text-sm font-black tracking-wide transition-all shadow-sm
                  ${
                    analyzed
                      ? "bg-slate-200 text-slate-700 hover:bg-slate-300"
                      : loading
                      ? "bg-slate-400 text-white cursor-not-allowed"
                      : "bg-slate-800 text-white hover:bg-slate-700 active:scale-[0.98]"
                  }
                `}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    分析中...
                  </span>
                ) : analyzed ? (
                  "← やり直す"
                ) : (
                  "▶ 優先順位を診断する"
                )}
              </button>
              {!analyzed && (
                <p className="text-center text-[11px] text-slate-400 mt-2">
                  業務名を入力して診断を実行してください
                </p>
              )}
            </div>
          </div>

          {/* CENTER: Ranking */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <RankingPanel results={results} />
          </div>

          {/* RIGHT: Actions */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <ActionPanel results={results} />
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 text-center text-xs text-slate-400 space-y-1">
          <p>
            ※ 本診断はデモ用の簡易スコアリングです。正式導入には詳細ヒアリングと現場観測を行います。
          </p>
          <p>
            コスト計算は時給3,000円を基準に算出。実際は業務種別・人員構成により異なります。
          </p>
        </div>
      </main>
    </div>
  );
}