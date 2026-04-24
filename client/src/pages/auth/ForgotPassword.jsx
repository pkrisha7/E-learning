import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/authApi';
import toast from 'react-hot-toast';

export default function ForgotPassword() {
  const [email, setEmail]   = useState('');
  const [sent, setSent]     = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email) { toast.error('Enter your email'); return; }
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSent(true);
      toast.success('Reset email sent!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        {sent ? (
          <div className="text-center">
            <div className="text-5xl mb-4">📧</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-500 mb-6">We sent a reset link to <strong>{email}</strong></p>
            <Link to="/login" className="text-purple-600 font-medium hover:underline">Back to login</Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Forgot password?</h1>
            <p className="text-gray-500 mb-8">Enter your email and we'll send a reset link</p>
            <div className="space-y-4">
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button onClick={submit} disabled={loading}
                className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 transition disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </div>
            <p className="text-center text-sm text-gray-500 mt-6">
              <Link to="/login" className="text-purple-600 font-medium hover:underline">Back to login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}