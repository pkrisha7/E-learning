import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 mb-8">You're now enrolled. Start learning right away!</p>
        <div className="flex gap-3 justify-center">
          <Link to="/dashboard" className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition">
            Go to Dashboard
          </Link>
          <Link to="/courses" className="border border-gray-200 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition">
            Browse More
          </Link>
        </div>
      </div>
    </div>
  );
}