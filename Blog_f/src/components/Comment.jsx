import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Comment({ post, onClose, setPosts }) {
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Load comments when popup opens
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/posts/${post._id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        setComments(res.data.comments);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };
    fetchComments();
  }, [post._id, token]);

  // Add new comment
  const handleAddComment = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `http://localhost:5000/api/posts/${post._id}/comment`,
        { text: commentText },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // ✅ Update local comments immediately
      setComments(res.data.comments);
      setCommentText("");

      // ✅ Update parent posts list (so count updates without refresh)
      if (setPosts) {
        setPosts(prevPosts =>
          prevPosts.map(p =>
            p._id === post._id
              ? { ...p, commentsCount: res.data.commentsCount }
              : p
          )
        );
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

// Delete comment
const handleDeleteComment = async (commentId) => {
  try {
    const res = await axios.delete(
      `http://localhost:5000/api/posts/${post._id}/comments/${commentId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    // ✅ Update local comments immediately
    setComments(res.data.comments);

    // ✅ Update parent posts list (so count updates without refresh)
    if (setPosts) {
      setPosts(prevPosts =>
        prevPosts.map(p =>
          p._id === post._id
            ? { ...p, commentsCount: res.data.commentsCount }
            : p
        )
      );
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
};



  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-[70%] h-[80%] z-10 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Comments ({comments.length})</h2>
        <ul className="space-y-2 mb-4">
          {comments.map((c, idx) => (
            <li key={idx} className="border-b pb-2 cursor-pointer">
              <div>
              <strong
                className="text-blue-600 hover:underline"
                onClick={() => navigate(`/author/${c.user?._id}`)}
              >
                {c.user?.name}
              </strong>
              : {c.text}
              </div>

{(
  post.createdBy?._id?.toString() === JSON.parse(localStorage.getItem("user"))._id?.toString() ||
  post.createdBy?.toString() === JSON.parse(localStorage.getItem("user"))._id?.toString() ||
  c.user?._id?.toString() === JSON.parse(localStorage.getItem("user"))._id?.toString()
) && (
  <button
    onClick={() => handleDeleteComment(c._id)}
    className="text-red-500 hover:text-red-700 ml-4"
  >
    Delete
  </button>
)}

            </li>
          ))}
        </ul>
        <form onSubmit={handleAddComment} className="flex gap-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            className="flex-1 border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
}
