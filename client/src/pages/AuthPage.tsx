import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth";
import { loginService, registerService, googleLoginService } from "../services/auth.service";

export const AuthPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async () => {
    setError('');
    setSuccess('');
    if (!form.email || !form.password) return setError('Email and password are required');
    if (tab === 'register' && !form.name) return setError('Name is required');

    try {
      if (tab === 'register') {
        await registerService(form.name, form.email, form.password);
        setSuccess('Account created! You can now sign in.');
        setForm({ name: '', email: '', password: '' });
        setTab('login');
      } else {
        const data = await loginService(form.email, form.password);
        login(data.user);
        localStorage.setItem('app_token', data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    }
  };

  const handleGoogle = async (credentialResponse: any) => {
    try {
      const data = await googleLoginService(credentialResponse.credential);
      login(data.user);
      localStorage.setItem('app_token', data.token);
      navigate('/dashboard');
    } catch (err) {
      console.error('Google login error:', err);
    }
  };

  return (
    <div className="flex h-screen">

      {/* left — form */}
      <div className="w-full md:w-1/2 flex items-center justify-center px-8 bg-white">
        <div className="w-full max-w-sm">

          <div className="mb-8">
            <div className="mb-1">
              <span className="text-2xl font-semibold text-gray-900">VIVAT</span>
              <span className="text-2xl font-semibold text-indigo-600"> WorkHub</span>
            </div>
            <p className="text-xs text-gray-400 tracking-wide">work management platform</p>
            <p className="text-sm text-gray-500 mt-3">
              {tab === 'login' ? 'Welcome back' : 'Create a new account'}
            </p>
          </div>

          {/* tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button
              onClick={() => { setTab('login'); setError(''); setSuccess(''); }}
              className={`flex-1 py-1.5 text-sm rounded-md transition-colors font-medium
                ${tab === 'login' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Sign in
            </button>
            <button
              onClick={() => { setTab('register'); setError(''); setSuccess(''); }}
              className={`flex-1 py-1.5 text-sm rounded-md transition-colors font-medium
                ${tab === 'register' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Sign up
            </button>
          </div>

          {/* messages */}
          {error && (
            <div className="mb-4 px-3 py-2 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 px-3 py-2 bg-green-50 border border-green-100 rounded-lg text-sm text-green-600">
              {success}
            </div>
          )}

          {/* fields */}
          <div className="flex flex-col gap-3">
            {tab === 'register' && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Full name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition"
                />
              </div>
            )}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 transition"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full mt-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors"
          >
            {tab === 'login' ? 'Sign in' : 'Create account'}
          </button>

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogle}
              onError={() => console.log('login error')}
            />
          </div>
        </div>
      </div>

      {/* right — image */}
      <div className="hidden md:flex md:w-1/2 bg-indigo-600 items-center justify-center relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80"
          alt="team collaboration"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="relative z-10 text-center px-10">
          <p className="text-indigo-300 text-xs tracking-widest uppercase mb-2">VIVAT</p>
          <h2 className="text-3xl font-semibold text-white mb-3">WorkHub</h2>
          <p className="text-indigo-200 text-sm leading-relaxed max-w-xs">
            Manage your projects, tasks and team all in one place.
          </p>
        </div>
      </div>

    </div>
  );
};