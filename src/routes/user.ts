import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { User } from "../db/models/UserModel";
import { verifyAuthToken } from "../util/auth";

const UserRouter = Router();

UserRouter.post("/register", async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ error: "Email Already Exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "User Registered" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

UserRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid Credentials" });
    }

    const token = jwt.sign({ email: user.email }, "secret");
    res.status(200).json({ token });
  } catch (_) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

UserRouter.get("/currentUser", verifyAuthToken, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.user.email });
    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }
    res.status(200).json({ username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default UserRouter;
