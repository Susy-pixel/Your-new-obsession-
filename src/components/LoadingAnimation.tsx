import React, { useEffect, useState } from 'react';
import { Film, Dna, Sparkles, Orbit } from 'lucide-react';

const SCAN_PHRASES = [
  'Scanning your cinematic DNA...',
  'Deconstructing emotional & genre coordinates...',
  'Cross-referencing 70+ curated narrative masterworks...',
  'Evaluating directorial sensibilities with Gemini AI...',
  'Synthesizing personalized match explanations...',
  'Finalizing your cinematic horizon...',
];

export const LoadingAnimation: React.FC = () => {
  const [phraseIndex, setPhraseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((prev) => (prev + 1) % SCAN_PHRASES.length);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background glow blooms */}
      <div className="absolute w-[450px] h-[450px] bg-violet-600/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute w-[350px] h-[350px] bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Futuristic Scanner Reel */}
      <div className="relative mb-8">
        {/* Outer Orbit Ring */}
        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full border border-violet-500/30 animate-spin flex items-center justify-center">
          <div className="w-full h-full rounded-full border-t-2 border-cyan-400" />
        </div>

        {/* Inner Pulsing Core */}
        <div className="absolute inset-0 m-auto w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-violet-900 to-indigo-800 border border-violet-400/40 flex items-center justify-center shadow-lg shadow-violet-600/30 animate-pulse">
          <Film className="w-8 h-8 text-cyan-300" />
        </div>

        {/* Small orbital particle */}
        <div className="absolute top-1 left-1 w-3 h-3 rounded-full bg-cyan-400 shadow-md shadow-cyan-400/80 animate-ping" />
      </div>

      {/* Main Status */}
      <div className="text-center space-y-3 max-w-md mx-auto z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.05] border border-white/[0.1] text-xs font-semibold text-slate-300">
          <Dna className="w-3.5 h-3.5 text-violet-400 animate-spin" />
          <span>CINEMATCH Neural Core</span>
        </div>

        <h3 className="font-['Syne',sans-serif] text-2xl sm:text-3xl font-bold text-white tracking-wide">
          Scanning your cinematic DNA...
        </h3>

        <p className="text-sm font-medium text-cyan-300 h-6 transition-all duration-300">
          {SCAN_PHRASES[phraseIndex]}
        </p>

        {/* Waveform Bars */}
        <div className="flex items-center justify-center gap-1.5 pt-4">
          {[40, 70, 95, 60, 85, 50, 90, 65, 45, 80, 55].map((height, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-violet-500 to-cyan-400 rounded-full animate-pulse"
              style={{
                height: `${height * 0.3}px`,
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.8s',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
