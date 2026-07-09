import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout } from "../app/features/authSlice";
import { User, LogOut } from "lucide-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const logoutUser = () => {
    setIsDropdownOpen(false);
    navigate("/");
    dispatch(logout());
  };

  const initial = user?.name ? user.name[0].toUpperCase() : "P";

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-white/75 dark:bg-slate-900/75 border-b border-slate-100/80 dark:border-slate-800/50 shadow-xs dark:shadow-none transition-colors duration-300">
      <nav className="flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 dark:text-slate-100 transition-all">
        <Link to="/">
          <img src="/logo.svg" alt="logo" className="h-11 w-auto" />
        </Link>

        <div className="relative flex items-center gap-3">
          <ThemeToggle />
          {/* Profile Click Trigger */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 px-3 py-1.5 rounded-full transition-all duration-300 focus:outline-none cursor-pointer group"
          >
            {/* Profile Image P (First) */}
            <div className="size-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-extrabold text-sm flex items-center justify-center shadow-sm select-none transition-transform active:scale-95 duration-300 uppercase">
              {initial}
            </div>

            {/* Name Greeting (Next) */}
            <p className="max-sm:hidden text-sm font-semibold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
              Hi, {user?.name}
            </p>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Backdrop to close dropdown on clicking outside */}
              <div
                className="fixed inset-0 z-10 cursor-default"
                onClick={() => setIsDropdownOpen(false)}
              />

              {/* Actual Dropdown panel */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl dark:shadow-slate-950/20 py-3 px-3 z-20 animate-fade-in flex flex-col gap-1.5">
                {/* User Info Header */}
                <div className="px-3 py-2">
                  <p className="font-bold text-slate-800 dark:text-slate-100 text-sm truncate">{user?.name}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate mt-0.5">{user?.email}</p>
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1" />

                {/* Profile Link */}
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    navigate("/app/profile");
                  }}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 rounded-xl text-left text-xs font-semibold transition-all duration-200 cursor-pointer"
                >
                  <User className="size-4 text-slate-400" />
                  <span>My Profile</span>
                </button>

                {/* Logout Button */}
                <button
                  onClick={logoutUser}
                  className="flex items-center gap-2.5 w-full px-3 py-2 text-red-650 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl text-left text-xs font-semibold transition-all duration-200 cursor-pointer"
                >
                  <LogOut className="size-4 text-red-400" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
