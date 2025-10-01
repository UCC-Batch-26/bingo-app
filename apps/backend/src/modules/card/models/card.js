import { Schema, model } from 'mongoose';

const cardSchema = new Schema(
  {
    sessionToken: {
      type: String,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    gridNumbers: {
      type: [Number],
      required: true,
    },

    room: {
      type: String,
      ref: 'Room',
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Card = model('Card', cardSchema);
