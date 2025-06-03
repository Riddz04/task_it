import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trello, Zap, Target, Users } from 'lucide-react';

const Landing = () => {
  const { user, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-4 -left-4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-4 -right-4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-lg mx-auto px-6">
        {/* Logo and branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl shadow-2xl mb-6 transform hover:scale-105 transition-transform duration-300">
            <Trello className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            TaskIt
          </h1>
          
          <p className="text-lg text-gray-300 font-light">
            Modern Task Board for teams that{' '}
            <span className="text-cyan-400 font-medium">build fast</span>
          </p>
        </div>

        {/* Feature highlights */}
        <div className="flex items-center justify-center space-x-8 mb-10">
          <div className="flex flex-col items-center group">
            <div className="w-12 h-12 bg-white/5 backdrop-blur border border-white/10 rounded-xl flex items-center justify-center mb-2 group-hover:bg-white/10 transition-colors">
              <Zap className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-xs text-gray-400">Lightning Fast</span>
          </div>
          
          <div className="flex flex-col items-center group">
            <div className="w-12 h-12 bg-white/5 backdrop-blur border border-white/10 rounded-xl flex items-center justify-center mb-2 group-hover:bg-white/10 transition-colors">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <span className="text-xs text-gray-400">Stay Focused</span>
          </div>
          
          <div className="flex flex-col items-center group">
            <div className="w-12 h-12 bg-white/5 backdrop-blur border border-white/10 rounded-xl flex items-center justify-center mb-2 group-hover:bg-white/10 transition-colors">
              <Users className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xs text-gray-400">Team Ready</span>
          </div>
        </div>

        {/* CTA section */}
        <div className="text-center">
          <button
            onClick={loginWithGoogle}
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-white/20 backdrop-blur"
          >
            <span className="relative z-10">Continue with Google</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
          </button>
          
          
        </div>

        {/* Creator attribution */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <span>Crafted with</span>
            <span className="text-cyan-400 animate-pulse">⚡</span>
            <span>by</span>
            <span className="text-cyan-400 font-semibold">Riddhi</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;