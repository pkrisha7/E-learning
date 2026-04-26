import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
  try {
    const res = await login(data);
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
        <p className="text-gray-500 mb-8">Sign in to continue learning</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email required' })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="you@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password required' })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          No account? <Link to="/register" className="text-primary font-medium hover:underline">Sign up free</Link>
        </p>
      </div>
    </div>
  );
}