
import React from 'react';
import { MathWonder, MathCategory } from '../types';
import { WONDERS } from '../constants';

interface SidebarProps {
  activeWonder: MathWonder;
  onSelect: (wonder: MathWonder) => void;
  isOpen: boolean;
  toggle: () => void;
}

const getWonderIcon = (id: MathWonder) => {
  switch (id) {
    case MathWonder.LORENZ:
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />;
    case MathWonder.POINCARE:
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z M9 12a3 3 0 11-6 0 3 3 0 016 0z" />;
    case MathWonder.MANDELBROT:
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2 1-2-1m2 1v2.5M7 10l-2 1m0 0l-2-1m2 1v2.5M7 4L5 5 3 4m2 1v2.5" />;
    case MathWonder.SCHWARZSCHILD:
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21a9 9 0 100-18 9 9 0 000 18z M12 12m-3 0a3 3 0 106 0 3 3 0 00-6 0" />;
    case MathWonder.RIEMANN:
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M3 14h18m-9-4v4m-7 0a2 2 0 100 4h14a2 2 0 100-4M5 10a2 2 0 110-4h14a2 2 0 110 4" />;
    case MathWonder.COVERING:
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 5H19V11H13V5Z M5 13H11V19H5V13Z" />;
    case MathWonder.KLEIN:
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />;
    case MathWonder.PEANO:
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />;
    case MathWonder.HILBERT:
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />;
    case MathWonder.KOCH:
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707.707" />;
    default:
      return <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />;
  }
};

const Sidebar: React.FC<SidebarProps> = ({ activeWonder, onSelect, isOpen, toggle }) => {
  const categories = Object.values(MathCategory);

  return (
    <div className={`relative z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'w-80' : 'w-24'} bg-black/40 backdrop-blur-3xl flex flex-col border-r border-white/5 shadow-2xl`}>
      <div className="p-8 flex items-center justify-center shrink-0">
        <button onClick={toggle} className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-2xl text-white transition-all group overflow-hidden relative">
          <svg className={`w-5 h-5 transition-all duration-500 ${!isOpen && 'rotate-180'} ${isOpen && 'translate-x-0'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
          <div className={`absolute bottom-0 h-0.5 bg-blue-500 transition-all duration-300 ${isOpen ? 'w-full' : 'w-0'}`}></div>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto overflow-x-hidden px-4 space-y-8 custom-scrollbar pb-16">
        {categories.map(category => {
          const items = Object.values(MathWonder).filter(w => WONDERS[w].category === category);
          return (
            <div key={category} className="space-y-2">
              <div className={`flex items-center space-x-3 px-4 py-2 transition-all duration-500 ${!isOpen ? 'opacity-0 h-0 pointer-events-none' : 'opacity-100'}`}>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 whitespace-nowrap">
                  {category}
                </h3>
              </div>
              
              <div className="space-y-1">
                {items.map((wonder) => {
                  const isActive = activeWonder === wonder;
                  const data = WONDERS[wonder];
                  return (
                    <button
                      key={wonder}
                      onClick={() => onSelect(wonder)}
                      className={`w-full group relative flex items-center h-14 rounded-2xl transition-all duration-300 
                        ${isActive ? 'bg-white/10 text-white shadow-lg' : 'hover:bg-white/5 text-white/30'}`}
                    >
                      {/* Left Selection Marker */}
                      <div className={`w-1 transition-all duration-500 absolute left-0 ${isActive ? 'h-6 opacity-100' : 'h-0 opacity-0'}`}
                           style={{ backgroundColor: data.color }} />
                      
                      {/* Icon */}
                      <div className={`min-w-[64px] flex items-center justify-center transition-all duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                        <svg className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'text-current'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: isActive ? data.color : 'inherit' }}>
                          {getWonderIcon(wonder)}
                        </svg>
                      </div>

                      {/* Text label */}
                      <div className={`flex-1 flex flex-col items-start transition-all duration-500 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'}`}>
                        <span className={`text-[11px] font-bold tracking-tight text-left`}>
                          {data.title}
                        </span>
                      </div>

                      {/* Tooltip for collapsed mode */}
                      {!isOpen && (
                        <div className="absolute left-full ml-6 px-4 py-2 bg-black/90 text-white text-[10px] font-bold uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-[100] border border-white/10 shadow-2xl pointer-events-none">
                          {data.title}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </nav>

      <div className={`p-8 transition-all duration-500 text-center ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <div className="text-[9px] font-mono text-white/10 tracking-[0.4em] uppercase">Archive Hub</div>
      </div>
    </div>
  );
};

export default Sidebar;
