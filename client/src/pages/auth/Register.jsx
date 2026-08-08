import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerUser } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useState } from 'react';
import Logo from '../../components/Logo';

export default function Register() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('student');

  const onSubmit = async (data) => {
    try {
      const res = await registerUser({ ...data, role });
      sessionStorage.setItem('isNewUser', 'true');
      loginUser(res.data.token, res.data.user);
      toast.success('Account created!');
      if (res.data.user.role === 'instructor') navigate('/tutor');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50/50 to-indigo-50/40 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-8 md:p-10 w-full max-w-md relative z-10">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-3">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900">Create Account</h1>
          <p className="text-slate-500 text-sm mt-1">Join Learnly today — start free</p>
        </div>

        {/* Role Selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            type="button"
            onClick={() => setRole('student')}
            className={`p-3.5 rounded-2xl border-2 text-center transition-all ${
              role === 'student'
                ? 'border-sky-500 bg-sky-50/70 shadow-xs'
                : 'border-slate-200 hover:border-sky-200 bg-slate-50/40'
            }`}
          >
            <div className="text-2xl mb-1">🎓</div>
            <div className={`font-bold text-sm ${role === 'student' ? 'text-sky-700' : 'text-slate-700'}`}>Student</div>
            <div className="text-xs text-slate-400 mt-0.5">I want to learn</div>
          </button>

          <button
            type="button"
            onClick={() => setRole('instructor')}
            className={`p-3.5 rounded-2xl border-2 text-center transition-all ${
              role === 'instructor'
                ? 'border-sky-500 bg-sky-50/70 shadow-xs'
                : 'border-slate-200 hover:border-sky-200 bg-slate-50/40'
            }`}
          >
            <div className="text-2xl mb-1">👨‍🏫</div>
            <div className={`font-bold text-sm ${role === 'instructor' ? 'text-sky-700' : 'text-slate-700'}`}>Tutor</div>
            <div className="text-xs text-slate-400 mt-0.5">I want to teach</div>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Full Name</label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-slate-50/50 focus:bg-white"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.name.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Email Address</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-slate-50/50 focus:bg-white"
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Minimum 6 characters' } })}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-slate-50/50 focus:bg-white"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-sky-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 mt-2"
          >
            {isSubmitting ? 'Creating Account...' : `Create ${role === 'instructor' ? 'Tutor' : 'Student'} Account`}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 mt-6">
          Already have an account? <Link to="/login" className="text-sky-600 font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}