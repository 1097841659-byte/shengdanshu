import * as THREE from 'three';

export const generateDualPositions = (count: number, radius: number, height: number, scatterRadius: number) => {
  const treeArray = new Float32Array(count * 3);
  const scatterArray = new Float32Array(count * 3);
  const rotations = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  const dummy = new THREE.Vector3();
  const axis = new THREE.Vector3(0, 1, 0);

  for (let i = 0; i < count; i++) {
    // --- Tree Shape (Spiral Cone) ---
    // Normalized height (0 at bottom, 1 at top)
    const yNorm = i / count; 
    const y = (yNorm - 0.5) * height; // Center vertically
    
    // Radius decreases as we go up
    const currentRadius = (1 - yNorm) * radius;
    
    // Golden Angle for natural distribution
    const angle = i * 2.39996; // Golden angle in radians approx
    
    const x = Math.cos(angle) * currentRadius;
    const z = Math.sin(angle) * currentRadius;

    // Add some random jitter to the tree shape so it's not perfectly mathematical
    const jitter = 0.2;
    treeArray[i * 3] = x + (Math.random() - 0.5) * jitter;
    treeArray[i * 3 + 1] = y + (Math.random() - 0.5) * jitter;
    treeArray[i * 3 + 2] = z + (Math.random() - 0.5) * jitter;

    // --- Scatter Shape (Random Sphere) ---
    // Rejection sampling for uniform sphere distribution
    let sx, sy, sz, d;
    do {
      sx = (Math.random() - 0.5) * 2;
      sy = (Math.random() - 0.5) * 2;
      sz = (Math.random() - 0.5) * 2;
      d = sx * sx + sy * sy + sz * sz;
    } while (d > 1);
    
    scatterArray[i * 3] = sx * scatterRadius;
    scatterArray[i * 3 + 1] = sy * scatterRadius;
    scatterArray[i * 3 + 2] = sz * scatterRadius;

    // --- Rotations ---
    // Random rotation for natural look
    rotations[i * 3] = Math.random() * Math.PI;
    rotations[i * 3 + 1] = Math.random() * Math.PI;
    rotations[i * 3 + 2] = Math.random() * Math.PI;

    // --- Scales ---
    scales[i] = 0.5 + Math.random() * 0.5;
  }

  return { tree: treeArray, scatter: scatterArray, rotations, scales };
};
