const express = require("express");
const Post = require("../Models/Post");
const User = require("../Models/User"); 
const postController = require("../Controllers/postController");

const {
  createPost,
  getAllPosts,
  getUserPosts,
  likePost,
  dislikePost,
  commentPost
} = require("../Controllers/postController");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();

// Post routes
router.get("/posts/public", postController.getAllPostsPublic);
//create post
router.post("/posts", authMiddleware, createPost);
// Get all posts for home page login route
router.get("/posts", authMiddleware, postController.getAllPosts); // Home page
router.get("/profile/posts", authMiddleware, getUserPosts); // Profile page

//  Use controller functions here
router.put("/posts/:id/like", authMiddleware, likePost);
router.put("/posts/:id/dislike", authMiddleware, dislikePost);

router.post("/posts/:id/comment", authMiddleware, commentPost);

router.get("/posts/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("comments.user", "name _id");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Get user by id
router.get("/users/:id", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("name _id");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get posts by author id
router.get("/author/:id", authMiddleware, async (req, res) => {
  try {
    const authorId = req.params.id; //  URL se author id lo

    const posts = await Post.find({ createdBy: authorId })   //  yahan authorId use karo
      .sort({ createdAt: -1 })
      .populate("createdBy", "name _id")
      .populate("comments.user", "name _id");

    const userId = req.user._id.toString(); //  current logged-in user id

    const updatedPosts = posts.map(post => ({
      ...post.toObject(),
      likesCount: post.likes.length,
      dislikesCount: post.dislikes.length,
      liked: post.likes.some(id => id.toString() === userId),
      disliked: post.dislikes.some(id => id.toString() === userId),
      commentsCount: post.comments.length
    }));

    //  response me author info + posts bhejo
    res.json({
      author: posts.length > 0 ? posts[0].createdBy : { _id: authorId }, 
      posts: updatedPosts
    });
  } catch (error) {
    console.error("Error fetching author posts:", error);
    res.status(500).json({ message: error.message });
  }
});

// Delete post route
router.delete("/posts/:id", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    //  Ensure only the creator can delete
    if (post.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: "Post deleted successfully", postId: req.params.id });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE comment
router.delete("/posts/:postId/comments/:commentId", authMiddleware, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id.toString();

    const post = await Post.findById(postId)
    .populate("comments.user", "name _id")
    if (!post) return res.status(404).json({ message: "Post not found" });

    //  Find comment manually
    const commentIndex = post.comments.findIndex(c => c._id.toString() === commentId);
    if (commentIndex === -1) return res.status(404).json({ message: "Comment not found" });

    const comment = post.comments[commentIndex];

    //  Allow post owner OR comment owner
    if (post.createdBy.toString() === userId || (comment.user && comment.user._id.toString() === userId)) {
      post.comments.splice(commentIndex, 1); // remove comment
      await post.save();
      return res.json({ comments: post.comments, commentsCount: post.comments.length });
    } else {
      return res.status(403).json({ message: "Not authorized to delete this comment" });
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: error.message });
  }
});



module.exports = router;
