import { Schema, model } from 'mongoose';
import { IElement } from '../types/element';

const elementSchema = new Schema<IElement>({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true,
    minlength: [1, 'Name must be at least 1 character long'],
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  symbol: { 
    type: String, 
    required: [true, 'Symbol is required'],
    trim: true,
    maxlength: [10, 'Symbol cannot be more than 10 characters']
  },
  mass: { 
    type: String, 
    default: '???' 
  },
  number: { 
    type: Number,
    required: [true, 'Number is required'],
    unique: true,
    min: [119, 'Number must be greater than 118']
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  expiresAt: { 
    type: Date,
    validate: [{
      validator: function(this: IElement, v: Date | null): boolean {
        if (this.isPermanent) return true;
        return v !== null && v > new Date();
      },
      message: 'Expiry date must be in the future'
    }]
  },
  isPermanent: { 
    type: Boolean, 
    default: false 
  }
});

elementSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

elementSchema.pre('save', function(this: IElement, next: () => void) {
  if (this.isPermanent) {
    this.expiresAt = null;
  }
  next();
});

export const Element = model<IElement>('Element', elementSchema);
