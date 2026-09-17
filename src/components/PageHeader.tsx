"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeUp, stagger } from "@/lib/motion";

// 상단 배지 + 그라데이션 제목(+ 둘째 줄) + 설명.
export default function PageHeader({
  badge,
  title,
  subtitle,
  description,
  className,
}: {
  badge: React.ReactNode;
  title: string;
  subtitle?: string;
  description: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative pt-32 pb-12 px-6 text-center", className)}>
      <motion.div initial="hidden" animate="visible" variants={stagger(0.08)} className="max-w-3xl mx-auto">
        <motion.div variants={fadeUp} className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card text-sm text-slate-400 font-medium">
            {badge}
          </span>
        </motion.div>
        <motion.h1 variants={fadeUp} className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
          <span className="gradient-text">{title}</span>
          {subtitle && (
            <>
              <br />
              <span className="text-slate-100">{subtitle}</span>
            </>
          )}
        </motion.h1>
        <motion.p variants={fadeUp} className="text-slate-500 text-sm">
          {description}
        </motion.p>
      </motion.div>
    </section>
  );
}
