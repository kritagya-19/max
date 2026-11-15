import React from "react";
import { Button } from "@/components/ui/button";
import { Shield, Trophy, Flame, Zap, Gauge, Sparkles } from "lucide-react";

export default function App() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-accent selection:text-white">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-6">
          <div className="flex items-center space-x-3">
            <span className="h-3 w-3 rounded-full bg-accent animate-pulse shadow-[0_0_12px_#FF1744]" />
            <span className="font-display tracking-wider text-xl uppercase font-bold text-white">
              VERSTAPPEN <span className="text-accent">#1</span>
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-xs font-mono tracking-widest text-muted-foreground uppercase hidden sm:inline-block">
              Red Bull Racing Theme System
            </span>
            <Button variant="racing" size="sm">
              <Zap className="w-3.5 h-3.5 mr-1.5" /> Telemetry
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Showcase Section */}
      <section className="relative px-6 pt-16 pb-12 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-accent/30 bg-accent/10 text-accent text-xs font-mono tracking-widest uppercase mb-6 shadow-[0_0_20px_rgba(255,23,68,0.2)]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Tailwind + shadcn/ui + React Configured</span>
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-display uppercase tracking-tight text-white mb-6">
          WORLD CHAMPION <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-redbull-steel to-accent">DESIGN TOKENS</span>
        </h1>

        <p className="max-w-2xl mx-auto text-muted-foreground text-sm sm:text-base leading-relaxed mb-8">
          The shadcn/ui design system has been calibrated to mirror the website’s Red Bull Racing color tokens — Cobalt Blue, Racing Red, Championship Gold, and Atmospheric Navy.
        </p>

        {/* Action Buttons using shadcn Button component */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          <Button variant="racing" size="lg">
            <Flame className="w-4 h-4 mr-2" /> Racing Red
          </Button>
          <Button variant="cobalt" size="lg">
            <Shield className="w-4 h-4 mr-2" /> Cobalt Blue
          </Button>
          <Button variant="outline" size="lg">
            <Gauge className="w-4 h-4 mr-2" /> Outline Wireframe
          </Button>
          <Button variant="secondary" size="lg">
            <Trophy className="w-4 h-4 mr-2" /> Secondary Surface
          </Button>
        </div>

        {/* Website Color Tokens Palette Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-left mb-16">
          <div className="p-4 rounded-xl border border-border bg-card shadow-lg hover:border-accent/40 transition-colors">
            <div className="h-10 w-full rounded-md bg-[#0D1E78] mb-3 shadow-[0_0_15px_rgba(13,30,120,0.4)]" />
            <div className="text-xs font-bold text-white uppercase font-mono">Cobalt Blue</div>
            <div className="text-[11px] text-muted-foreground font-mono">#0D1E78 (Primary)</div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-lg hover:border-accent/40 transition-colors">
            <div className="h-10 w-full rounded-md bg-[#FF1744] mb-3 shadow-[0_0_15px_rgba(255,23,68,0.4)]" />
            <div className="text-xs font-bold text-white uppercase font-mono">Racing Red</div>
            <div className="text-[11px] text-muted-foreground font-mono">#FF1744 (Accent)</div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-lg hover:border-accent/40 transition-colors">
            <div className="h-10 w-full rounded-md bg-[#FFC600] mb-3 shadow-[0_0_15px_rgba(255,198,0,0.3)]" />
            <div className="text-xs font-bold text-white uppercase font-mono">Championship Gold</div>
            <div className="text-[11px] text-muted-foreground font-mono">#FFC600 (Yellow)</div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-lg hover:border-accent/40 transition-colors">
            <div className="h-10 w-full rounded-md bg-[#02D2E3] mb-3 shadow-[0_0_15px_rgba(2,210,227,0.3)]" />
            <div className="text-xs font-bold text-white uppercase font-mono">Oracle Cyan</div>
            <div className="text-[11px] text-muted-foreground font-mono">#02D2E3 (Tech)</div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-lg hover:border-accent/40 transition-colors">
            <div className="h-10 w-full rounded-md bg-[#041838] border border-border mb-3" />
            <div className="text-xs font-bold text-white uppercase font-mono">Card Surface</div>
            <div className="text-[11px] text-muted-foreground font-mono">#041838 (Card)</div>
          </div>

          <div className="p-4 rounded-xl border border-border bg-card shadow-lg hover:border-accent/40 transition-colors">
            <div className="h-10 w-full rounded-md bg-[#020813] border border-border mb-3" />
            <div className="text-xs font-bold text-white uppercase font-mono">Atmosphere</div>
            <div className="text-[11px] text-muted-foreground font-mono">#020813 (Background)</div>
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="border-t border-border/40 py-8 px-6 text-center text-xs font-mono text-muted-foreground bg-card/40">
        <p>MAX VERSTAPPEN RED BULL RACING — TAILWIND & SHADCN/UI SETUP COMPLETE</p>
      </footer>
    </div>
  );
}

