import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BoardsView from './pages/BoardsView';
import BoardDetail from './pages/BoardDetail';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-100 text-gray-800">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white/60 backdrop-blur-md shadow-md">
        <Header />
      </div>

      {/* Main content */}
      <main className="flex-1 container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<BoardsView />} />
          <Route path="/boards/:boardId" element={<BoardDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white/60 backdrop-blur-md shadow-inner py-5">
        <div className="container mx-auto px-4 text-center text-sm text-gray-600">
          Made with <span className="text-red-500">❤️</span> by <span className="font-medium text-indigo-600">Riddhi</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
