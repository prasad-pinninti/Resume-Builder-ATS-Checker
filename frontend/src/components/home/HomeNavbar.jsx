import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle";

const HomeNavbar = () => {
  const { user } = useSelector((state) => state.auth);
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-800/50 shadow-xs transition-all duration-300">
      <a href="#">
        <img src="/logo.svg" alt="logo" className="h-11 w-auto" />
      </a>

      <div className="hidden md:flex items-center gap-8 transition duration-500 text-slate-800 dark:text-slate-200 font-medium">
        <a href="#" className="hover:text-green-600 dark:hover:text-green-400 transition">
          Home
        </a>
        <a href="#features" className="hover:text-green-600 dark:hover:text-green-400 transition">
          Features
        </a>
        <a href="#testimonials" className="hover:text-green-600 dark:hover:text-green-400 transition">
          Testimonials
        </a>
        <a href="#cta" className="hover:text-green-600 dark:hover:text-green-400 transition">
          Contact
        </a>
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <Link
          to="/app?state=register"
          className="hidden md:block px-6 py-2 bg-green-500 hover:bg-green-600 active:scale-95 transition-all rounded-full text-white font-medium shadow-sm hover:shadow"
          hidden={user}
        >
          Get started
        </Link>
        <Link
          to="/app?state=login"
          className="hidden md:block px-6 py-2 border border-slate-300 dark:border-slate-700 active:scale-95 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all rounded-full text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-medium"
          hidden={user}
        >
          Login
        </Link>

        <Link
          to="/app"
          className="hidden md:block px-8 py-2 bg-green-500 hover:bg-green-600 active:scale-95 transition-all rounded-full text-white font-medium shadow-sm hover:shadow"
          hidden={!user}
        >
          Dashboard
        </Link>
      </div>

      <button
        onClick={() => setMenuOpen(true)}
        className="md:hidden active:scale-90 transition text-slate-700 hover:text-slate-900"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="lucide lucide-menu"
        >
          <path d="M4 5h16M4 12h16M4 19h16" />
        </svg>
      </button>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-[100] bg-black/60 text-white backdrop-blur-md flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <a href="#" onClick={() => setMenuOpen(false)} className="hover:text-green-400 transition">
          Home
        </a>
        <a href="#features" onClick={() => setMenuOpen(false)} className="hover:text-green-400 transition">
          Features
        </a>
        <a href="#testimonials" onClick={() => setMenuOpen(false)} className="hover:text-green-400 transition">
          Testimonials
        </a>
        <a href="#cta" onClick={() => setMenuOpen(false)} className="hover:text-green-400 transition">
          Contact
        </a>
        
        <div className="flex flex-col gap-3 mt-4 w-48 text-center">
          <Link
            to="/app?state=register"
            onClick={() => setMenuOpen(false)}
            className="px-6 py-2.5 bg-green-500 hover:bg-green-600 transition-all rounded-full text-white text-sm font-medium"
            hidden={user}
          >
            Get started
          </Link>
          <Link
            to="/app?state=login"
            onClick={() => setMenuOpen(false)}
            className="px-6 py-2.5 border border-white/40 hover:bg-white/10 transition-all rounded-full text-white text-sm font-medium"
            hidden={user}
          >
            Login
          </Link>
          <Link
            to="/app"
            onClick={() => setMenuOpen(false)}
            className="px-6 py-2.5 bg-green-500 hover:bg-green-600 transition-all rounded-full text-white text-sm font-medium"
            hidden={!user}
          >
            Dashboard
          </Link>
        </div>

        <button
          onClick={() => setMenuOpen(false)}
          className="absolute top-6 right-6 active:scale-95 transition size-10 items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full flex text-xl font-bold"
        >
          ✕
        </button>
      </div>
    </nav>
  );
};

export default HomeNavbar;
