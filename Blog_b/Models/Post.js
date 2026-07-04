const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  authorName: { type: String, required: true },
  content: { type: String, required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [
    { user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      text: String,
      date: { type: Date, default: Date.now } }
  ],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: true });
module.exports = mongoose.model("Post", postSchema);
 