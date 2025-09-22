// components/Navbar.jsx
import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout, booting } = useContext(AuthContext);
  const displayName = user?.username || user?.email?.split("@")[0];

  return (
    <nav className="bg-blue-700 text-white px-4 lg:px-8 py-3 lg:py-5 flex justify-between items-center shadow-lg border-b border-blue-800 fixed top-0 left-0 right-0 z-50">
      <Link to="/dashboard" className="text-xl lg:text-3xl font-extrabold tracking-tight">
        <span className="hidden sm:inline">ProductiveBoards</span>
        <span className="sm:hidden">PB</span>
      </Link>

      {booting ? null : (
        user ? (
          <div className="flex items-center gap-2 lg:gap-4">
            <span className="text-xs lg:text-lg font-semibold bg-blue-900/70 px-2 lg:px-3 py-1 rounded truncate max-w-24 lg:max-w-none">
              <span className="hidden lg:inline">{displayName}</span>
              <span className="lg:hidden">{displayName.slice(0, 8)}{displayName.length > 8 ? '...' : ''}</span>
            </span>
            <button
              onClick={logout}
              className="bg-red-500 px-3 lg:px-4 py-1 lg:py-2 rounded-lg hover:bg-red-600 font-bold transition text-sm lg:text-base"
            >
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2 lg:gap-4">
            <Link to="/login" className="bg-white text-blue-700 px-3 lg:px-4 py-1 lg:py-2 rounded-lg font-semibold hover:bg-blue-50 transition text-sm lg:text-base">
              Login
            </Link>
            <Link to="/signup" className="bg-blue-500 px-3 lg:px-4 py-1 lg:py-2 rounded-lg font-semibold hover:bg-blue-600 transition text-sm lg:text-base">
              <span className="hidden sm:inline">Sign up</span>
              <span className="sm:hidden">Join</span>
            </Link>
          </div>
        )
      )}
    </nav>
  );
}
