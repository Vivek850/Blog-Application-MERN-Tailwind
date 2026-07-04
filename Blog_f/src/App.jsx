import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Entry from "./components/Entry";
import SignupPage from "./components/Sign";
import LoginPage from "./components/login";
import Home from "./components/Home";
import Navbar from "./components/Navbar";
import ProfilePage from "./components/ProfilePage";
import PostPopup from "./components/PostPopup";
import SettingsPage from "./components/SettingsPage";
import ThemeProvider from "./components/ThemeContext";
import { useState } from "react";
import Author from "./components/Author";
import Info from "./components/Info";
const isGuest = localStorage.getItem("guest") === "true";
const token = localStorage.getItem("token");

function AppRoutes() {
  const [posts, setPosts] = useState([]);
  const location = useLocation();
  const state = location.state;

  // Navbar sirf in pages par dikhana hai
  const showNavbar = [
    "/home",
    "/profile",
    "/settings",
    "/info",
    "/author/:id",
  ].includes(location.pathname.toLowerCase());

  return (
    <>
      <ThemeProvider>
        {showNavbar && <Navbar />}

        <Routes location={state?.backgroundLocation || location}>
          <Route path="/" element={<Entry />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/home"
            element={<Home isGuest={isGuest} posts={posts} setPosts={setPosts} />}
          />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/author/:id" element={<Author />} />
          <Route path="/info" element={<Info />} />
        </Routes>
      </ThemeProvider>

      {/* Popup route */}
      {state?.backgroundLocation && (
        <Routes>
          <Route
            path="/post"
            element={
              <PostPopup
                isOpen={true}
                onClose={() => window.history.back()}
                onSubmit={
                  (newPost) => setPosts((prevPosts) => [newPost, ...prevPosts]) // turant UI update
                } // Home component ke posts state ko update karne ke liye
              />
            }
          />
        </Routes>
      )}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}
