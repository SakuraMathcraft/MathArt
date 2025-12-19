
import React, { useEffect, useRef, useState } from 'react';
import { WonderData } from '../types';

interface InfoPanelProps {
  wonder: WonderData;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ wonder }) => {
  const formulaRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const mathJax = (window as any).MathJax;
    if (formulaRef.current && mathJax) {
      mathJax.typesetPromise([formulaRef.current]).catch((err: any) => console.error(err));
    }
  }, [wonder, isCollapsed]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(wonder.formula).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="absolute bottom-10 right-10 w-full max-w-[400px] z-40 pointer-events-auto transition-all duration-700 ease-in-out">
      <div className={`bg-black/80 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden transition-all duration-700 ${isCollapsed ? 'max-h-16' : 'max-h-[800px]'}`}>
        
        {/* Header/Toggle Bar */}
        <div className="p-6 flex items-center justify-between cursor-pointer group" onClick={() => setIsCollapsed(!isCollapsed)}>
          <div className="flex items-center space-x-3">
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: wonder.color }}></div>
            <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] group-hover:text-white/60 transition-colors">解析档案</span>
          </div>
          <button className="text-white/20 hover:text-white transition-colors">
            <svg className={`w-4 h-4 transform transition-transform duration-500 ${isCollapsed ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Collapsible Content */}
        {!isCollapsed && (
          <div className="px-8 pb-8 space-y-6 animate-in fade-in duration-700">
            <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
            
            <p className="text-white/70 text-sm leading-relaxed font-light text-justify">
              {wonder.description}
            </p>

            <div className="space-y-4">
               <div className="relative bg-white/[0.02] p-6 rounded-2xl border border-white/5 transition-all flex flex-col items-center">
                  <div ref={formulaRef} className="text-white text-xl font-serif text-center py-2">
                    {`$$${wonder.formula}$$`}
                  </div>
                  
                  <button 
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(); }}
                    className="mt-4 flex items-center space-x-2 text-[8px] font-bold text-blue-400/60 hover:text-blue-300 transition-all uppercase tracking-widest px-3 py-1.5 rounded-lg border border-blue-500/10 hover:border-blue-500/30"
                  >
                    {copied ? '已复制' : '复制 LATEX'}
                  </button>
               </div>
               
               <div className="text-center pt-2">
                  <span className="italic text-[11px] font-serif text-white/20 block px-4">
                    "{wonder.philosophy}"
                  </span>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfoPanel;
