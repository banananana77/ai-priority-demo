"use client";

import { TaskResult, Tag } from "@/types";

interface RankingPanelProps {
  results: TaskResult[];
}

const TAG_CONFIG: Record<
  Tag,
  { label: string; textColor: string; bgColor: string; borderColor: string; barColor: string }
> = {
  automation: {
    label: "自動化向き",
    textColor: "text-amber-800",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-300",
    barColor: "bg-amber-400",
  },
  "ai-support": {
    label: "AI支援向き",
    textColor: "text-blue-800",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-300",
    barColor: "bg-blue-500",
  },
  defer: {
    label: "後回しでOK",
    textColor: "text-slate-500",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    barColor: "bg-slate-300",
  },
};

const RANK_STYLE: Record<number, { badge: string; cardBorder: string }> = {
  0: { badge: "bg-amber-500 text-white", cardBorder: "border-amber-300" },
  1: { badge: "bg-slate-400 text-white", cardBorder: "border-slate-200" },
  2: { badge: "bg-slate-300 text-slate-700", cardBorder: "border-slate-200" },
};

function ScoreBar({ score, barColor }: { score: number; barColor: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs font-black text-slate-700 w-7 text-right tabular-nums">
        {score}
      </span>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="pb-3 border-b border-slate-200">
      <div className="flex items-center gap-2 mb-1">
        <div className="w-1.5 h-5 rounded-full bg-amber-500" />
        <h2 className="text-sm font-bold text-slate-800 tracking-widest uppercase">
          {title}
        </h2>
      </div>
      <p className="text-xs text-slate-500 pl-3.5">{subtitle}</p>
    </div>
  );
}

function Chip({
  icon,
  label,
  strong = false,
}: {
  icon: string;
  label: string;
  strong?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border
        ${
          strong
            ? "bg-emerald-50 border-emerald-200 text-emerald-700"
            : "bg-slate-50 border-slate-200 text-slate-600"
        }`}
    >
      {icon} {label}
    </span>
  );
}

export default function RankingPanel({ results }: RankingPanelProps) {
  if (results.length === 0) {
    return (
      <div className="h-full flex flex-col">
        <SectionHeader
          title="AI導入 優先順位"
          subtitle="診断結果がここに表示されます"
        />
        <div className="flex-1 flex items-center justify-center py-16">
          <div className="text-center space-y-3">
            <div className="text-5xl">📋</div>
            <p className="text-sm font-medium text-slate-500">
              業務を入力して
              <br />
              診断を実行してください
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalTimeSaved = results.reduce((sum, r) => sum + r.timeSaved, 0);
  const totalCostSaved = results.reduce((sum, r) => sum + r.costSaved, 0);

  return (
    <div className="space-y-4">
      <SectionHeader
        title="AI導入 優先順位"
        subtitle={`${results.length}件の業務を診断 — スコア順`}
      />

      {/* サマリーバー */}
      <div className="grid grid-cols-2 gap-2 p-3 bg-slate-800 rounded-xl">
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
            月間削減時間
          </p>
          <p className="text-xl font-black text-white tabular-nums">
            {totalTimeSaved.toFixed(0)}
            <span className="text-sm font-semibold text-slate-400 ml-0.5">h</span>
          </p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">
            月間削減コスト
          </p>
          <p className="text-xl font-black text-amber-400 tabular-nums">
            ¥{(totalCostSaved / 1000).toFixed(0)}
            <span className="text-sm font-semibold text-amber-600 ml-0.5">k</span>
          </p>
        </div>
      </div>

      {/* ランキングカード */}
      {results.map((result, index) => {
        const tag = TAG_CONFIG[result.tag];
        const rank = RANK_STYLE[index] ?? RANK_STYLE[2];

        return (
          <div
            key={result.task.id}
            className={`bg-white rounded-xl border-2 shadow-sm overflow-hidden ${rank.cardBorder}`}
          >
            {/* ヘッダー行：順位 + 業務名 + タグ */}
            <div className="flex items-start gap-3 px-4 pt-4 pb-2">
              <div
                className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black ${rank.badge}`}
              >
                {index + 1}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-800 leading-tight truncate">
                      {result.task.name || `業務 ${index + 1}`}
                    </p>
                    {index === 0 && (
                      <div className="text-xs text-red-500 font-bold mt-1">
                        最優先（今すぐ着手推奨）
                      </div>
                    )}
                  </div>
                  <span
                    className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full border
                      ${tag.bgColor} ${tag.borderColor} ${tag.textColor}`}
                  >
                    {tag.label}
                  </span>
                </div>
                <ScoreBar score={result.score} barColor={tag.barColor} />
              </div>
            </div>

            {/* 理由テキスト */}
            <div className="px-4 pb-3 pl-[60px]">
              <p className="text-xs text-slate-600 leading-relaxed">{result.reason}</p>
            </div>

            {/* 削減チップ */}
            <div className="px-4 pb-4 pl-[60px] flex flex-wrap gap-2">
              <Chip icon="⏱" label={`月 ${result.timeSaved.toFixed(0)}h 削減`} />
              <Chip
                icon="¥"
                label={`${result.costSaved.toLocaleString()}円/月`}
                strong={index === 0}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}