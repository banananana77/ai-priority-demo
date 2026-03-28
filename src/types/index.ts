export interface Task {
  id: string;
  name: string;
  effort: "low" | "medium" | "high";
  frequency: "monthly" | "weekly" | "daily";
  personDependency: number; // 1-5
  typicality: number; // 1-5
  judgmentComplexity: number; // 1-5
}

export type Tag = "automation" | "ai-support" | "defer";

export interface TaskResult {
  task: Task;
  score: number;
  tag: Tag;
  reason: string;
  timeSaved: number; // hours/month
  costSaved: number; // yen/month
  action: {
    recommendation: string;
    difficulty: "low" | "medium" | "high";
    impact: "low" | "medium" | "high";
    pocPlan: string;
    before: string;
    after: string;
  };
}