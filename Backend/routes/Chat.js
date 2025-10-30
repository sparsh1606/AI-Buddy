import express from "express";
const router = express.Router();
import Thread from "../models/Thread.js";
import getGenAiResponse from "../utils/GenaiApi.js";
import dotenv from "dotenv";
dotenv.config();

// test route to check if routes are working
router.post("/test", async (req, res) => {
  try {
    const newThread = new Thread({
      threadId: "123abc",
      title: "Test Thread",
    });
    const response = await newThread.save();
    res.send(response);
  } catch (e) {
    console.log(e);
  }
});

// Route to get all threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.status(200).send(threads);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Error fetching threads" });
  }
});

// Route to get a specific thread by ID
router.get("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;

  try {
    const thread = await Thread.findOne({ threadId });
    if (!thread) {
      res.status(404).json({ error: "Thread not found" });
    }
    res.json(thread.messages);
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Error fetching thread" });
  }
});

// Route to delete a specific thread by ID
router.delete("/thread/:threadId", async (req, res) => {
  const { threadId } = req.params;
  try {
    const deletedThread = await Thread.findOneAndDelete({ threadId });

    if (!deletedThread) {
      res.status(404).json({ error: "Thread not found" });
    }
    res.status(200).json({ success: "Thread deleted" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Error deleting thread" });
  }
});

// Create a new thread or continuing an existing thread
router.post("/create", async (req, res) => {
  const { threadId, message } = req.body;

  if (!threadId || !message) {
    res.status(404).json({ error: "Missing Required Fields..." });
  }

  try {
    var thread = await Thread.findOne({ threadId });
    if (!thread) {
      thread = new Thread({
        threadId: threadId,
        title: message,
        messages: [{ role: "user", content: message }],
      });
    } else {
      thread.messages.push({ role: "user", content: message });
    }
    const modelReply = await getGenAiResponse(message);
    // console.log(modelReply)
    thread.messages.push({ role: "model", content: modelReply });
    thread.updatedAt = new Date();
    await thread.save();
    res.json({ reply: modelReply });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Some Error Occured" });
  }
});


export default router;
