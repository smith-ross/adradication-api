import { Router } from "express";
import { BattleResult } from "../db/models/BattleResultModel";
import { verifyAuthToken } from "../util/auth";

const POINT_LIMIT = 200;

const BattleRouter = Router();

BattleRouter.post("/reportResult", verifyAuthToken, async (req, res) => {
  console.log(req.body);
  try {
    const existingBattle = await BattleResult.findOne({
      username: req.user.username,
      url: req.body.url,
    });
    if (existingBattle || (req.body.points && req.body.points > POINT_LIMIT)) {
      return res.status(400).json({ error: "Invalid BattleResult." });
    }
    const newBattle = new BattleResult({
      username: req.user.username,
      url: req.body.url,
      result: req.body.result,
      points: req.body.score || 0,
    });

    await newBattle.save();
    res.status(201).json({ message: "BattleResult recorded successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

BattleRouter.post("/getBattleResult", verifyAuthToken, async (req, res) => {
  try {
    const existingBattle = await BattleResult.findOne({
      username: req.user.username,
      url: req.body.url,
    });
    if (!existingBattle) {
      return res.status(200).json({ result: "not_played" });
    }
    res.status(200).json({
      result: existingBattle.result,
      points: existingBattle.points,
      date: existingBattle.date,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default BattleRouter;
