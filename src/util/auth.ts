import jwt from "jsonwebtoken";

export const verifyAuthToken = (req, res, next) => {
  const token = req.headers["authorization"].split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  jwt.verify(token, "secret", (err, decoded) => {
    if (err) {
      console.log("ERROR", req.headers);
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = decoded;
    next();
  });
};
