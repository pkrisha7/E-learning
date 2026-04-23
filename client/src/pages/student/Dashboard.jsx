import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/courses/my-enrollments', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setEnrollments(res.data))
      .catch(() => setEnrollments([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">LearnHub</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hi, {user?.name}</span>
          <Link to="/courses" className="text-sm text-primary font-medium hover:underline">Browse Courses</Link>
          <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-red-500 transition">Logout</button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">My Learning</h2>
        <p className="text-gray-500 mb-8">Continue where you left off</p>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="bg-gray-200 rounded-2xl h-48 animate-pulse"/>)}
          </div>
        ) : enrollments.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg mb-4">You haven't enrolled in any courses yet</p>
            <Link to="/courses" className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrollments.map(({ course }) => (
              <div key={course._id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">
                {course.thumbnail && (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-36 object-cover"/>
                )}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 mb-1 truncate">{course.title}</h3>
                  <p className="text-sm text-gray-500 mb-4">{course.lessons?.length || 0} lessons</p>
                  <Link
                    to={`/learn/${course._id}/lesson/${course.lessons?.[0]?._id}`}
                    className="block text-center bg-primary text-white py-2 rounded-xl text-sm font-semibold hover:bg-primary-dark transition"
                  >
                    Continue
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}