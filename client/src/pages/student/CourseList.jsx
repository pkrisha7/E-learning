import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/courses')
      .then(res => setCourses(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(c =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">LearnHub</h1>
        <div className="flex gap-4">
          <Link to="/login"    className="text-sm text-gray-600 hover:text-primary">Login</Link>
          <Link to="/register" className="text-sm bg-primary text-white px-4 py-1.5 rounded-lg hover:bg-primary-dark">Sign up</Link>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-4xl font-bold text-gray-900 mb-2">All Courses</h2>
        <p className="text-gray-500 mb-8">Expand your skills with expert-led courses</p>

        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="w-full max-w-md border border-gray-200 rounded-xl px-4 py-3 mb-8 focus:outline-none focus:ring-2 focus:ring-primary"
        />

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="bg-gray-200 rounded-2xl h-64 animate-pulse"/>)}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-gray-400 text-center py-20 text-lg">No courses found</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(course => (
              <Link key={course._id} to={`/courses/${course._id}`} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition group">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover group-hover:scale-105 transition"/>
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                    <span className="text-4xl">📚</span>
                  </div>
                )}
                <div className="p-5">
                  <span className="text-xs font-medium text-primary bg-indigo-50 px-2 py-1 rounded-full">{course.category}</span>
                  <h3 className="font-semibold text-gray-900 mt-2 mb-1">{course.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{course.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">{course.lessons?.length || 0} lessons</span>
                    <span className="font-bold text-gray-900">{course.isFree ? 'Free' : `$${course.price}`}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}