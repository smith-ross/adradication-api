import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Router } from "express";
import { User } from "../db/models/UserModel";
import { verifyAuthToken } from "../util/auth";

const UserRouter = Router();

UserRouter.post("/register", async (req, res) => {
  try {
    if (!req.body.email.includes("@") || !req.body.email.includes(".")) {
      return res.status(400).json({ error: "Invalid email." });
    }
    // /[(.*[A-Za-z]+.*\d+.*)(.*\d+.*[A-Za-z]+.*)]/
    if (
      !/(.*[A-Za-z]+.*\d+.*)|(.*\d+.*[A-Za-z]+.*)/.test(req.body.password) ||
      req.body.password.length < 6
    ) {
      return res.status(400).json({
        error:
          "Password must contain at least 6 characters, one letter, and one number.",
      });
    }
    const existingUser = await User.findOne({ username: req.body.username });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const hashedEmail = await bcrypt.hash(req.body.email, 10);

    const newUser = new User({
      username: req.body.username,
      email: hashedEmail,
      password: hashedPassword,
    });

    await newUser.save();
    res.status(201).json({ message: "Registration successful!" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

UserRouter.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials, ensure your username/password match",
      });
    }

    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(401).json({
        error: "Invalid credentials, ensure your username/password match",
      });
    }

    const token = jwt.sign({ username: user.username }, "secret");
    res.status(200).json({ token: token });
  } catch (_) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

UserRouter.get("/currentUser", verifyAuthToken, async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.user.username });
    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }
    res.status(200).json({ username: user.username });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default UserRouter;
