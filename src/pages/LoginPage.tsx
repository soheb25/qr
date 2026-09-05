import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../utils/auth';
import { CGM_LOGO_BASE64 } from '../assets/cgmLogo';
import { Lock, Mail, Eye, EyeOff, AlertCircle, ShieldCheck, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to home
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const success = authService.login(email, password);
      if (success) {
        const from = (location.state as any)?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        setError('Invalid email or password. Access is restricted to authorized personnel.');
        setLoading(false);
      }
    }, 400);
  };

  const handleAutoFill = () => {
    setEmail(authService.getValidEmail());
    setPassword(authService.getValidPassword());
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.25),rgba(255,255,255,0))] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center px-4">
        {/* Official CGM Gujarat Logo */}
        <div className="flex justify-center mb-5">
          <div className="w-24 h-24 rounded-full bg-white p-2 shadow-2xl ring-4 ring-indigo-500/30 flex items-center justify-center">
            <img 
              src={CGM_LOGO_BASE64} 
              alt="Commissioner of Geology & Mining Gujarat" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          DC Pass Portal
        </h2>
        <p className="mt-1 text-sm text-indigo-300 font-medium">
          Commissioner of Geology and Mining, Gujarat
        </p>
        <p className="mt-1 text-xs text-slate-400">
          Government of Gujarat | Authorized Department Access
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="backdrop-blur-xl bg-white/10 py-8 px-6 shadow-2xl rounded-3xl border border-white/20 sm:px-10 space-y-6">
          
          {error && (
            <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/40 flex items-start gap-3 text-red-200 text-sm animate-shake">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-indigo-200 mb-1.5 ml-1">
                Authorized Email
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="newindian2345@gmail.com"
                  className="block w-full pl-11 pr-4 py-3 bg-slate-900/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-indigo-200 mb-1.5 ml-1">
                Password
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="block w-full pl-11 pr-11 py-3 bg-slate-900/60 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* Auto Fill Quick Button for Convenience */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Authorized Credentials Required</span>
              <button
                type="button"
                onClick={handleAutoFill}
                className="text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-2 cursor-pointer transition-colors"
              >
                Auto-fill Login
              </button>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-slate-900 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Department Security Notice */}
          <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL Encrypted Verification System</span>
          </div>

        </div>
      </div>
    </div>
  );
};
