import { Schema, model } from 'mongoose';

const roomSchema = new Schema(
  {
    code: {
      type: String,
      required: true,    
    },

    sessionToken: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum : ['lobby', 'live', 'ended'],
      default : 'lobby',
    },

     mode: {
      type: String,
      required: true,
      enum : ['quick', 'standard', 'blackout'],
      default : 'quick',
    },

  },
  {
    timestamps: true,
  },
);

export const Room = model('Room', roomSchema);
