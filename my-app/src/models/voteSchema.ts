"use server";

import { Schema, model, Document, Model, models, Types } from 'mongoose';

interface IVote extends Document {
  pollId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
}

const voteSchema = new Schema<IVote>({
  pollId: {
    type: Schema.Types.ObjectId,
    ref: 'Poll',
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Vote: Model<IVote> = models.Vote || model<IVote>('Vote', voteSchema);

export default Vote;
export type { IVote };