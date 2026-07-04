import { useState } from "react";
import axios from "axios";

function PostPopup({ isOpen, onClose, onSubmit }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token"); // login ke time save kiya tha

      const res = await axios.post(
        "http://localhost:5000/api/posts",
        { title, content },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      console.log("Post created:", res.data);

      // Parent component ko notify karo
      if (onSubmit) {
        onSubmit(res.data);
      }

      // Reset form
      setTitle("");
      setContent("");
      onClose();
    } catch (error) {
      console.error(
        "Error creating post:",
        error.response ? error.response.data : error.message
      );
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      {/* Background overlay with blur */}
      <div
        className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Popup box */}
      <div className="relative bg-white rounded-lg shadow-lg p-6 w-[70%] h-[80%] z-10">
        <h2 className="text-xl font-bold mb-4">Create New Blog</h2>
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Blog Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <textarea
            placeholder="Blog Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-[290px]
            md:h-[300px]
            lg:h-[300px]
            xl:h-[300px]
            2xl:h-[650px]
            "
            // rows="21"
            required
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PostPopup;
