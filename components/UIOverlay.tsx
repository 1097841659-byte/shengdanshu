import React from 'react';
import { TreeState } from '../types';

interface UIOverlayProps {
  treeState: TreeState;
  setTreeState: (state: TreeState) => void;
  name: string;
  setName: (n: string) => void;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ treeState, setTreeState, name, setName }) => {
  const isTree = treeState === TreeState.TREE_SHAPE;
  const showGreeting = isTree && name.trim().length > 0;

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12 z-10">
      
      {/* Header Branding */}
      <header className="flex justify-between items-start animate-fade-in-down pointer-events-none z-20">
        <div>
          <h1 className="font-['Cinzel'] text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] via-[#fff8dc] to-[#D4AF37] drop-shadow-lg tracking-widest">
            ARIX
          </h1>
          <p className="font-['Playfair_Display'] text-[#8fbc8f] text-sm md:text-base tracking-[0.3em] uppercase mt-2">
            Signature Collection
          </p>
        </div>
        <div className="hidden md:block text-right">
            <p className="text-[#D4AF37] opacity-60 text-xs font-mono">EST. 2024</p>
            <p className="text-[#D4AF37] opacity-60 text-xs font-mono">GEN_ID: 994-X</p>
        </div>
      </header>

      {/* CENTER GREETING OVERLAY */}
      <div className={`
        absolute inset-0 flex items-center justify-center z-10 transition-all duration-1000
        ${showGreeting ? 'opacity-100 bg-black/40 backdrop-blur-[2px]' : 'opacity-0 pointer-events-none'}
      `}>
         <div className={`
            text-center transform transition-all duration-1000
            ${showGreeting ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'}
         `}>
            <p className="font-['Cinzel'] text-[#D4AF37] text-xl md:text-3xl tracking-[0.4em] uppercase mb-4 drop-shadow-md">
                Merry Christmas
            </p>
            <h2 className="font-['Playfair_Display'] text-white text-5xl md:text-8xl font-bold italic drop-shadow-[0_0_25px_rgba(212,175,55,0.6)]">
                {name}!
            </h2>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-8"></div>
         </div>
      </div>

      {/* Middle Spacer */}
      <div className="flex-grow"></div>

      {/* Footer Controls Area */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 w-full pointer-events-auto z-20">
        
        {/* Lower Left: Name Input */}
        <div className="flex flex-col items-start space-y-2 max-w-xs">
            <label className="text-[#D4AF37] text-[10px] tracking-[0.2em] font-mono opacity-70 uppercase">
                Guest Identification
            </label>
            <div className="relative group w-full">
                <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Name..."
                    className="bg-transparent border-b border-[#D4AF37]/30 focus:border-[#D4AF37] text-[#fff8dc] font-['Playfair_Display'] text-2xl py-2 px-0 w-full outline-none placeholder-[#D4AF37]/20 transition-all duration-300"
                />
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#D4AF37] transition-all duration-500 group-hover:w-full group-focus-within:w-full"></div>
            </div>
             <p className="text-[#8fbc8f] text-xs italic font-serif opacity-50 min-h-[1rem]">
                {name ? "Identity confirmed." : "Experience the morphing luxury."}
            </p>
        </div>

        {/* Lower Right: Action Button */}
        <div className="flex flex-col items-end">
             {/* State Indicator */}
             <p className="mb-2 text-[#D4AF37]/50 text-[10px] tracking-[0.3em] font-mono text-right uppercase">
                Status: {isTree ? 'Coherent' : 'Entropic'}
            </p>

            <button
              onClick={() => setTreeState(isTree ? TreeState.SCATTERED : TreeState.TREE_SHAPE)}
              className={`
                relative group px-10 py-3 overflow-hidden rounded-sm 
                transition-all duration-700 ease-out
                border border-[#D4AF37]/40 hover:border-[#D4AF37]
                backdrop-blur-md bg-[#050a05]/40
              `}
            >
                {/* Button Background Gradient Animation */}
                <div className={`
                    absolute inset-0 bg-gradient-to-r from-[#004d25] to-[#002a14] 
                    transition-transform duration-700 ease-out origin-left
                    ${isTree ? 'scale-x-100' : 'scale-x-0'}
                `}></div>
                <div className={`
                    absolute inset-0 bg-gradient-to-l from-[#333] to-[#111] 
                    transition-transform duration-700 ease-out origin-right
                    ${!isTree ? 'scale-x-100' : 'scale-x-0'}
                `}></div>

                {/* Button Text */}
                <span className="relative z-10 font-['Cinzel'] text-sm md:text-base text-[#D4AF37] tracking-[0.2em] group-hover:text-white transition-colors duration-300">
                    {isTree ? 'DISSOLVE' : 'ASSEMBLE'}
                </span>
                
                {/* Glow Effect */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[0_0_20px_rgba(212,175,55,0.2)_inset]"></div>
            </button>
        </div>

      </div>
    </div>
  );
};