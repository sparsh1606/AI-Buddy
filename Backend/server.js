import express from "express";
import cors from "cors";
const app = express();
import mongoose from "mongoose";
import ChatRoutes from "./routes/Chat.js";

import dotenv from "dotenv";
dotenv.config();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.use("/api", ChatRoutes);

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB!!");
  } catch (err) {
    console.log("Failed to connect to DB...", err);
  }
};

// app.post("/test", async (req, res) => {
//   const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
//   async function main() {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: { role: "user", parts: [{ text: req.body.message }] },
//     });
//     console.log(response.role);
//     res.send(response.text);
//   }

//   try {
//     await main();
//   } catch (e) {
//     console.log(e);
//   }
// });

app.listen(8080, () => {
  console.log("Server is running on port 8080");
  connectToDB();
});
