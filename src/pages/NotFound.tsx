import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-center px-4">
      <h1 className="text-9xl font-bold text-indigo-600">404</h1>
      <h2 className="text-3xl font-semibold mt-6 mb-2">Page not found</h2>
      <p className="text-gray-600 mb-8">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-200"
      >
        Go back to Boards
      </Link>
    </div>
  );
};

export default NotFound;