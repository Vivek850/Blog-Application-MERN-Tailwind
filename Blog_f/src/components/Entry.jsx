import { Link } from "react-router-dom"

function Entry() {
  return (
    <div className="bg-[url('https://wallpaperaccess.com/full/4085479.jpg')] flex items-center justify-center h-screen bg-cover bg-center">
          
      <div className="group p-[3px] rounded-lg border-2 transition-transform duration-300">
        <div className=" rounded-lg p-6 flex flex-col items-center">
          <h1 className="text-3xl font-bold text-white">
            Welcome to My Blog
          </h1>
          {/* button hidden by default, visible on hover */}
          <Link to="/Signup" className="mt-6 px-4 py-2
           bg-gradient-to-r from-blue-700 via-gray-600 to-red-600 rounded-lg duration-300 text-white rounded hover:from-blue-900 hover:via-gray-800 hover:to-red-800">
            Sign Up / Login
          </Link>
        </div>
      </div>
    </div>
    // </div>
  )
}

export default Entry
