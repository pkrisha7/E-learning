import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Logo from '../../components/Logo';
import { useAuth } from '../../context/AuthContext';

import SettingsDropdown from '../../components/SettingsDropdown';

const CATEGORIES = ['All', 'Web Development', 'Data Science', 'Design', 'Business', 'Marketing', 'Photography'];
const LEVELS     = ['All', 'beginner', 'intermediate', 'advanced'];

export default function CourseList() {
  const { user }                  = useAuth();
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
    <div className="min-h-screen page-theme-bg text-slate-900">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <Logo size="md" />

        <div className="flex items-center gap-4">
          {user ? (
            <SettingsDropdown />
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors px-2">Login</Link>
              <Link to="/register" className="text-sm bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-4 py-2 rounded-xl font-bold hover:shadow-md hover:shadow-sky-500/20 transition-all">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Search Hero */}
      <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-3 tracking-tight">Find Your Next Skill</h1>
          <p className="text-sky-200/80 text-base md:text-lg mb-8">Discover top-rated online courses led by industry experts</p>

          <div className="relative">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search courses, topics, or keywords..."
              className="w-full px-6 py-4 pr-12 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-base font-medium focus:outline-none focus:ring-4 focus:ring-sky-500/40 shadow-xl border border-slate-200"
            />
            <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-xl pointer-events-none">🔍</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Category Pills */}
        <div className="flex flex-wrap gap-2.5 mb-6">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                category === cat
                  ? 'bg-gradient-to-r from-sky-500 to-cyan-500 text-white shadow-sm shadow-sky-500/25'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-300 hover:text-sky-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Level and Price Filters */}
        <div className="flex flex-wrap gap-3 mb-8 items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-wrap gap-3 items-center">
            <select
              value={level}
              onChange={e => setLevel(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
            >
              {LEVELS.map(l => <option key={l} value={l}>{l === 'All' ? 'All Skill Levels' : l.charAt(0).toUpperCase() + l.slice(1)}</option>)}
            </select>

            <select
              value={priceFilter}
              onChange={e => setPrice(e.target.value)}
              className="border border-slate-200 rounded-xl px-4 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50"
            >
              <option value="All">All Prices</option>
              <option value="Free">Free Courses</option>
              <option value="Paid">Premium Courses</option>
            </select>
          </div>

          <span className="text-xs font-bold text-slate-400">{filtered.length} course{filtered.length !== 1 ? 's' : ''} available</span>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="bg-slate-200 rounded-2xl h-64 animate-pulse"/>)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-slate-800 text-xl font-bold mb-2">No matching courses found</p>
            <p className="text-slate-500 text-sm mb-4">Try searching with a different term or resetting filters</p>
            <button
              onClick={() => { setSearch(''); setCategory('All'); setLevel('All'); setPrice('All'); }}
              className="text-sky-600 font-bold hover:underline text-sm"
            >
              Clear all search filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(course => (
              <Link
                key={course._id}
                to={`/courses/${course._id}`}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"/>
                  ) : (
                    <div className="w-full h-44 bg-gradient-to-tr from-sky-100 to-cyan-100 flex items-center justify-center text-5xl">📚</div>
                  )}

                  <div className="p-5">
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <span className="text-[11px] font-bold text-sky-700 bg-sky-50 border border-sky-100 px-2.5 py-0.5 rounded-full">{course.category}</span>
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full capitalize">{course.level}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base mb-2 line-clamp-2 group-hover:text-sky-600 transition-colors leading-snug">{course.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">{course.description}</p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">📖 {course.lessons?.length || 0} Lessons</span>
                  <span className={`text-base font-extrabold ${course.isFree ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {course.isFree ? 'Free' : `Rs. ${course.price.toLocaleString('en-IN')}`}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}