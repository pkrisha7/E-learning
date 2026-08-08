import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../../api/authApi';
import toast from 'react-hot-toast';
import Logo from '../../components/Logo';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    if (!email) { toast.error('Enter your email'); return; }
    setLoading(true);
    try {
      await forgotPassword({ email });
      setSent(true);
      toast.success('Reset email sent!');
    } catch (e) {
      toast.error(e.response?.data?.message || 'Failed to send reset link');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50/50 to-indigo-50/40 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-8 md:p-10 w-full max-w-md relative z-10">
        <div className="mb-6 text-center">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
        </div>

        {sent ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-sky-200">
              ✉️
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">Check your email</h2>
            <p className="text-slate-500 text-sm mb-6 leading-relaxed">
              We sent a password reset link to <strong className="text-slate-800">{email}</strong>
            </p>
            <Link to="/login" className="text-sky-600 font-bold text-sm hover:underline">
              Back to login
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <h1 className="text-2xl font-extrabold text-slate-900">Forgot Password?</h1>
              <p className="text-slate-500 text-sm mt-1">Enter your registered email to receive a reset link</p>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all bg-slate-50/50 focus:bg-white"
                />
              </div>

              <button
                onClick={submit}
                disabled={loading}
                className="w-full bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-sky-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50"
              >
                {loading ? 'Sending Link...' : 'Send Reset Link'}
              </button>
            </div>

            <p className="text-center text-xs text-slate-500 mt-6">
              Remember your password? <Link to="/login" className="text-sky-600 font-bold hover:underline">Sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}