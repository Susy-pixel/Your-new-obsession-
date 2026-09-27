import React from 'react';
import { Film, Dna, Sparkles, Server, CheckCircle2, ShieldCheck, Database, Cpu, Layout } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'User Input',
      desc: 'The viewer expresses emotional desires, favored genres, favorite movies, and tonal calibration.',
      icon: Dna,
      color: 'text-violet-400',
    },
    {
      num: '02',
      title: 'Preference Collection',
      desc: 'Captures multi-dimensional constraints including era, language, mainstream bias, and structural complexity.',
      icon: Layout,
      color: 'text-indigo-400',
    },
    {
      num: '03',
      title: 'Movie Dataset',
      desc: 'Structured library of verified cinematic masterworks containing accurate directors, casts, durations, and tone scores.',
      icon: Database,
      color: 'text-cyan-400',
    },
    {
      num: '04',
      title: 'Recommendation Engine',
      desc: 'Local mathematical scoring algorithm filters candidate movies based on genre and mood overlap, avoiding hallucinations.',
      icon: Cpu,
      color: 'text-emerald-400',
    },
    {
      num: '05',
      title: 'Gemini AI',
      desc: 'Server-side LLM performs deep semantic reasoning to synthesize DNA archetypes and write personalized explanations.',
      icon: Sparkles,
      color: 'text-fuchsia-400',
    },
    {
      num: '06',
      title: 'Personalized Results',
      desc: 'Presented in a futuristic midnight UI with featured highlights, affinity percentages, and tailored dossiers.',
      icon: Film,
      color: 'text-amber-400',
    },
  ];

  return (
    <div className="space-y-16 py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-violet-950/50 border border-violet-500/30 text-xs font-semibold text-violet-300">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>About CINEMATCH</span>
        </div>

        <h1 className="font-['Syne',sans-serif] text-4xl sm:text-5xl font-extrabold text-white">
          The Art of Intentional Movie Discovery
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          CINEMATCH is an AI-powered movie recommendation system that combines
          preference-based filtering with Gemini's natural-language understanding to create
          personalized movie discovery.
        </p>
      </div>

      {/* The Core Thesis */}
      <div className="p-8 sm:p-10 rounded-3xl bg-[#0c0e17] border border-white/[0.08] shadow-2xl space-y-6">
        <h2 className="font-['Syne',sans-serif] text-2xl font-bold text-white">
          Why We Built CINEMATCH
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
          <p>
            Standard streaming algorithms trap viewers in repetitive loops, optimizing for
            passive watch-time rather than genuine emotional payoff. Conversely, raw AI
            chatbots often hallucinate non-existent movies, invent fake cast members, or
            generate vague, generic platitudes.
          </p>
          <p>
            CINEMATCH solves this with a robust <strong className="text-white">hybrid architecture</strong>:
            a verified, high-fidelity film dataset guarantees factual truth, while Gemini AI
            provides the human-like nuance of a seasoned cinema scholar explaining exactly <em>why</em> a film
            resonates with your specific mood tonight.
          </p>
        </div>
      </div>

      {/* Architecture Visualization Flow */}
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs uppercase tracking-widest text-cyan-400 font-extrabold">
            System Design
          </span>
          <h2 className="font-['Syne',sans-serif] text-3xl font-bold text-white">
            Hybrid Recommendation Pipeline
          </h2>
          <p className="text-sm text-slate-400 max-w-xl mx-auto">
            How user instincts travel from raw preferences to verified, personalized film recommendations.
          </p>
        </div>

        {/* Vertical/Grid Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((s, index) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="relative rounded-2xl bg-[#0e101a] border border-white/[0.08] p-6 flex flex-col justify-between space-y-4 group hover:border-violet-500/40 transition-all shadow-lg"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-500">
                      {s.num}
                    </span>
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>

                  <h3 className="font-['Syne',sans-serif] text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {s.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="pt-2 text-[10px] uppercase tracking-wider text-slate-500 font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400/80" />
                  <span>Pipeline Stage {index + 1}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Trust & Engineering Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="p-6 rounded-2xl bg-[#0c0e17] border border-white/[0.08] space-y-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          <h3 className="font-bold text-white text-base">Zero Hallucinations</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Every title, director, year, and actor is verified against curated film data before AI reasoning takes place.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0c0e17] border border-white/[0.08] space-y-3">
          <Server className="w-6 h-6 text-violet-400" />
          <h3 className="font-bold text-white text-base">Server-Side Security</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Gemini SDK calls are mediated strictly through backend server routes. No API credentials are ever exposed to the client.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-[#0c0e17] border border-white/[0.08] space-y-3">
          <Cpu className="w-6 h-6 text-cyan-400" />
          <h3 className="font-bold text-white text-base">Offline Fallback Resiliency</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            If API connectivity is ever interrupted, the internal deterministic scoring engine ensures flawless continuity without crashes.
          </p>
        </div>
      </div>
    </div>
  );
};
