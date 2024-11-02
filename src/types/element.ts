export interface Element {
  atomicNumber: number;
  symbol: string;
  name: string;
  atomicMass: number;
  category: string;
  color?: string;
  description?: string;
  customProperties?: Map<string, any>;
} 