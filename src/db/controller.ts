import mongoose from "mongoose";

export const connect = () => {
  mongoose
    .connect(process.env.DB_URL || "")
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((error) => {
      console.error("Error connecting to MongoDB:", error);
    });
};
