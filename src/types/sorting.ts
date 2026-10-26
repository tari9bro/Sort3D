export type AlgorithmType =
  | 'bubble'
  | 'quick'
  | 'merge'
  | 'insertion'
  | 'selection'
  | 'heap'
  | 'cocktail';

export type StepAction =
  | 'compare'
  | 'swap'
  | 'overwrite'
  | 'mark_sorted'
  | 'set_pivot'
  | 'pass_complete'
  | 'finish';

export interface SortStep {
  id: number;
  action: StepAction;
  indices: number[];
  values: number[];
  description: string;
  codeLine: number;
  arrayState: number[];
  sortedIndices: number[];
  pivotIndex?: number;
}

export interface AlgorithmMetadata {
  id: AlgorithmType;
  name: string;
  shortDescription: string;
  timeBest: string;
  timeAvg: string;
  timeWorst: string;
  spaceWorst: string;
  stable: boolean;
  conceptSummary: string;
  bubbleComparison: string;
}

export type ArrayPreset =
  | 'random'
  | 'reversed'
  | 'nearly_sorted'
  | 'few_unique'
  | 'already_sorted';

export type SoundInstrument = 'marimba' | 'cosmic' | 'arcade' | 'crystal';

export type CameraViewPreset = 'orbit' | 'front' | 'top' | 'isometric' | 'cinematic';
