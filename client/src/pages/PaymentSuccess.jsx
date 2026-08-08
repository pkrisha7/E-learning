import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '../components/Logo';

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const [done, setDone] = useState(false);
  const courseId = params.get('courseId');

  useEffect(() => {
    if (courseId) {
      axios.post('http://localhost:5000/api/payments/success',
        { courseId },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      ).then(() => setDone(true)).catch(() => setDone(true));
    }
  }, [courseId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-cyan-50/50 to-indigo-50/40 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl border border-slate-200/80 shadow-2xl p-10 max-w-md w-full text-center relative z-10">
        <div className="flex justify-center mb-6">
          <Logo size="lg" />
        </div>

        <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-4 border border-emerald-200 shadow-xs">
          🎉
        </div>

        <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Payment Successful!</h1>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Your enrollment is confirmed. You now have full lifetime access to this course!
        </p>

        <div className="flex flex-col gap-3">
          <Link
            to="/dashboard"
            className="w-full bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 text-white py-3.5 rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-sky-500/25 transition-all"
          >
            Go to My Dashboard →
          </Link>
          <Link
            to="/courses"
            className="w-full bg-slate-100 hover:bg-slate-200/80 text-slate-700 py-3.5 rounded-2xl font-bold text-sm transition-all"
          >
            Browse More Courses
          </Link>
        </div>
      </div>
    </div>
  );
}