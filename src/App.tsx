import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import BoardsView from './pages/BoardsView';
import BoardDetail from './pages/BoardDetail';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import { useAuth } from './context/AuthContext';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin"></div>
          <div className="text-xl font-semibold text-white tracking-wide">
            Loading TaskIt
            <span className="animate-pulse">...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex flex-col bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white overflow-hidden">
      {user && (
        <div className="flex-none z-20 bg-black/20 backdrop-blur-xl border-b border-white/10">
          <Header />
        </div>
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <Routes>
          <Route path="/login" element={<LandingPage />} />
          <Route path="/" element={user ? <BoardsView /> : <Navigate to="/login" replace />} />
          <Route path="/boards/:boardId" element={user ? <BoardDetail /> : <Navigate to="/login" replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {user && (
        <footer className="flex-none bg-black/20 backdrop-blur-xl border-t border-white/10 py-3 text-center text-xs text-gray-400">
          <div className="flex items-center justify-center space-x-2">
            <span>Crafted with</span>
            <span className="text-cyan-400 animate-pulse">⚡</span>
            <span>by</span>
            <span className="text-cyan-400 font-semibold">Riddhi</span>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;