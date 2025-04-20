"use server";

import { Schema, model, Document, Model, models, Types } from 'mongoose';

interface IPollOption {
  text: string;
  votes: number;
}

interface IPollCreator {
  userId: Types.ObjectId;
  username: string;
}

interface IPoll extends Document {
  title: string;
  options: IPollOption[];
  creator: IPollCreator;
  createdAt: Date;
  updatedAt?: Date;
}

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
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
  },
});

const Poll: Model<IPoll> = models.Poll || model<IPoll>('Poll', pollSchema);
export default Poll;
export type { IPoll, IPollCreator };