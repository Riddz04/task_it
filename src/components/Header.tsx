import { Link } from 'react-router-dom';
import { Trello } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Trello className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-indigo-600">TaskIt</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
            >
              Boards
            </Link>
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noreferrer"
              className="text-gray-700 hover:text-indigo-600 font-medium transition-colors duration-200"
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