import mongoose from "mongoose";

export const battleResultSchema = new mongoose.Schema({
  username: String,
  url: String,
  result: {
    type: String,
    enum: ["win", "lose", "flee"],
  },
  date: { type: Date, default: Date.now },
  points: {
    type: Number,
    min: 0,
  },
});

export const BattleResult = mongoose.model("BattleResult", battleResultSchema);
