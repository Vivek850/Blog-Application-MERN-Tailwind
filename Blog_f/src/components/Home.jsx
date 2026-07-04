import { useEffect, useState, useContext } from "react";
import axios from "axios";
import PostCard from "./PostCard";
import PostPopup from "./PostPopup";
import { ThemeContext } from "./ThemeContext";
import { FaPen } from "react-icons/fa";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { darkMode, font } = useContext(ThemeContext);

useEffect(() => {
  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      // const isGuest = localStorage.getItem("guest") === "true";
      const isGuest = !token;

      //  Guest ke liye public route, logged‑in ke liye protected route
      const url = isGuest
        ? "http://localhost:5000/api/posts/public"
        : "http://localhost:5000/api/posts";

      const res = await axios.get(url, {
        headers: !isGuest ? { Authorization: `Bearer ${token}` } : {},
        withCredentials: !isGuest, // guest ke liye unnecessary
      });

      // sort by createdAt descending
      const sorted = res.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setPosts(sorted);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  fetchPosts();
}, []);


  return (
    <div
      className={`${font} ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      } p-6 pt-[8em] min-h-screen`}
    >
      <button
        onClick={() => setIsPopupOpen(true)}
        className="flex mb-4 py-1 px-1 bg-blue-600 text-white rounded hover:bg-blue-700

        "
      >
       <FaPen /> 
      </button>

      {posts.length > 0 ? (
        posts.map((post) => (
          <PostCard key={post._id} post={post} setPosts={setPosts} className ="bg-white"/>  
        ))) : (<p>No posts available.</p>)

        }

      {isPopupOpen && (
        <PostPopup
          isOpen={isPopupOpen}
          onClose={() => setIsPopupOpen(false)}
          onSubmit={(newPost) => setPosts((prev) => [newPost, ...prev])}
          isProfilePage={false} //  new post shows instantly
        />
      )}

    </div>
  );
}
