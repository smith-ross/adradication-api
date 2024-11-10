import UserRouter from "./user";
import { Router } from "express";
import BattleRouter from "./battle";
import TrackListRouter from "./tracklist";

const routes: { [key: string]: [route: Router] } = {
  "/auth": UserRouter,
  "/battle": BattleRouter,
  "/trackers": TrackListRouter,
};

export default routes;
