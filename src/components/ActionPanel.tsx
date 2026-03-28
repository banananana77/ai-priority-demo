"use client";

import { TaskResult } from "@/types";

interface ActionPanelProps {
  results: TaskResult[];
}

const LEVEL_LABEL: Record<"low" | "medium" | "high", string> = {
  low: "低",
  medium: "中",
  high: "高",
};

const DIFFICULTY_STYLE: Record<"low" | "medium" | "high", string> = {
  low: "bg-emerald-50 border-emerald-200 text-emerald-700",
  medium: "bg-amber-50 border-amber-200 text-amber-700",
  high: "bg-red-50 border-red-200 text-red-700",
};

const IMPACT_STYLE: Record<"low" | "medium" | "high", { bar: string; text: string; width: string }> = {
  low: { bar: "bg-slate-300", text: "text-slate-600", width: "w-1/3" },
  medium: { bar: "bg-blue-400", text: "text-blue-700", width: "w-2/3" },
  high: { bar: "bg-amber-500", text: "text-amber-700", width: "w-full" },
};

function Label({ text }: { text: string }) {
  return (
    <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1.5">
      {text}
    </p>
  );
}

function SectionDivider() {
  return <div className="border-t border-slate-100 my-3" />;
}

export default function ActionPanel({ results }: ActionPanelProps) {
  // ① 空状態
  if (results.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <div className="pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-5 rounded-full bg-blue-500" />
            <h2 className="text-sm font-bold text-slate-800 tracking-widest uppercase">
              最優先アクション
            </h2>
          </div>
          <p className="text-xs text-slate-500 pl-3.5">
            診断後にアクションが表示されます
          </p>
        </div>
        <div className="flex-1 flex items-center justify-center py-16">
          <div className="text-center space-y-3">
            <div className="text-5xl">🎯</div>
            <p className="text-sm font-medium text-slate-500">
              診断後に最優先の
              <br />
              導入アクションを提案します
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ② 1位のタスクのみ表示
  const top = results[0];
  const { action, task } = top;
  const impact = IMPACT_STYLE[action.impact];

  return (
    <div className="space-y-0">
      {/* セクションヘッダー */}
      <div className="pb-3 border-b border-slate-200 mb-4">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-5 rounded-full bg-blue-500" />
          <h2 className="text-sm font-bold text-slate-800 tracking-widest uppercase">
            最優先アクション
          </h2>
        </div>
        <p className="text-xs text-slate-500 pl-3.5">
          最もインパクトの大きい業務の導入施策
        </p>
      </div>

      {/* 対象業務バナー */}
      <div className="bg-slate-800 rounded-xl px-4 py-3 mb-4">
        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-0.5">
          対象業務 — 優先度 1位
        </p>
        <p className="text-base font-black text-white">
          {task.name || "業務 1"}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] font-bold text-amber-400">
            Score {top.score}
          </span>
          <span className="text-slate-600 text-[10px]">|</span>
          <span className="text-[10px] font-bold text-emerald-400">
            月 ¥{top.costSaved.toLocaleString()} 削減見込み
          </span>
        </div>
        <p className="text-xs text-red-400 font-bold mt-2">
          ※ この業務を放置すると年間 約 ¥{(top.costSaved * 12).toLocaleString()} の機会損失
        </p>
      </div>

      {/* 推奨アクション */}
      <div className="mb-4">
        <Label text="推奨施策" />
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-3.5 py-2.5">
          <p className="text-sm font-bold text-blue-900">{action.recommendation}</p>
        </div>
      </div>

      {/* 難易度 / インパクト */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div>
          <Label text="導入難易度" />
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border ${DIFFICULTY_STYLE[action.difficulty]}`}
          >
            <span className="text-[10px]">◉</span>
            {LEVEL_LABEL[action.difficulty]}
          </span>
        </div>
        <div>
          <Label text="効果見込み" />
          <div className="space-y-1">
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border bg-white border-slate-200 ${impact.text}`}
            >
              <span className="text-[10px]">◈</span>
              {LEVEL_LABEL[action.impact]}
            </span>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${impact.bar} ${impact.width} transition-all duration-700`} />
            </div>
          </div>
        </div>
      </div>

      <SectionDivider />

      {/* PoC計画 */}
      <div className="mb-4">
        <Label text="最小PoC計画" />
        <div className="bg-slate-50 border border-slate-200 rounded-lg px-3.5 py-2.5">
          <p className="text-xs text-slate-700 leading-relaxed">{action.pocPlan}</p>
        </div>
      </div>

      <SectionDivider />

      {/* Before / After */}
      <div className="mb-4">
        <Label text="Before / After" />
        <div className="space-y-2">
          {/* Before */}
          <div className="flex items-start gap-2.5">
            <span className="flex-shrink-0 text-[10px] font-black text-slate-500 bg-slate-100 border border-slate-200 rounded px-1.5 py-0.5 mt-0.5 leading-tight">
              BEFORE
            </span>
            <p className="text-xs text-slate-600 leading-relaxed pt-0.5">
              {action.before}
            </p>
          </div>

          {/* 矢印 */}
          <div className="flex items-center gap-2 pl-1">
            <div className="w-px h-4 bg-slate-200 ml-6" />
          </div>
          <div className="pl-7 -mt-1 mb-1">
            <span className="text-slate-300 text-sm">▼</span>
          </div>

          {/* After */}
          <div className="flex items-start gap-2.5">
            <span className="flex-shrink-0 text-[10px] font-black text-blue-600 bg-blue-50 border border-blue-200 rounded px-1.5 py-0.5 mt-0.5 leading-tight">
              AFTER
            </span>
            <p className="text-xs text-blue-800 font-semibold leading-relaxed pt-0.5">
              {action.after}
            </p>
          </div>
        </div>
      </div>

      {/* 2位以降のサマリー（存在する場合） */}
      {results.length > 1 && (
        <>
          <SectionDivider />
          <div>
            <Label text="他の業務の推奨施策" />
            <div className="space-y-2">
              {results.slice(1).map((r, i) => (
                <div
                  key={r.task.id}
                  className="flex items-start gap-2.5 p-2.5 bg-slate-50 border border-slate-200 rounded-lg"
                >
                  <span className="flex-shrink-0 text-xs font-black text-slate-400 w-4">
                    {i + 2}
                  </span>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate">
                      {r.task.name || `業務 ${i + 2}`}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed line-clamp-1">
                      {r.action.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* CTA */}
      <div className="mt-5 bg-slate-800 rounded-xl p-4 text-center">
        <p className="text-xs text-slate-400 mb-1">ObserverDrivenAI</p>
        <p className="text-sm font-bold text-white">
          この業務、月 ¥{top.costSaved.toLocaleString()} 削減できます。具体設計を一緒に詰めますか？
        </p>
        <p className="text-xs text-red-400 font-bold mt-1">
          ※ 放置すると年間 約 ¥{(top.costSaved * 12).toLocaleString()} の損失
        </p>
        <button
          className="mt-4 w-full bg-amber-500 text-white py-3 rounded-lg font-bold text-sm hover:bg-amber-600 transition-colors active:scale-[0.98]"
          onClick={() => {
            window.open("https://calendly.com/your-link", "_blank");
          }}
        >
          15分で「削減プラン」を具体化する（無料）
        </button>
        <button
          className="mt-2 w-full bg-slate-700 text-white py-2 rounded-lg text-sm hover:bg-slate-600 transition-colors"
          onClick={() => {
            window.location.href = "mailto:your@email.com";
          }}
        >
          この内容をそのまま相談する
        </button>
      </div>
    </div>
  );
}