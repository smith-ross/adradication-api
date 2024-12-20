import { Router } from "express";
import { BattleResult } from "../db/models/BattleResultModel";
import { verifyAuthToken } from "../util/auth";
import bcrypt from "bcryptjs";

const POINT_LIMIT = 200;

const BattleRouter = Router();

BattleRouter.post("/reportResult", verifyAuthToken, async (req, res) => {
  const hashedUrl = await bcrypt.hash(req.body.url, 10);
  try {
    const existingBattles = await BattleResult.find({
      username: req.body.user.username,
    });
    let existingBattle: { [key: string]: any };
    for (let battle of existingBattles) {
      if (await bcrypt.compare(req.body.url, battle.url)) {
        existingBattle = battle;
        break;
      }
    }
    if (existingBattle || (req.body.points && req.body.points > POINT_LIMIT)) {
      return res.status(400).json({ error: "Invalid BattleResult." });
    }
    const newBattle = new BattleResult({
      username: req.body.user.username,
      url: hashedUrl,
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

BattleRouter.get("/highScore", verifyAuthToken, async (req, res) => {
  try {
    const existingBattles = await BattleResult.find({
      username: req.body.user.username,
      result: "win",
    });
    if (existingBattles.length === 0) {
      return res.status(200).json({ highScore: 0 });
    }
    let highest = 0;
    existingBattles.forEach((battle) => {
      if (battle.points && battle.points > highest) highest = battle.points;
    });

    return res.status(200).json({ highScore: highest });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

BattleRouter.get("/leaderboard", verifyAuthToken, async (req, res) => {
  try {
    const summation = await BattleResult.aggregate([
      {
        $group: {
          _id: "$username",
          totalScore: { $sum: "$points" },
        },
      },
      {
        $sort: { totalScore: -1 },
      },
    ]);

    const playerScore = summation.filter(
      (entry) => entry._id === req.body.user.username
    )[0];
    const playerIndex = summation.indexOf(playerScore);

    return res.status(200).json({
      playerPosition: { index: playerIndex, score: playerScore.totalScore },
      nextPosition:
        playerIndex > 0
          ? { index: playerIndex + 1, score: summation[playerIndex + 1] }
          : undefined,
      leaderboard: summation
        .slice(0, Number(req.query.amount) || 50)
        .map((entry) => ({
          username: entry._id,
          score: entry.totalScore,
        })),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

BattleRouter.post("/getBattleResult", verifyAuthToken, async (req, res) => {
  try {
    const existingBattles = await BattleResult.find({
      username: req.body.user.username,
    });
    let existingBattle: { [key: string]: any };
    for (let battle of existingBattles) {
      if (await bcrypt.compare(req.body.url, battle.url)) {
        existingBattle = battle;
        break;
      }
    }
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
