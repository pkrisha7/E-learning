import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import Logo from '../../components/Logo';

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await login(data);
      sessionStorage.setItem('isNewUser', 'false');
      loginUser(res.data.token, res.data.user);
      toast.success('Welcome back!');
      const role = res.data.user.role;
      if (role === 'admin') navigate('/admin');
      else if (role === 'instructor') navigate('/tutor');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50/50 to-indigo-50/40 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-8 md:p-10 w-full max-w-md relative z-10">
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Welcome back</h1>
          <p className="text-slate-500 text-sm mt-1">Sign in to continue your learning journey</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-slate-50/50 focus:bg-white"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-xs font-medium text-sky-600 hover:text-sky-700 transition-colors">
                Forgot password?
              </Link>
            </div>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-slate-50/50 focus:bg-white"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-sky-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-8">
          Don't have an account? <Link to="/register" className="text-sky-600 font-bold hover:underline">Sign up free</Link>
        </p>
      </div>
    </div>
  );
}