"use server";

import { Schema, model, Document, Model, models } from 'mongoose';

// Define interfaces for TypeScript
interface IPollOption {
  text: string;
  votes: number;
}

interface IPoll extends Document {
  title: string;
  options: IPollOption[];
  creator: string; // References username from IUser
  createdAt: Date;
  updatedAt?: Date;
}

// Define Mongoose schema
const pollSchema = new Schema<IPoll>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  options: [
    {
      text: {
        type: String,
        required: true,
      },
      votes: {
        type: Number,
        default: 0,
      },
    },
  ],
  creator: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

// Export Mongoose model, reusing if already defined
const Poll: Model<IPoll> = models.Poll || model<IPoll>('Poll', pollSchema);
export default Poll;
export type { IPoll };