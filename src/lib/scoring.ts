import { Task, TaskResult, Tag } from "@/types";

const EFFORT_MAP = { low: 1, medium: 2, high: 3 };
const FREQ_MAP = { monthly: 1, weekly: 2, daily: 3 };
const HOURS_MAP = {
  daily: { low: 10, medium: 20, high: 40 },
  weekly: { low: 2, medium: 5, high: 10 },
  monthly: { low: 0.5, medium: 1.5, high: 3 },
};
const HOURLY_RATE = 3000; // ¥3,000/hour assumption

function computeScore(task: Task): number {
  const effort = EFFORT_MAP[task.effort] / 3;
  const freq = FREQ_MAP[task.frequency] / 3;
  const person = task.personDependency / 5;
  const typical = task.typicality / 5;
  const judgment = task.judgmentComplexity / 5;

  // Weighted priority score
  const raw =
    freq * 0.30 +
    effort * 0.20 +
    typical * 0.20 +
    person * 0.15 +
    judgment * 0.15;

  return Math.round(raw * 100);
}

function computeTag(task: Task): Tag {
  const freq = FREQ_MAP[task.frequency];
  const effort = EFFORT_MAP[task.effort];

  if (freq >= 2 && task.typicality >= 4) return "automation";
  if (task.personDependency >= 4 && task.judgmentComplexity >= 4) return "ai-support";
  if (freq === 1 && effort === 1) return "defer";

  // fallback heuristics
  if (task.typicality >= 3 && freq >= 2) return "automation";
  if (task.judgmentComplexity >= 3 && task.personDependency >= 3) return "ai-support";
  return "defer";
}

function computeReason(task: Task, tag: Tag): string {
  if (tag === "automation") {
    return `頻度が高く定型的なパターンが多いため、RPA・AIフローによる自動化で工数を大幅削減できます。`;
  }
  if (tag === "ai-support") {
    return `属人知識・高度な判断が必要なため、完全自動化より AI補助による意思決定支援が最適です。`;
  }
  return `発生頻度・工数ともに低いため、他業務の改善効果が出てから着手する優先度です。`;
}

function computeAction(task: Task, tag: Tag): TaskResult["action"] {
  if (tag === "automation") {
    const effortLabel = task.effort === "high" ? "大規模" : "中規模";
    return {
      recommendation: `定型フロー自動化（RPA / ノーコードAI）`,
      difficulty: task.effort === "high" ? "medium" : "low",
      impact: task.frequency === "daily" ? "high" : "medium",
      pocPlan: `対象チームで2〜3週間のパイロット検証。${effortLabel}フローのみ先行実装。`,
      before: `手動実行（${task.frequency === "daily" ? "毎日" : task.frequency === "weekly" ? "週1" : "月1"}、工数${task.effort === "high" ? "大" : task.effort === "medium" ? "中" : "小"}）`,
      after: `自動実行（担当者ゼロ介入・エラー時のみ通知）`,
    };
  }
  if (tag === "ai-support") {
    return {
      recommendation: `AI補助型意思決定支援（LLM＋社内ナレッジ連携）`,
      difficulty: "medium",
      impact: "high",
      pocPlan: `経験3年以上のメンバー2名と1ヶ月間のシャドウ検証。ナレッジ収集フェーズを先行実施。`,
      before: `担当者の記憶・経験ベースで判断（属人性高・引き継ぎコスト大）`,
      after: `AIが過去事例・ナレッジを即時参照し、判断の初期案を提示`,
    };
  }
  return {
    recommendation: `テンプレート整備＋軽量AI補助`,
    difficulty: "low",
    impact: "low",
    pocPlan: `まずドキュメント化・テンプレート化から着手。自動化は次フェーズで検討。`,
    before: `不定期・個人対応（可視化されていない）`,
    after: `テンプレート化により作業時間を30〜50%削減`,
  };
}

export function analyzeTasks(tasks: Task[]): TaskResult[] {
  return tasks
    .filter((t) => t.name.trim() !== "")
    .map((task) => {
      const score = computeScore(task);
      const tag = computeTag(task);
      const reason = computeReason(task, tag);
      const action = computeAction(task, tag);

      const timeSaved = HOURS_MAP[task.frequency][task.effort] * (tag === "automation" ? 0.8 : tag === "ai-support" ? 0.5 : 0.2);
      const costSaved = Math.round(timeSaved * HOURLY_RATE);

      return { task, score, tag, reason, timeSaved, costSaved, action };
    })
    .sort((a, b) => b.score - a.score);
}