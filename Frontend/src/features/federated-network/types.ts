
export type NodeStatus = 'training' | 'done' | 'merge' | 'aggregating' | 'idle';

export type NodeId = 'NODE-A' | 'NODE-B' | 'NODE-C';

export interface HospitalNode {
  id: NodeId;
  code: string;           // short code: 'A', 'B', 'C'
  hospitalName: string;
  status: NodeStatus;
  round: number;
  samples: number;
  timestamp: string;
  accentColor: string;    // CSS color token key for border/badge accent
}

export interface AggregatorNodeData {
  id: 'AGG';
  label: string;
  status: 'active' | 'idle';
}

export interface NetworkState {
  currentRound: number;
  totalRounds: number;
  aggregator: AggregatorNodeData;
  nodes: HospitalNode[];
}

export interface NodePosition {
  nodeId: NodeId | 'AGG';
  x: number; // percentage 0-100
  y: number; // percentage 0-100
}
