import UserRouter from "./user";
import { Router } from "express";
import BattleRouter from "./battle";

const routes: { [key: string]: [route: Router] } = {
  "/auth": UserRouter,
  "/battle": BattleRouter,
};

export default routes;
