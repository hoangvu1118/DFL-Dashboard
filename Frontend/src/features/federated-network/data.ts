import type { HospitalNode, AggregatorNodeData } from './types';

export const SEED_NODES: HospitalNode[] = [
  {
    id: 'NODE-A',
    code: 'A',
    hospitalName: 'City General Hospital',
    status: 'training',
    round: 4,
    samples: 12480,
    timestamp: '09:18:33',
    accentColor: 'var(--node-a-color)',
  },
  {
    id: 'NODE-B',
    code: 'B',
    hospitalName: 'Mercy Medical Center',
    status: 'done',
    round: 4,
    samples: 9312,
    timestamp: '09:18:18',
    accentColor: 'var(--node-b-color)',
  },
  {
    id: 'NODE-C',
    code: 'C',
    hospitalName: "St. Luke's Research Inst.",
    status: 'merge',
    round: 4,
    samples: 15904,
    timestamp: '09:18:56',
    accentColor: 'var(--node-c-color)',
  },
];

export const SEED_AGGREGATOR: AggregatorNodeData = {
  id: 'AGG',
  label: 'AGG',
  status: 'active',
};
