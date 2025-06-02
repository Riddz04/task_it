import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import BoardsView from './pages/BoardsView';
import BoardDetail from './pages/BoardDetail';
import NotFound from './pages/NotFound';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<BoardsView />} />
          <Route path="/boards/:boardId" element={<BoardDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="bg-white shadow-inner py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          © 2025 TaskIt. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default App;