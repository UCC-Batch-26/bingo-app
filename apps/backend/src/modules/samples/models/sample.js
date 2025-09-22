import { Schema, model } from 'mongoose';

const sampleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Sample = model('Sample', sampleSchema);
