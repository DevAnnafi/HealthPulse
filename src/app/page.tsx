'use client';

import Link from "next/link";
import Symptoms from "@/app/symptoms/page";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const card = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-muted px-6 text-center">

      {/* Background layers */}
      <div className="pointer-events-none absolute inset-0 -z-30 bg-[url('/noise.png')] opacity-[0.03]" />

      <div
        className="pointer-events-none absolute inset-0 -z-20 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/3 h-[500px] w-[500px] rounded-full bg-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 h-[500px] w-[500px] rounded-full bg-emerald-400/20 blur-3xl" />
      </div>

      {/* ---------------------------------------------
         Animated Hero Content
      --------------------------------------------- */}

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex max-w-5xl flex-col items-center"
      >
        {/* Badge */}
        <motion.div
          variants={item}
          className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1 text-sm text-muted-foreground backdrop-blur"
        >
          🏆 Build healthy streaks with real data
        </motion.div>

        {/* Headline */}
        <motion.h1
          variants={item}
          className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl"
        >
          Track symptoms.
          <span className="block text-cyan-500">Understand patterns.</span>
          <span className="block text-emerald-500">Improve consistently.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={item}
          className="mt-6 max-w-2xl text-lg text-muted-foreground"
        >
          HealthPulse transforms daily health logs into weekly trends,
          goal-driven streaks, and actionable insights—so progress is
          measurable, not guesswork.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={item}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          <Link
            href="/dashboard"
            className="rounded-lg bg-cyan-500 px-8 py-3 text-base font-medium text-white transition hover:bg-cyan-600"
          >
            Open Dashboard
          </Link>

          <Link
            href="/symptoms"
            className="rounded-lg border px-8 py-3 text-base font-medium text-muted-foreground transition hover:text-foreground"
          >
            Log Symptoms
          </Link>
        </motion.div>

        {/* ---------------------------------------------
           Animated Feature Cards
        --------------------------------------------- */}

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3"
        >
          <motion.div
            variants={card}
            className="rounded-xl border bg-background/60 p-6 backdrop-blur"
          >
            <div className="text-3xl font-bold">🏆</div>
            <div className="mt-2 font-semibold">Weekly Streaks</div>
            <div className="text-sm text-muted-foreground">
              Measure consistency, not just entries
            </div>
          </motion.div>

          <motion.div
            variants={card}
            className="rounded-xl border bg-background/60 p-6 backdrop-blur"
          >
            <div className="text-3xl font-bold">📈</div>
            <div className="mt-2 font-semibold">Trend Analytics</div>
            <div className="text-sm text-muted-foreground">
              Daily → weekly health insights
            </div>
          </motion.div>

          <motion.div
            variants={card}
            className="rounded-xl border bg-background/60 p-6 backdrop-blur"
          >
            <div className="text-3xl font-bold">🎯</div>
            <div className="mt-2 font-semibold">Goal Tracking</div>
            <div className="text-sm text-muted-foreground">
              Metric-aware goal evaluation
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </main>
  );
}