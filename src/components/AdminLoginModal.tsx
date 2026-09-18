import React, { useState } from 'react';
import { Lock, X, KeyRound, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import { useToast } from './Toast';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const { showToast } = useToast();
  const [username, setUsername] = useState('toys');
  const [password, setPassword] = useState('toys');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await api.adminLogin(username, password);
      if (res.token) {
        showToast('Welcome to Toys Admin Portal', 'success');
        onLoginSuccess(res.token);
        onClose();
      } else {
        setErrorMsg('Invalid response from server.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Invalid username or password.');
      showToast('Authentication failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-[#1C1917] text-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-[#38332E] animate-in zoom-in-95 duration-200">
        
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-stone-400 hover:text-white p-1 rounded-lg cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          <div className="w-14 h-14 bg-[#292524] text-[#F59E0B] border border-[#38332E] rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <div className="text-center mb-6">
            <h3 className="text-2xl font-black uppercase tracking-tight">Toys Admin Portal</h3>
            <p className="text-xs text-[#A8A29E] mt-1">
              Toysn Wood &amp; Super Cakes Management Dashboard
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-red-950/80 border border-red-800/80 text-red-200 text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-[#A8A29E] mb-1">
                Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="toys"
                className="w-full px-4 py-2.5 bg-[#292524] border border-[#38332E] rounded-xl text-sm text-white focus:ring-2 focus:ring-[#F59E0B] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-bold tracking-wider text-[#A8A29E] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="toys"
                className="w-full px-4 py-2.5 bg-[#292524] border border-[#38332E] rounded-xl text-sm text-white focus:ring-2 focus:ring-[#F59E0B] focus:outline-none"
              />
            </div>

            <div className="bg-[#292524]/60 border border-[#38332E] rounded-xl p-3 text-[11px] text-[#A8A29E]">
              <strong>Admin Credentials:</strong><br />
              Username: <code className="text-amber-400 font-bold">toys</code><br />
              Password: <code className="text-amber-400 font-bold">toys</code>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#D97706] hover:bg-[#B45309] disabled:bg-stone-600 text-white font-bold py-3 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
            >
              <KeyRound className="w-4 h-4" />
              {isLoading ? 'Verifying...' : 'Sign In to Dashboard'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};
