import { Schema, Types, model } from 'mongoose';

const roomSchema = new Schema(
  {
    code: {
      type: String,
      required: true,
      unique: true,
    },

    sessionToken: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: ['lobby', 'live', 'ended'],
      default: 'lobby',
    },

    mode: {
      type: String,
      required: true,
      enum: ['quick', 'standard', 'blackout'],
      default: 'quick',
    },

    drawnNumber: {
      type: [Number],
    },

    winner: {
      type: Types.ObjectId,
      ref: 'Card',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

roomSchema.virtual('players', {
  ref: 'Card',
  localField: 'code',
  foreignField: 'room',
});

export const Room = model('Room', roomSchema);
