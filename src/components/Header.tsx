import { Link } from 'react-router-dom';
import { Trello } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { loginWithGoogle, logout } from '../lib/auth';

const Header = () => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-black/30 border-b border-white/10 shadow-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Branding */}
        <Link to="/" className="flex items-center space-x-3">
          <div className="p-2 bg-gradient-to-tr from-cyan-500 to-blue-600 rounded-xl text-white shadow-md">
            <Trello className="h-5 w-5" />
          </div>
          <span className="text-xl font-extrabold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 text-transparent bg-clip-text">
            TaskIt
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-sm font-medium text-white/80 hover:text-white transition"
          >
            Boards
          </Link>
          <a
            href="https://github.com/Riddz04"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-white/80 hover:text-cyan-400 transition"
          >
            GitHub
          </a>
          {user ? (
            <button
              onClick={logout}
              className="px-4 py-1.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-white/10 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={loginWithGoogle}
              className="px-4 py-1.5 rounded-lg text-sm font-medium bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow transition-all"
            >
              Login
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
