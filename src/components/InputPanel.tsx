"use client";

import { Task } from "@/types";

interface InputPanelProps {
  tasks: Task[];
  onChange: (tasks: Task[]) => void;
}

const defaultTask = (): Task => ({
  id: Math.random().toString(36).slice(2),
  name: "",
  effort: "medium",
  frequency: "weekly",
  personDependency: 3,
  typicality: 3,
  judgmentComplexity: 3,
});

const SliderField = ({
  label,
  value,
  onChange,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  hint?: string;
}) => (
  <div className="space-y-1.5">
    <div className="flex justify-between items-center">
      <label className="text-xs font-semibold text-slate-600 tracking-wide uppercase">
        {label}
      </label>
      <span className="text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full min-w-[28px] text-center">
        {value}
      </span>
    </div>
    <input
      type="range"
      min={1}
      max={5}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 rounded-full appearance-none bg-slate-200 accent-slate-700 cursor-pointer"
    />
    {hint && (
      <div className="flex justify-between text-[10px] text-slate-400">
        <span>低</span>
        <span>高</span>
      </div>
    )}
  </div>
);

export default function InputPanel({ tasks, onChange }: InputPanelProps) {
  const updateTask = (index: number, field: keyof Task, value: string | number) => {
    const updated = tasks.map((t, i) =>
      i === index ? { ...t, [field]: value } : t
    );
    onChange(updated);
  };

  const addTask = () => {
    if (tasks.length < 3) onChange([...tasks, defaultTask()]);
  };

  const removeTask = (index: number) => {
    onChange(tasks.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="pb-3 border-b border-slate-200">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-1.5 h-5 bg-slate-800 rounded-full" />
          <h2 className="text-sm font-bold text-slate-800 tracking-widest uppercase">
            業務入力
          </h2>
        </div>
        <p className="text-xs text-slate-500 pl-3.5">
          診断対象の業務を最大3件入力してください
        </p>
      </div>

      {/* Task Cards */}
      {tasks.map((task, index) => (
        <div
          key={task.id}
          className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden transition-shadow hover:shadow-md"
        >
          {/* Card Header */}
          <div className="bg-slate-800 px-4 py-2.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-slate-400 tracking-widest">
                TASK
              </span>
              <span className="text-lg font-bold text-white leading-none">
                0{index + 1}
              </span>
            </div>
            {tasks.length > 1 && (
              <button
                onClick={() => removeTask(index)}
                className="text-slate-500 hover:text-white text-xs transition-colors"
              >
                ✕ 削除
              </button>
            )}
          </div>

          <div className="p-4 space-y-4">
            {/* Business Name */}
            <div>
              <label className="text-xs font-semibold text-slate-600 tracking-wide uppercase block mb-1.5">
                業務名
              </label>
              <input
                type="text"
                placeholder="例：見積書の作成・送付"
                value={task.name}
                onChange={(e) => updateTask(index, "name", e.target.value)}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent placeholder:text-slate-300 text-slate-800"
              />
            </div>

            {/* Effort & Frequency row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 tracking-wide uppercase block mb-1.5">
                  工数
                </label>
                <select
                  value={task.effort}
                  onChange={(e) => updateTask(index, "effort", e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white text-slate-800 cursor-pointer"
                >
                  <option value="low">低（〜30分）</option>
                  <option value="medium">中（〜2時間）</option>
                  <option value="high">高（2時間〜）</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 tracking-wide uppercase block mb-1.5">
                  頻度
                </label>
                <select
                  value={task.frequency}
                  onChange={(e) =>
                    updateTask(index, "frequency", e.target.value)
                  }
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 bg-white text-slate-800 cursor-pointer"
                >
                  <option value="monthly">月1回</option>
                  <option value="weekly">週1回</option>
                  <option value="daily">毎日</option>
                </select>
              </div>
            </div>

            {/* Sliders */}
            <div className="space-y-3 pt-1">
              <SliderField
                label="属人度"
                value={task.personDependency}
                onChange={(v) => updateTask(index, "personDependency", v)}
                hint
              />
              <SliderField
                label="定型度"
                value={task.typicality}
                onChange={(v) => updateTask(index, "typicality", v)}
                hint
              />
              <SliderField
                label="判断難度"
                value={task.judgmentComplexity}
                onChange={(v) => updateTask(index, "judgmentComplexity", v)}
                hint
              />
            </div>
          </div>
        </div>
      ))}

      {/* Add Button */}
      {tasks.length < 3 && (
        <button
          onClick={addTask}
          className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm font-semibold text-slate-500 hover:border-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-all"
        >
          ＋ 業務を追加（{tasks.length}/3）
        </button>
      )}
    </div>
  );
}