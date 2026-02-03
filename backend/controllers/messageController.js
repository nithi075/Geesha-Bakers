import Message from "../models/Message.js";

/* SEND MESSAGE */
export const sendMessage = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Name, Email and Message are required",
      });
    }

    const newMessage = new Message({
      name,
      email,
      phone,
      subject,
      message,
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (err) {
    console.error("❌ Message error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};

/* (OPTIONAL) GET ALL MESSAGES – ADMIN */
export const getMessages = async (req, res) => {
  const messages = await Message.find().sort({ createdAt: -1 });
  res.json(messages);
};
