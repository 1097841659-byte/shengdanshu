import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, PerspectiveCamera, Stars, Float } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { MorphingInstances } from './MorphingInstances';
import { TreeState } from '../types';

interface LuxurySceneProps {
  treeState: TreeState;
}

// Pre-calculate Star Shape for the topper to avoid re-creation
const createStarShape = () => {
  const shape = new THREE.Shape();
  const points = 5;
  const outerRadius = 0.5;
  const innerRadius = 0.22;
  
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerRadius : innerRadius;
    const a = (i / (points * 2)) * Math.PI * 2;
    const x = Math.sin(a) * r;
    const y = Math.cos(a) * r;
    
    if (i === 0) shape.moveTo(x, y);
    else shape.lineTo(x, y);
  }
  shape.closePath();
  return shape;
};

const starShape = createStarShape();

export const LuxuryScene: React.FC<LuxurySceneProps> = ({ treeState }) => {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame(({ clock }) => {
    if (lightRef.current) {
      // Move the main light slightly to create glints on gold
      lightRef.current.position.x = Math.sin(clock.elapsedTime * 0.5) * 5;
      lightRef.current.position.z = Math.cos(clock.elapsedTime * 0.5) * 5;
    }
  });

  return (
    <>
      <PerspectiveCamera makeDefault position={[0, 0, 14]} fov={45} />
      
      {/* Dynamic Environment */}
      <Environment preset="city" />
      
      {/* Cinematic Fog for depth */}
      <fog attach="fog" args={['#020804', 8, 30]} />
      <color attach="background" args={['#020804']} />

      {/* Lighting System */}
      <ambientLight intensity={0.4} color="#001a0f" />
      <pointLight ref={lightRef} position={[5, 5, 5]} intensity={25} color="#ffddaa" distance={20} decay={2} />
      <spotLight 
        position={[0, 15, 0]} 
        angle={0.6} 
        penumbra={1} 
        intensity={35} 
        color="#ffffff" 
        castShadow 
      />
      {/* Rim light for Emeralds */}
      <spotLight position={[-10, 0, -5]} intensity={60} color="#00ff66" distance={30} />

      {/* Group holding the interactive elements */}
      <group position={[0, -2, 0]}>
        
        {/* The "Emerald" Needles - High count, thin, reflective */}
        <MorphingInstances 
            count={1800} 
            treeState={treeState}
            color="#005c29" 
            emissive="#001a00"
            emissiveIntensity={0.2}
            metalness={0.9}
            roughness={0.15}
            geometryType="needle"
            scaleMultiplier={1.0}
        />

        {/* ORNAMENTS MIX */}
        
        {/* 1A. Green Spheres (Partial replacement) */}
        <MorphingInstances 
            count={40} 
            treeState={treeState}
            color="#0B6623" // Deep Forest Green
            metalness={0.8}
            roughness={0.1}
            geometryType="sphere"
            scaleMultiplier={1.6}
            emissive="#002200"
            emissiveIntensity={0.2}
        />

        {/* 1B. Glowing Yellow Spheres (The remaining ones) */}
        <MorphingInstances 
            count={40} 
            treeState={treeState}
            color="#FFD700"
            metalness={1}
            roughness={0.05}
            geometryType="sphere"
            scaleMultiplier={1.5}
            emissive="#aa8800"
            emissiveIntensity={0.3}
            twinkle={true} // Enable random glowing
        />

        {/* 2. Gifts (Golden Boxes) - Enlarged */}
        <MorphingInstances 
            count={60} 
            treeState={treeState}
            color="#FFC107"
            metalness={0.9}
            roughness={0.15}
            geometryType="gift"
            scaleMultiplier={2.8} // Increased from 2.2 for a fuller look
            emissive="#332200"
            emissiveIntensity={0.2}
        />

        {/* 3. Bows (Abstract Ribbons) */}
        <MorphingInstances 
            count={60} 
            treeState={treeState}
            color="#FFCA28"
            metalness={1}
            roughness={0.1}
            geometryType="bow"
            scaleMultiplier={1.8}
            emissive="#aa8800"
            emissiveIntensity={0.3}
        />

        {/* 4. Candies (Golden Rings) */}
        <MorphingInstances 
            count={50} 
            treeState={treeState}
            color="#FFB300"
            metalness={1}
            roughness={0}
            geometryType="candy"
            scaleMultiplier={1.4}
            emissive="#aa8800"
            emissiveIntensity={0.4}
        />

        {/* Accent Diamonds/Crystals - Very bright */}
        <MorphingInstances 
            count={100} 
            treeState={treeState}
            color="#ffffff"
            metalness={1}
            roughness={0}
            geometryType="tetrahedron"
            scaleMultiplier={0.8}
            emissive="#ffffff"
            emissiveIntensity={1}
        />
        
        {/* TOPPER: The Star Shape */}
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh position={[0, 4.2, 0]} scale={treeState === TreeState.TREE_SHAPE ? 1 : 0}>
                <extrudeGeometry 
                  args={[
                    starShape, 
                    { 
                      depth: 0.15, 
                      bevelEnabled: true, 
                      bevelThickness: 0.05, 
                      bevelSize: 0.05, 
                      bevelSegments: 4 
                    }
                  ]} 
                />
                <meshStandardMaterial 
                  color="#FFF" 
                  emissive="#FFF" 
                  emissiveIntensity={4} 
                  toneMapped={false} 
                  metalness={1}
                  roughness={0}
                />
            </mesh>
        </Float>
      </group>

      {/* Background Ambience */}
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      {/* Post Processing for the "Cinematic Glow" */}
      <EffectComposer disableNormalPass>
        <Bloom 
            luminanceThreshold={1.2} // Only very bright things glow
            mipmapBlur 
            intensity={1.5} 
            radius={0.6} 
        />
        <Noise opacity={0.02} blendFunction={BlendFunction.OVERLAY} />
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </>
  );
};