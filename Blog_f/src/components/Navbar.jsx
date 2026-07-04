import { FaHome, FaUser, FaPen, FaCog,FaInfo } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 w-full flex justify-center p-4 z-50">
      <div className="flex justify-around border-2 border-black text-black p-4 rounded-full bg-white shadow-lg text-[7px] gap-2
      xs:text-[7px] 
      sm:text-[8px] 
      md:text-[10px] md:gap-6
      lg:text-[14px] lg:gap-8
      xl:text-[18px] xl:gap-10
      2xl:text-[21px] 2xl:gap-24
      ">
        <Link to="/home" className="flex items-center gap-1">
          <FaHome /> Home
        </Link>
        <Link to="/profile" className="flex items-center gap-1">
          <FaUser /> Profile
        </Link>
        <Link
          to="/post"
          state={{ backgroundLocation: location }}
          className="flex items-center gap-1"
        >
          <FaPen /> Post
        </Link>
        <Link to="/settings" className="flex items-center gap-1">
          <FaCog /> Settings
        </Link>
        <Link to="/info" className="flex items-center gap-1">
          <FaInfo /> Info
        </Link>
      </div>
    </nav>
  );
}
