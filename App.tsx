
import React, { useState } from 'react';
import { MathWonder } from './types';
import { WONDERS } from './constants';
import LorenzVisualizer from './components/LorenzVisualizer';
import MandelbrotVisualizer from './components/MandelbrotVisualizer';
import BlackHoleVisualizer from './components/BlackHoleVisualizer';
import PoincareVisualizer from './components/PoincareVisualizer';
import RiemannVisualizer from './components/RiemannVisualizer';
import CoveringVisualizer from './components/CoveringVisualizer';
import KleinBottleVisualizer from './components/KleinBottleVisualizer';
import PeanoVisualizer from './components/PeanoVisualizer';
import HilbertVisualizer from './components/HilbertVisualizer';
import KochVisualizer from './components/KochVisualizer';
import Sidebar from './components/Sidebar';
import InfoPanel from './components/InfoPanel';

const App: React.FC = () => {
  const [activeWonder, setActiveWonder] = useState<MathWonder>(MathWonder.LORENZ);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(true);

  const renderVisualizer = () => {
    switch (activeWonder) {
      case MathWonder.LORENZ: return <LorenzVisualizer />;
      case MathWonder.MANDELBROT: return <MandelbrotVisualizer />;
      case MathWonder.SCHWARZSCHILD: return <BlackHoleVisualizer />;
      case MathWonder.POINCARE: return <PoincareVisualizer />;
      case MathWonder.RIEMANN: return <RiemannVisualizer />;
      case MathWonder.COVERING: return <CoveringVisualizer />;
      case MathWonder.KLEIN: return <KleinBottleVisualizer />;
      case MathWonder.PEANO: return <PeanoVisualizer />;
      case MathWonder.HILBERT: return <HilbertVisualizer />;
      case MathWonder.KOCH: return <KochVisualizer />;
      default: return null;
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#020306] text-slate-200 selection:bg-blue-500/30">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-600/5 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="relative z-10 flex h-full">
        <Sidebar 
          activeWonder={activeWonder} 
          onSelect={setActiveWonder} 
          isOpen={isSidebarOpen}
          toggle={() => setSidebarOpen(!isSidebarOpen)}
        />

        <main className="flex-1 relative flex flex-col items-stretch overflow-hidden">
          {/* HUD Header */}
          <header className="p-10 z-30 pointer-events-none flex justify-between items-center">
            <div className="group pointer-events-auto">
              <div className="flex items-center space-x-6">
                <div className="h-[2px] w-6 bg-blue-500/40 group-hover:w-20 transition-all duration-700"></div>
                <h1 className="text-4xl font-black tracking-tighter uppercase transition-all duration-500 hover:text-blue-400 cursor-default select-none group-hover:tracking-widest">
                  {WONDERS[activeWonder].title}
                </h1>
              </div>
              <div className="flex items-center space-x-3 mt-2 ml-16">
                 <span className="text-[10px] font-mono text-white/10 tracking-[0.6em] uppercase transition-colors group-hover:text-blue-500/30">{WONDERS[activeWonder].category}</span>
                 <div className="h-[1px] w-2 bg-white/5 group-hover:w-8 transition-all duration-700"></div>
              </div>
            </div>

            <div className="pointer-events-auto flex items-center space-x-6">
              <div className="text-[9px] font-mono text-white/5 uppercase tracking-[0.4em] hidden lg:block">Interact: Mouse Drag • Scroll</div>
            </div>
          </header>

          {/* Art Chamber */}
          <div className="flex-1 relative mx-10 mb-10 group/chamber">
            <div className="absolute inset-0 rounded-[3rem] overflow-hidden bg-black/40 border border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-1000 group-hover/chamber:border-white/10">
               <div className="absolute inset-0 z-0">
                  {renderVisualizer()}
               </div>
               
               {/* Ambient Frame Overlays */}
               <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/5 rounded-[3rem] m-3 opacity-30"></div>
            </div>

            {/* InfoPanel is at bottom-right */}
            <InfoPanel wonder={WONDERS[activeWonder]} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
