export enum TreeState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE',
}

export interface PositionData {
  scatter: Float32Array;
  tree: Float32Array;
}

export interface ParticleConfig {
  count: number;
  color: string;
  size: number;
  spread: number;
}