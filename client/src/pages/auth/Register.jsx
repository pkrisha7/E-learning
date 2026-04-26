import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { register as registerUser } from '../../api/authApi';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';
import { useState } from 'react';

export default function Register() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { loginUser } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('student');

  const onSubmit = async (data) => {
    try {
      const res = await registerUser({ ...data, role });
      loginUser(res.data.token, res.data.user);
      toast.success('Account created!');
      if (res.data.user.role === 'instructor') navigate('/tutor');
      else navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create account</h1>
        <p className="text-gray-500 mb-6">Join LearnHub today — it's free</p>

        {/* Role selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button type="button" onClick={() => setRole('student')}
            className={`p-4 rounded-2xl border-2 text-center transition ${role === 'student' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}>
            <div className="text-3xl mb-1">🎓</div>
            <div className="font-semibold text-gray-900 text-sm">Student</div>
            <div className="text-xs text-gray-400 mt-0.5">I want to learn</div>
          </button>
          <button type="button" onClick={() => setRole('instructor')}
            className={`p-4 rounded-2xl border-2 text-center transition ${role === 'instructor' ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}>
            <div className="text-3xl mb-1">👨‍🏫</div>
            <div className="font-semibold text-gray-900 text-sm">Tutor</div>
            <div className="text-xs text-gray-400 mt-0.5">I want to teach</div>
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
            <input
              {...register('name', { required: 'Name required' })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="John Doe"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email"
              {...register('email', { required: 'Email required' })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="you@email.com"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input type="password"
              {...register('password', { required: 'Password required', minLength: { value: 6, message: 'Min 6 characters' } })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="••••••••"
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={isSubmitting}
            className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50">
            {isSubmitting ? 'Creating...' : `Create ${role === 'instructor' ? 'Tutor' : 'Student'} Account`}
          </button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account? <Link to="/login" className="text-purple-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}