
export interface Metric {
  id: string;
  label: string;
  value: string;
  accent?: string;   // e.g. 'teal' | 'green' | 'purple' | 'default'
  mono?: boolean;    // use monospace font for the value
}
