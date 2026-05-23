import type { Metric } from './types';

export const SEED_METRICS: Metric[] = [
  {
    id: 'global-accuracy',
    label: 'GLOBAL ACCURACY',
    value: '94.2%',
    accent: 'teal',
  },
  {
    id: 'active-nodes',
    label: 'ACTIVE NODES',
    value: '3 / 3',
    mono: true,
  },
  {
    id: 'total-samples',
    label: 'TOTAL SAMPLES',
    value: '37,696',
    mono: true,
  },
  {
    id: 'avg-loss',
    label: 'AVG LOSS',
    value: '0.042',
    accent: 'purple',
    mono: true,
  },
  {
    id: 'param-sync',
    label: 'PARAM SYNC',
    value: 'FedAvg',
    accent: 'cyan',
  },
];
