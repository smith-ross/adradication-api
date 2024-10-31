import UserRouter from "./user";
import { Router } from "express";

const routes: { [key: string]: [route: Router] } = {
  "/auth": UserRouter,
};

export default routes;
