import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'Design', 'Business', 'Marketing', 'Photography'];
const LEVELS     = ['All', 'beginner', 'intermediate', 'advanced'];

export default function CourseList() {
  const [courses, setCourses]     = useState([]);
  const [search, setSearch]       = useState('');
  const [category, setCategory]   = useState('All');
  const [level, setLevel]         = useState('All');
  const [priceFilter, setPrice]   = useState('All');
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/courses')
      .then(res => setCourses(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = courses.filter(c => {
    const matchSearch   = c.title.toLowerCase().includes(search.toLowerCase()) ||
                          c.description.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || c.category === category;
    const matchLevel    = level === 'All'    || c.level === level;
    const matchPrice    = priceFilter === 'All' ||
                          (priceFilter === 'Free' && c.isFree) ||
                          (priceFilter === 'Paid' && !c.isFree);
    return matchSearch && matchCategory && matchLevel && matchPrice;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">L</div>
          <span className="text-xl font-bold text-gray-900">LearnHub</span>
        </Link>
        <div className="flex gap-3">
          <Link to="/login"    className="text-sm text-gray-600 hover:text-purple-600">Login</Link>
          <Link to="/register" className="text-sm bg-purple-600 text-white px-4 py-1.5 rounded-lg hover:bg-purple-700">Sign up</Link>
        </div>
      </nav>

      {/* Search Hero */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white py-14 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-3">Find your next course</h1>
          <p className="text-purple-200 mb-8">Learn from the best instructors in the world</p>
          <div className="relative">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search for anything..."
              className="w-full px-6 py-4 rounded-2xl text-gray-900 text-lg focus:outline-none shadow-xl"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {/* Category */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition border
                  ${category === cat ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8 items-center">
          {/* Level */}
          <select value={level} onChange={e => setLevel(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white">
            {LEVELS.map(l => <option key={l} value={l}>{l === 'All' ? 'All Levels' : l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
          </select>

          {/* Price */}
          <select value={priceFilter} onChange={e => setPrice(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white">
            <option value="All">All Prices</option>
            <option value="Free">Free</option>
            <option value="Paid">Paid</option>
          </select>

          <span className="text-sm text-gray-400 ml-auto">{filtered.length} course{filtered.length !== 1 ? 's' : ''} found</span>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="bg-gray-200 rounded-2xl h-64 animate-pulse"/>)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500 text-lg mb-2">No courses found</p>
            <p className="text-gray-400 text-sm">Try adjusting your search or filters</p>
            <button onClick={() => { setSearch(''); setCategory('All'); setLevel('All'); setPrice('All'); }}
              className="mt-4 text-purple-600 font-medium hover:underline text-sm">
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(course => (
              <Link key={course._id} to={`/courses/${course._id}`}
                className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition group">
                {course.thumbnail ? (
                  <img src={course.thumbnail} alt={course.title} className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"/>
                ) : (
                  <div className="w-full h-44 bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-5xl">📚</div>
                )}
                <div className="p-5">
                  <div className="flex gap-2 mb-2 flex-wrap">
                    <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">{course.category}</span>
                    <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full capitalize">{course.level}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-purple-700 transition">{course.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-3">{course.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <span className="text-xs text-gray-400">📚 {course.lessons?.length || 0} lessons</span>
                    <span className={`font-bold ${course.isFree ? 'text-green-600' : 'text-gray-900'}`}>
                      {course.isFree ? 'Free' : `$${course.price}`}
                    </span>
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