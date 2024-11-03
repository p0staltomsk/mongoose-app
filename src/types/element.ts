import { Document } from 'mongoose';

export interface IElement extends Document {
  name: string;
  symbol: string;
  mass: string;
  number: number;
  createdAt: Date;
  expiresAt: Date | null;
  isPermanent: boolean;
} 