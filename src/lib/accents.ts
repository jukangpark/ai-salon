// 회칙·명령어 페이지의 장/카테고리 강조색.
export type Accent = "violet" | "pink" | "cyan" | "fuchsia" | "amber";

export const accentClasses: Record<
  Accent,
  { badge: string; dot: string; border: string; glow: string; cmd: string }
> = {
  violet: {
    badge: "text-violet-300 bg-violet-500/10 border-violet-500/20",
    dot: "bg-violet-400",
    border: "border-violet-500/20",
    glow: "from-violet-600/5",
    cmd: "text-violet-200",
  },
  pink: {
    badge: "text-pink-300 bg-pink-500/10 border-pink-500/20",
    dot: "bg-pink-400",
    border: "border-pink-500/20",
    glow: "from-pink-600/5",
    cmd: "text-pink-200",
  },
  cyan: {
    badge: "text-cyan-300 bg-cyan-500/10 border-cyan-500/20",
    dot: "bg-cyan-400",
    border: "border-cyan-500/20",
    glow: "from-cyan-600/5",
    cmd: "text-cyan-200",
  },
  fuchsia: {
    badge: "text-fuchsia-300 bg-fuchsia-500/10 border-fuchsia-500/20",
    dot: "bg-fuchsia-400",
    border: "border-fuchsia-500/20",
    glow: "from-fuchsia-600/5",
    cmd: "text-fuchsia-200",
  },
  amber: {
    badge: "text-amber-300 bg-amber-500/10 border-amber-500/20",
    dot: "bg-amber-400",
    border: "border-amber-500/20",
    glow: "from-amber-600/5",
    cmd: "text-amber-200",
  },
};
