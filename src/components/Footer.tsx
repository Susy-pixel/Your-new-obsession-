import React from 'react';
import { Film, Sparkles, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (tab: 'home' | 'discover' | 'taste' | 'about') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full border-t border-white/[0.08] bg-[#07080c] mt-24 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo & Tagline */}
          <div className="flex flex-col items-center md:items-start space-y-1">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-600/30">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="font-['Syne',sans-serif] font-extrabold text-lg text-white tracking-wider">
                CINEMATCH
              </span>
            </div>
            <p className="text-sm font-medium text-slate-400 italic">
              "Your next obsession is waiting."
            </p>
          </div>

          {/* Quick Nav Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('discover')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              Discover
            </button>
            <button
              onClick={() => onNavigate('taste')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              My Taste
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="hover:text-white transition-colors cursor-pointer"
            >
              About
            </button>
          </nav>
        </div>

        {/* Bottom Credits & Subtitle */}
        <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>AI Movie Recommendation System</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-violet-400 font-medium">Built with Gemini AI</span>
          </div>

          <div className="text-slate-400">
            CINEMATCH © {new Date().getFullYear()} · All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
