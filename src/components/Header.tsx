import { Link } from 'react-router-dom';
import { Trello } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex justify-between items-center">
          {/* Branding */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-xl text-white shadow-md">
              <Trello className="h-5 w-5" />
            </div>
            <span className="text-xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">
              TaskIt
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              to="/"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              Boards
            </Link>
            <a
              href="https://github.com/Riddz04"
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
