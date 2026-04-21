import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { motion } from 'motion/react';
import { LayoutGrid, Binary, Activity, Code } from 'lucide-react';

export default function App() {
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);

  return (
    <div className="h-screen w-full bg-[#050505] text-gray-200 flex flex-col font-sans select-none overflow-hidden">
      
      {/* Header */}
      <header className="h-16 border-b border-neon-cyan/20 px-8 flex items-center justify-between bg-[#0a0a0a]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-tr from-neon-cyan to-neon-pink rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,243,255,0.4)]">
            <span className="text-black font-black text-xs italic">SS</span>
          </div>
          <h1 className="text-xl font-bold tracking-tighter text-white">NEON<span className="text-neon-cyan">SYNTH</span>_SNAKE</h1>
        </div>
        
        <div className="flex items-center gap-6 text-[11px] font-mono tracking-widest text-neon-cyan">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-pulse shadow-[0_0_8px_#00f3ff]"></div>
            SYSTEM: OPTIMAL
          </div>
          <div className="text-neon-pink">LATENCY: 12MS</div>
          <div className="bg-neon-cyan/10 px-3 py-1 border border-neon-cyan/30 rounded">v.4.2.0-STABLE</div>
        </div>
      </header>

      {/* Main Content Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Rail: Info & Visualizer */}
        <aside className="w-72 border-r border-neon-cyan/10 p-6 flex flex-col gap-8 bg-[#070707] overflow-y-auto">
          <div>
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4">Core Telemetry</h2>
            <div className="space-y-3">
              {[
                { label: 'AUDIO FREQ', val: '44.1 kHz', icon: Radio },
                { label: 'THREAD ID', val: '0x3F2A', icon: Binary },
                { label: 'SYNC RATE', val: '99.9%', icon: Activity },
              ].map((item, i) => (
                <div key={i} className="p-3 bg-white/5 border-l-2 border-neon-cyan/50 rounded-r-md">
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-[9px] text-gray-500 uppercase font-mono">{item.label}</span>
                   </div>
                   <p className="text-sm font-bold text-neon-cyan font-mono tracking-wider">{item.val}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-end">
            <div className="bg-black/40 border border-neon-pink/20 p-4 rounded-xl">
              <h3 className="text-[10px] text-neon-pink uppercase tracking-widest mb-4 flex items-center gap-2">
                <Code size={12} /> Buffer Stream
              </h3>
              <div className="flex items-end gap-1 h-12">
                {[40, 70, 90, 50, 80, 30, 60, 45, 75, 85].map((h, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [`${h}%`, `${Math.random() * 100}%`, `${h}%`] }}
                    transition={{ duration: 0.5 + Math.random(), repeat: Infinity }}
                    className="flex-1 bg-neon-pink/60 rounded-t-sm"
                  />
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Center: Snake Game Window */}
        <main className="flex-1 flex items-center justify-center relative p-8">
          <div className="absolute inset-0 opacity-10">
            <div className="h-full w-full bg-[radial-gradient(var(--color-neon-cyan)_1px,transparent_1px)] [background-size:40px_40px]"></div>
          </div>
          
          {/* Game Board Container */}
          <div className="relative z-10">
            <SnakeGame onScoreChange={setCurrentScore} onHighScoreChange={setHighScore} />
          </div>
        </main>

        {/* Right Rail: Stats & Rankings */}
        <aside className="w-72 border-l border-neon-cyan/10 p-6 bg-[#070707] flex flex-col">
          <div className="mb-8">
            <h2 className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-4">Match Stats</h2>
            <div className="bg-black border border-neon-cyan/20 p-5 rounded-xl text-center space-y-1">
              <p className="text-xs text-gray-500 uppercase tracking-tighter">Current Score</p>
              <p className="text-5xl font-mono font-black text-white">{currentScore.toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between text-xs items-center">
              <span className="text-gray-500 uppercase font-mono">High Score</span>
              <span className="text-neon-pink font-mono text-lg">{highScore.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs items-center border-t border-white/5 pt-4">
              <span className="text-gray-500 uppercase font-mono">Multiplier</span>
              <span className="text-neon-cyan font-mono">x1.4</span>
            </div>
            <div className="flex justify-between text-xs items-center">
              <span className="text-gray-500 uppercase font-mono">Speed Lvl</span>
              <span className="text-neon-green font-mono">08</span>
            </div>
          </div>

          <div className="mt-auto">
            <h3 className="text-[10px] text-gray-500 uppercase tracking-widest mb-4">Rankings</h3>
            <div className="space-y-2">
              {[
                { name: 'PLAYER_X', score: '22,400' },
                { name: 'VAPOR_WAVE', score: '19,100' },
                { name: 'NEON_SOUL', score: '16,850' },
              ].map((r, i) => (
                <div key={i} className={`flex justify-between items-center text-[11px] p-2 ${i === 0 ? 'bg-white/5 border-l border-neon-cyan rounded-r font-bold' : 'opacity-60'}`}>
                  <span className={i === 0 ? "text-neon-cyan" : ""}>{`0${i+1}. ${r.name}`}</span>
                  <span className="font-mono">{r.score}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Footer: Music Player Controls */}
      <footer className="h-28 bg-[#0a0a0a] border-t border-neon-cyan/20 px-8">
        <MusicPlayer />
      </footer>
    </div>
  );
}
const Radio = (props: any) => <Activity {...props} />;
