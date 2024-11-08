import bcrypt from "bcryptjs";
import { Router } from "express";
import { BattleResult } from "../db/models/BattleResultModel";
import { verifyAuthToken } from "../util/auth";

const POINT_LIMIT = 200;

const BattleRouter = Router();

BattleRouter.post("/reportResult", verifyAuthToken, async (req, res) => {
  try {
    const key = await bcrypt.hash(req.body.url + "-" + req.body.username);
    const existingBattle = await BattleResult.findOne({ key: key });
    if (existingBattle || (req.body.points && req.body.points > POINT_LIMIT)) {
      return res.status(400).json({ error: "Invalid BattleResult." });
    }
    const newBattle = new BattleResult({
      key: key,
      result: req.body.result,
      points: req.body.points || 0,
    });

    await newBattle.save();
    res.status(201).json({ message: "BattleResult recorded successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

BattleRouter.get("/getBattleResult", verifyAuthToken, async (req, res) => {
  try {
    const key = await bcrypt.hash(req.body.url + "-" + req.body.username);
    const existingBattle = await BattleResult.findOne({ key: key });
    if (!existingBattle) {
      return res.status(404).json({ error: "Battle Not Found" });
    }
    res.status(200).json({
      result: existingBattle.result,
      points: existingBattle.points,
      date: existingBattle.points,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default BattleRouter;
