import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TreeState } from '../types';
import { generateDualPositions } from '../utils/geometry';

interface MorphingInstancesProps {
  count: number;
  treeState: TreeState;
  color: string;
  metalness: number;
  roughness: number;
  geometryType: 'needle' | 'sphere' | 'tetrahedron' | 'gift' | 'bow' | 'candy';
  scaleMultiplier: number;
  emissive?: string;
  emissiveIntensity?: number;
  twinkle?: boolean;
}

export const MorphingInstances: React.FC<MorphingInstancesProps> = ({
  count,
  treeState,
  color,
  metalness,
  roughness,
  geometryType,
  scaleMultiplier,
  emissive = "#000000",
  emissiveIntensity = 0,
  twinkle = false
}) => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  // Static data generation (runs once)
  const { tree, scatter, rotations, scales } = useMemo(
    () => generateDualPositions(count, 3.5, 8, 12),
    [count]
  );

  // Mutable references for animation state
  const currentPositions = useRef<Float32Array>(new Float32Array(scatter));

  // Temp objects for calculations to avoid GC
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const tempColor = useMemo(() => new THREE.Color(), []);

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    // Determine target based on state
    const targetArray = treeState === TreeState.TREE_SHAPE ? tree : scatter;

    // Animation Speed (Damping)
    const speed = treeState === TreeState.TREE_SHAPE ? 3.5 : 2.0;
    const lerpFactor = THREE.MathUtils.clamp(delta * speed, 0, 1);

    // Gently rotate the whole group
    if (treeState === TreeState.TREE_SHAPE) {
        meshRef.current.rotation.y += delta * 0.05;
    } else {
        meshRef.current.rotation.y += delta * 0.01;
    }

    const time = state.clock.elapsedTime;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      // Lerp positions
      currentPositions.current[ix] = THREE.MathUtils.lerp(currentPositions.current[ix], targetArray[ix], lerpFactor);
      currentPositions.current[iy] = THREE.MathUtils.lerp(currentPositions.current[iy], targetArray[iy], lerpFactor);
      currentPositions.current[iz] = THREE.MathUtils.lerp(currentPositions.current[iz], targetArray[iz], lerpFactor);

      // Hover effect
      let hoverY = 0;
      if (treeState === TreeState.TREE_SHAPE) {
         hoverY = Math.sin(time * 2 + i) * 0.05;
      }

      dummy.position.set(
        currentPositions.current[ix],
        currentPositions.current[iy] + hoverY,
        currentPositions.current[iz]
      );

      // Rotations
      dummy.rotation.set(rotations[ix], rotations[iy], rotations[iz]);
      if (treeState === TreeState.SCATTERED) {
         dummy.rotation.x += time * 0.1;
         dummy.rotation.z += time * 0.1;
      }

      const scale = scales[i] * scaleMultiplier;
      dummy.scale.set(scale, scale, scale);

      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);

      // Twinkle Logic
      if (twinkle) {
         // Create a random-looking but smooth oscillation
         // Offset based on index to desynchronize
         const blinkSpeed = 2.0 + (i % 5) * 0.5;
         const offset = i * 99.9;
         const sine = Math.sin(time * blinkSpeed + offset);
         
         // Remap sine (-1 to 1) to intensity (0.5 to 4.0 for bloom)
         const intensity = THREE.MathUtils.mapLinear(sine, -1, 1, 0.5, 4.0);
         
         // Apply color * intensity
         tempColor.set(color).multiplyScalar(intensity);
         meshRef.current.setColorAt(i, tempColor);
      }
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (twinkle && meshRef.current.instanceColor) {
        meshRef.current.instanceColor.needsUpdate = true;
    }
  });

  // Select Geometry
  const Geometry = useMemo(() => {
    switch (geometryType) {
        case 'sphere': return <sphereGeometry args={[0.15, 16, 16]} />;
        case 'tetrahedron': return <tetrahedronGeometry args={[0.2, 0]} />;
        case 'gift': return <boxGeometry args={[0.25, 0.25, 0.25]} />;
        case 'bow': return <torusKnotGeometry args={[0.08, 0.02, 64, 8, 2, 3]} />;
        case 'candy': return <torusGeometry args={[0.12, 0.04, 16, 32]} />;
        case 'needle': default: return <coneGeometry args={[0.12, 0.6, 3]} />;
    }
  }, [geometryType]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow receiveShadow>
      {Geometry}
      <meshStandardMaterial 
        // If twinkling, set base material color to white so instance color (Gold * Intensity) controls the look.
        // Otherwise use the provided color.
        color={twinkle ? "#ffffff" : color} 
        metalness={metalness} 
        roughness={roughness}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        envMapIntensity={2}
      />
    </instancedMesh>
  );
};