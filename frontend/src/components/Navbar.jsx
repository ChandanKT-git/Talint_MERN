import { Link, useLocation } from "react-router";
import { BookOpenIcon, LayoutDashboardIcon, LogOutIcon, SparklesIcon, UserIcon } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-base-100/80 backdrop-blur-md border-b border-primary/20 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto p-4 flex items-center justify-between">
        {/* LOGO */}
        <Link
          to="/"
          className="group flex items-center gap-3 hover:scale-105 transition-transform duration-200"
        >
          <div className="size-10 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent flex items-center justify-center shadow-lg ">
            <SparklesIcon className="size-6 text-white" />
          </div>

          <div className="flex flex-col">
            <span className="font-black text-xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-mono tracking-wider">
              Talint
            </span>
            <span className="text-xs text-base-content/60 font-medium -mt-1">Code Together</span>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {/* PROBLEMS PAGE LINK */}
          <Link
            to={"/problems"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${
                isActive("/problems")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <BookOpenIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Problems</span>
            </div>
          </Link>

          {/* DASHBORD PAGE LINK */}
          <Link
            to={"/dashboard"}
            className={`px-4 py-2.5 rounded-lg transition-all duration-200 
              ${
                isActive("/dashboard")
                  ? "bg-primary text-primary-content"
                  : "hover:bg-base-200 text-base-content/70 hover:text-base-content"
              }
              
              `}
          >
            <div className="flex items-center gap-x-2.5">
              <LayoutDashboardIcon className="size-4" />
              <span className="font-medium hidden sm:inline">Dashboard</span>
            </div>
          </Link>

          {/* USER DROPDOWN */}
          {user && (
            <div className="dropdown dropdown-end ml-4">
              <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full bg-base-300 flex items-center justify-center">
                  {user.profileImage ? (
                    <img alt="User avatar" src={user.profileImage} />
                  ) : (
                    <UserIcon className="size-6" />
                  )}
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow border border-base-200"
              >
                <li className="px-4 py-2 opacity-70 font-semibold">{user.name}</li>
                <li>
                  <button onClick={logout} className="text-error">
                    <LogOutIcon className="size-4" />
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
export default Navbar;
