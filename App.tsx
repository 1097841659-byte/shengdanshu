import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Loader } from '@react-three/drei';
import { LuxuryScene } from './components/LuxuryScene';
import { UIOverlay } from './components/UIOverlay';
import { TreeState } from './types';

const App: React.FC = () => {
  const [treeState, setTreeState] = useState<TreeState>(TreeState.TREE_SHAPE);
  const [name, setName] = useState("");

  return (
    <div className="relative w-full h-screen bg-[#020804]">
      {/* 3D Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas
          shadows
          dpr={[1, 2]} // Optimize for pixel density
          gl={{ 
            antialias: false, // Post-processing handles smoothing usually, better perf
            toneMapping: 3, // CineonToneMapping for cinematic look
            toneMappingExposure: 1.5
          }} 
        >
          <Suspense fallback={null}>
             <LuxuryScene treeState={treeState} />
          </Suspense>
        </Canvas>
      </div>

      {/* UI Overlay Layer */}
      <UIOverlay 
        treeState={treeState} 
        setTreeState={setTreeState} 
        name={name} 
        setName={setName} 
      />
      
      {/* Loading Overlay */}
      <Loader 
        containerStyles={{ background: '#020804' }}
        innerStyles={{ width: '400px', height: '2px', background: '#333' }}
        barStyles={{ background: '#D4AF37', height: '2px' }}
        dataStyles={{ fontFamily: 'Cinzel', color: '#D4AF37', fontSize: '14px' }}
      />
    </div>
  );
};

export default App;