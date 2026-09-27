import React, { useState } from 'react';
import { Sparkles, Dna, ArrowRight, Film, Sun, Layers, Zap, Flame, Heart, Laugh } from 'lucide-react';
import heroReelImage from '../assets/images/cinematic_hero_reel_1790509337932.jpg';
import { UserPreferences } from '../types';

interface HeroProps {
  onOpenTasteCreator: () => void;
  onTriggerSurprise: () => void;
  onQuickMatch: (mood: string) => void;
  isSurpriseLoading?: boolean;
}

const QUICK_MOODS = [
  { id: 'Mind-Bending', label: 'Mind-Bending', icon: Layers },
  { id: 'Thrilling', label: 'Thrilling', icon: Zap },
  { id: 'Feel Good', label: 'Feel Good', icon: Sun },
  { id: 'Dark', label: 'Dark', icon: Flame },
  { id: 'Emotional', label: 'Emotional', icon: Heart },
  { id: 'Funny', label: 'Funny', icon: Laugh },
];

export const Hero: React.FC<HeroProps> = ({
  onOpenTasteCreator,
  onTriggerSurprise,
  onQuickMatch,
  isSurpriseLoading = false,
}) => {
  return (
    <section className="relative overflow-hidden pt-8 pb-16 lg:pt-14 lg:pb-20">
      {/* Background Ambient Spotlights */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none overflow-hidden opacity-50">
        <div className="absolute top-[-80px] left-[20%] w-[400px] h-[400px] bg-violet-700/20 blur-[120px] rounded-full" />
        <div className="absolute top-[60px] right-[15%] w-[350px] h-[350px] bg-cyan-600/15 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Clear & Simple Typography */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-950/50 border border-violet-500/20 text-xs font-semibold text-violet-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Powered by Gemini AI · Smart Movie Discovery</span>
            </div>

            <div className="space-y-3">
              <h1 className="font-['Syne',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
                Find the movie you{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-indigo-300 to-cyan-300">
                  didn't know
                </span>{' '}
                you needed.
              </h1>
              <p className="text-base sm:text-lg text-slate-300 font-normal max-w-xl mx-auto lg:mx-0">
                Tell CINEMATCH what moves you. We'll find the stories that match.
              </p>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                onClick={onOpenTasteCreator}
                className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 rounded-xl shadow-lg shadow-violet-600/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-[0.98]"
              >
                <Dna className="w-4 h-4 text-violet-200" />
                <span>Build My Taste</span>
                <ArrowRight className="w-4 h-4 text-cyan-200" />
              </button>

              <button
                onClick={onTriggerSurprise}
                disabled={isSurpriseLoading}
                className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-slate-200 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/[0.1] rounded-xl flex items-center justify-center gap-2.5 transition-all cursor-pointer active:scale-[0.98]"
              >
                <Sparkles className={`w-4 h-4 text-cyan-400 ${isSurpriseLoading ? 'animate-spin' : ''}`} />
                <span>{isSurpriseLoading ? 'Choosing...' : 'Surprise Me'}</span>
              </button>
            </div>

            {/* Quick 1-Click Mood Bar */}
            <div className="pt-4 space-y-2.5">
              <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                Or jump straight in with a mood:
              </span>
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                {QUICK_MOODS.map((m) => {
                  const Icon = m.icon;
                  return (
                    <button
                      key={m.id}
                      onClick={() => onQuickMatch(m.id)}
                      className="px-3.5 py-1.5 rounded-lg border border-white/[0.08] bg-white/[0.03] hover:bg-violet-600/30 hover:border-violet-400 text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Icon className="w-3.5 h-3.5 text-violet-400" />
                      <span>{m.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Sleek Abstract Visual */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-sm aspect-[4/3] rounded-2xl overflow-hidden border border-white/[0.12] bg-[#0c0e17] shadow-2xl">
              <img
                src={heroReelImage}
                alt="Cinematic glowing film reel"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07080c] via-transparent to-black/20" />
              <div className="absolute bottom-3 left-3 right-3 backdrop-blur-md bg-black/60 border border-white/[0.1] rounded-xl px-3.5 py-2 flex items-center justify-between text-xs text-slate-200">
                <span className="font-semibold">Gemini AI Curator</span>
                <span className="text-cyan-300 font-medium">Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
