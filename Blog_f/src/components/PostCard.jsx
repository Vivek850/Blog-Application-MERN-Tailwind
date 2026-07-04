import { useState, useEffect } from "react";
import { FaThumbsUp, FaThumbsDown, FaComment } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Comment from "./Comment";
import { MdDelete } from "react-icons/md";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const user = JSON.parse(localStorage.getItem("user"));
const currentUserId = user?.id || user?._id;

export default function PostCard({ post, setPosts, isProfilePage = false }) {
  const [likes, setLikes] = useState(post.likesCount ?? 0);
  const [dislikes, setDislikes] = useState(post.dislikesCount ?? 0);
  const [liked, setLiked] = useState(post.liked ?? false);
  const [disliked, setDisliked] = useState(post.disliked ?? false);
  const [isCommentOpen, setIsCommentOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  // const isGuest = "!token"; //  Guest flag check
  const isGuest = localStorage.getItem("guest") === "true"; //  Guest flag check

  useEffect(() => {
    setLikes(post.likesCount ?? 0);
    setDislikes(post.dislikesCount ?? 0);
    setLiked(post.liked ?? false);
    setDisliked(post.disliked ?? false);
  }, [post]);

  const handleLike = async () => {
    if (isGuest) return navigate("/login"); //  redirect guest
    try {
      const res = await axios.put(
        `http://localhost:5000/api/posts/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setLikes(res.data.likesCount);
      setDislikes(res.data.dislikesCount);
      setLiked(res.data.liked);
      setDisliked(res.data.disliked);
      if (setPosts) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === post._id
              ? {
                  ...p,
                  likesCount: res.data.likesCount,
                  dislikesCount: res.data.dislikesCount,
                  liked: res.data.liked,
                  disliked: res.data.disliked,
                }
              : p,
          ),
        );
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleDislike = async () => {
    if (isGuest) return navigate("/login"); //  redirect guest
    try {
      const res = await axios.put(
        `http://localhost:5000/api/posts/${post._id}/dislike`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setLikes(res.data.likesCount);
      setDislikes(res.data.dislikesCount);
      setLiked(res.data.liked);
      setDisliked(res.data.disliked);
      if (setPosts) {
        setPosts((prev) =>
          prev.map((p) =>
            p._id === post._id
              ? {
                  ...p,
                  likesCount: res.data.likesCount,
                  dislikesCount: res.data.dislikesCount,
                  liked: res.data.liked,
                  disliked: res.data.disliked,
                }
              : p,
          ),
        );
      }
    } catch (error) {
      console.error("Error disliking post:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (setPosts) {
        setPosts((prev) => prev.filter((p) => p._id !== post._id));
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: post.content.slice(0, 100) + "...", // short preview
          url: `${window.location.origin}/posts/${post._id}`,
        })
        .then(() => console.log("Post shared successfully"))
        .catch((err) => console.error("Error sharing:", err));
    } else {
      alert("Sharing not supported on this browser");
    }
  };

  return (
    <div className="border p-4 rounded-lg shadow mb-4">
      <h2 className="text-xl font-bold break-words">{post.title}</h2>
      <p
        className="text-gray-600 cursor-pointer hover:underline"
        onClick={() =>
          navigate(`/author/${post.createdBy?._id || post.createdBy}`)
        }
      >
        By {post.authorName}
      </p>
      <div className="prose mt-2 break-words">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content?.toString()}
        </ReactMarkdown>
      </div>

      <div className="flex gap-6 mt-4 text-gray-700">
        <span
          className={`flex items-center gap-1 cursor-pointer ${liked ? "text-blue-600" : ""}`}
          onClick={handleLike}
        >
          <FaThumbsUp /> {likes}
        </span>
        <span
          className={`flex items-center gap-1 cursor-pointer ${disliked ? "text-red-600" : ""}`}
          onClick={handleDislike}
        >
          <FaThumbsDown /> {dislikes}
        </span>

        <span
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => {
            if (isGuest) return navigate("/login"); //  redirect guest
            setIsCommentOpen(true);
          }}
        >
          <FaComment /> {post.commentsCount ?? post.comments.length}
        </span>
        <button onClick={handleShare} className="text-blue-600 hover:underline">
          Share
        </button>

        {isProfilePage &&
          (post.createdBy?._id?.toString() === currentUserId?.toString() ||
            post.createdBy?.toString() === currentUserId?.toString()) && (
            <span
              className="ml-auto text-red-600 hover:text-red-800 flex items-center gap-1 cursor-pointer"
              onClick={handleDelete}
            >
              <MdDelete size={24} />
            </span>
          )}
      </div>

      {isCommentOpen && (
        <Comment
          post={post}
          onClose={() => setIsCommentOpen(false)}
          setPosts={setPosts}
        />
      )}
    </div>
  );
}
