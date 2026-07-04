const Post = require("../models/Post");
const User = require("../models/User");

exports.createPost = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const post = await Post.create({
      title: req.body.title,
      authorName: req.user.name,
      content: req.body.content,
      createdBy: req.user._id
    });
    // Populate karo taaki frontend ko complete object mile
    const populatedPost = await Post.findById(post._id)
      .populate("comments.user", "name");

      // res.json(populatedPost);
    res.status(201).json({
  ...populatedPost.toObject(),
  likesCount: populatedPost.likes.length,
  dislikesCount: populatedPost.dislikes.length,
  liked: populatedPost.likes.some(id => id.toString() === userId),
  disliked: populatedPost.dislikes.some(id => id.toString() === userId),
  commentsCount: populatedPost.comments.length
});

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//for guest user
exports.getAllPostsPublic = async (req, res) => {
  const posts = await Post.find();

  const updatePosts = posts.map(post => ({
    ...post.toObject(),
    likesCount: post.likes.length,
    dislikesCount: post.dislikes.length,
    liked: false,       // ✅ guest ke liye hamesha false
    disliked: false,    // ✅ guest ke liye hamesha false
    commentsCount: post.comments.length
  }));

  res.json(updatePosts);
};



//for login user
exports.getAllPosts = async (req, res) => {
  const posts = await Post.find();
  const userId = req.user?._id.toString();

  const updatePosts = posts.map(post => ({
    ...post.toObject(),
    likesCount: post.likes.length,
    dislikesCount: post.dislikes.length,
    liked: userId ? post.likes.some(id => id.toString() === userId) : false,
    disliked: userId ? post.dislikes.some(id => id.toString() === userId) : false,
    commentsCount: post.comments.length
  }))
  res.json(updatePosts);
};

exports.getUserPosts = async (req, res) => {
  const posts = await Post.find({ createdBy: req.user.id }).sort({ createdAt: -1 })
  .populate("createdBy", "name _id")
  .populate("comments.user", "name _id");

  const userId = req.user._id.toString();

  const updatedPosts = posts.map(post => ({
    ...post.toObject(),
    likesCount: post.likes.length,
    dislikesCount: post.dislikes.length,
    liked: userId ? post.likes.some(id => id.toString() === userId.toString()) : false,
    disliked: userId ? post.dislikes.some(id => id.toString() === userId.toString()) : false,
    commentsCount: post.comments.length
  }));

    res.json({
    user: { _id: req.user._id, name: req.user.name },
    posts: updatedPosts
  });
  // res.json(updatedPosts);
};


exports.likePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const userId = req.user._id.toString();

  if (post.likes.some(id => id.toString() === userId)) {
    // undo like
    post.likes = post.likes.filter(id => id.toString() !== userId);
  } else {
    // add like
    post.likes.push(userId);
    // remove dislike if it exists
    post.dislikes = post.dislikes.filter(id => id.toString() !== userId);
  }

  await post.save();
  res.json({
    likesCount: post.likes.length,
    dislikesCount: post.dislikes.length,
    liked: post.likes.some(id => id.toString() === userId),
    disliked: post.dislikes.some(id => id.toString() === userId)
  });
};

exports.dislikePost = async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const userId = req.user._id.toString();


  if (post.dislikes.some(id => id.toString() === userId)) {
    // undo dislike
    post.dislikes = post.dislikes.filter(id => id.toString() !== userId);
  } else {
    // add dislike
    post.dislikes.push(userId);
    // remove like if present
    post.likes = post.likes.filter(id => id.toString() !== userId);
  }

  await post.save();
  res.json({
    likesCount: post.likes.length,
    dislikesCount: post.dislikes.length,
    liked: post.likes.some(id => id.toString() === userId),
    disliked: post.dislikes.some(id => id.toString() === userId)
  });
};


const mongoose = require("mongoose");

exports.commentPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // ✅ ObjectId cast karo
    post.comments.push({
      user: req.user._id,
      text: req.body.text
    });        
    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate("comments.user", "name");
      
    res.json({ comments: updatedPost.comments ,
      commentsCount: updatedPost.comments.length
    });
  } catch (error) {
    console.error("Error in commentPost:", error);
    res.status(500).json({ message: error.message });
  }
};

