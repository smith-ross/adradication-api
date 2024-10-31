import express from "express";
import routes from "./routes/route-map";
import { connect } from "./db/controller";
import dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = 3000;

// Connect to MongoDB database
connect();

app.use(express.json());
Object.entries(routes).forEach(([url, router]) => {
  app.use(url, router);
});

app.get("/", (req, res) => {
  res.send("Adradication API");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
