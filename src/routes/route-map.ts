import UserRouter from "./user";
import { Router } from "express";
import BattleRouter from "./battle";
import TrackListRouter from "./trackers";

const routes: { [key: string]: Router } = {
  "/auth": UserRouter,
  "/battle": BattleRouter,
  "/trackers": TrackListRouter,
};

export default routes;
