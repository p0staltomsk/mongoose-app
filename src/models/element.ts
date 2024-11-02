import * as mongoose from 'mongoose';

const elementSchema = new mongoose.Schema({
  atomicNumber: { type: Number, required: true },
  symbol: { type: String, required: true },
  name: { type: String, required: true },
  atomicMass: { type: Number, required: true },
  category: { type: String, required: true },
  color: { type: String },
  description: { type: String },
  customProperties: { type: Map, of: mongoose.Schema.Types.Mixed }
});

export const Element = mongoose.model('Element', elementSchema);
