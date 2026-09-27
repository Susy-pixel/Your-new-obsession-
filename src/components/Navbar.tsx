import React, { useState } from 'react';
import { Film, Sparkles, Compass, UserCheck, Info, Menu, X, Dna } from 'lucide-react';

interface NavbarProps {
  activeTab: 'home' | 'discover' | 'taste' | 'about';
  setActiveTab: (tab: 'home' | 'discover' | 'taste' | 'about') => void;
  onOpenTasteCreator: () => void;
  onTriggerSurprise: () => void;
  isSurpriseLoading?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenTasteCreator,
  onTriggerSurprise,
  isSurpriseLoading = false,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: 'home' | 'discover' | 'taste' | 'about') => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#07080c]/85 border-b border-white/[0.07] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 via-indigo-600 to-cyan-500 p-[1px] shadow-lg shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-all duration-300">
            <div className="w-full h-full bg-[#0a0c14] rounded-xl flex items-center justify-center">
              <Film className="w-5 h-5 text-violet-400 group-hover:text-cyan-300 transition-colors" />
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <span className="font-['Syne',sans-serif] font-extrabold text-xl tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-400 group-hover:to-cyan-300 transition-all">
              CINEMATCH
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-violet-400/80 font-medium -mt-0.5">
              Cinematic AI
            </span>
          </div>
        </div>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8">
          <button
            onClick={() => handleNavClick('home')}
            className={`text-sm font-medium transition-colors cursor-pointer py-1 relative ${
              activeTab === 'home' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Home
            {activeTab === 'home' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('discover')}
            className={`text-sm font-medium transition-colors cursor-pointer py-1 relative flex items-center gap-1.5 ${
              activeTab === 'discover' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-4 h-4 text-slate-400" />
            Discover
            {activeTab === 'discover' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('taste')}
            className={`text-sm font-medium transition-colors cursor-pointer py-1 relative flex items-center gap-1.5 ${
              activeTab === 'taste' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserCheck className="w-4 h-4 text-slate-400" />
            My Taste
            {activeTab === 'taste' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => handleNavClick('about')}
            className={`text-sm font-medium transition-colors cursor-pointer py-1 relative flex items-center gap-1.5 ${
              activeTab === 'about' ? 'text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Info className="w-4 h-4 text-slate-400" />
            About
            {activeTab === 'about' && (
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-violet-500 to-cyan-400 rounded-full" />
            )}
          </button>
        </nav>

        {/* Action Buttons */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onTriggerSurprise}
            disabled={isSurpriseLoading}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.09] border border-white/[0.1] rounded-xl flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            title="Surprise me with a wildcard recommendation"
          >
            <Sparkles className={`w-3.5 h-3.5 text-cyan-400 ${isSurpriseLoading ? 'animate-spin' : ''}`} />
            <span>{isSurpriseLoading ? 'Curating...' : 'Surprise Me'}</span>
          </button>

          <button
            onClick={onOpenTasteCreator}
            className="px-5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl shadow-lg shadow-violet-600/25 hover:shadow-violet-600/40 flex items-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
          >
            <Dna className="w-3.5 h-3.5 text-violet-200" />
            <span>Build My Taste</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2.5 rounded-xl bg-white/[0.05] border border-white/[0.08] text-slate-300 hover:text-white cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#090b12]/95 backdrop-blur-2xl px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            <button
              onClick={() => handleNavClick('home')}
              className={`text-left py-2 text-base font-medium ${
                activeTab === 'home' ? 'text-violet-400 font-semibold' : 'text-slate-300'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('discover')}
              className={`text-left py-2 text-base font-medium flex items-center gap-2 ${
                activeTab === 'discover' ? 'text-violet-400 font-semibold' : 'text-slate-300'
              }`}
            >
              <Compass className="w-4 h-4" />
              Discover Movies
            </button>
            <button
              onClick={() => handleNavClick('taste')}
              className={`text-left py-2 text-base font-medium flex items-center gap-2 ${
                activeTab === 'taste' ? 'text-violet-400 font-semibold' : 'text-slate-300'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              My Taste Profile
            </button>
            <button
              onClick={() => handleNavClick('about')}
              className={`text-left py-2 text-base font-medium flex items-center gap-2 ${
                activeTab === 'about' ? 'text-violet-400 font-semibold' : 'text-slate-300'
              }`}
            >
              <Info className="w-4 h-4" />
              About CINEMATCH
            </button>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex flex-col gap-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenTasteCreator();
              }}
              className="w-full py-3 text-sm font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-violet-600/30"
            >
              <Dna className="w-4 h-4" />
              Build My Taste
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onTriggerSurprise();
              }}
              disabled={isSurpriseLoading}
              className="w-full py-3 text-sm font-semibold text-slate-200 bg-white/[0.06] border border-white/[0.1] rounded-xl flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-cyan-400" />
              {isSurpriseLoading ? 'Curating Wildcard...' : 'Surprise Me'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
