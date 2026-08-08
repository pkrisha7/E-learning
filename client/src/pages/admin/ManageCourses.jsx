import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Logo from '../../components/Logo';
import { useAuth } from '../../context/AuthContext';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
const empty = { title: '', description: '', category: 'Web Development', level: 'beginner', price: 0, isFree: false, thumbnail: '', isPublished: true };

export default function ManageCourses() {
  const { user }                    = useAuth();
  const [courses, setCourses]       = useState([]);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(empty);
  const [editing, setEditing]       = useState(null);
  const [addingLesson, setAddingLesson] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    title: '', videoUrl: '', description: '', freePreview: false
  });

  const load = () =>
    axios.get(`${API}/admin/courses`, authHeaders())
      .then(res => setCourses(res.data));

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.title || !form.description || !form.category) {
      toast.error('Please fill title, description and category'); return;
    }
    try {
      if (editing) {
        await axios.put(`${API}/courses/${editing}`, form, authHeaders());
        toast.success('Course updated ✅');
      } else {
        await axios.post(`${API}/courses`, form, authHeaders());
        toast.success('Course created ✅');
      }
      setForm(empty); setEditing(null); setShowForm(false); load();
    } catch (e) { toast.error(e.response?.data?.message || 'Error saving course'); }
  };

  const togglePublish = async (id) => {
    await axios.put(`${API}/admin/courses/${id}/toggle`, {}, authHeaders());
    toast.success('Course visibility toggled'); load();
  };

  const deleteCourse = async (id) => {
    if (!confirm('Delete this course? This cannot be undone.')) return;
    await axios.delete(`${API}/admin/courses/${id}`, authHeaders());
    toast.success('Course deleted'); load();
  };

  const addLesson = async (courseId) => {
    if (!lessonForm.title || !lessonForm.videoUrl) {
      toast.error('Lesson title and Video URL required'); return;
    }
    try {
      const course  = courses.find(c => c._id === courseId);
      const lessons = [...(course.lessons || []), lessonForm];
      await axios.put(`${API}/courses/${courseId}`, { ...course, lessons }, authHeaders());
      toast.success('Lesson added! ✅');
      setAddingLesson(null);
      setLessonForm({ title: '', videoUrl: '', description: '', freePreview: false });
      load();
    } catch { toast.error('Failed to add lesson'); }
  };

  const deleteLesson = async (courseId, lessonIndex) => {
    if (!confirm('Delete this lesson?')) return;
    const course  = courses.find(c => c._id === courseId);
    const lessons = course.lessons.filter((_, i) => i !== lessonIndex);
    await axios.put(`${API}/courses/${courseId}`, { ...course, lessons }, authHeaders());
    toast.success('Lesson deleted'); load();
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const inp = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50 focus:bg-white transition-all';

  return (
    <div className="min-h-screen page-theme-bg text-slate-900">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Logo size="md" />
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">/ Course Management</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to={user?.role === 'instructor' ? '/tutor' : '/admin'} className="text-xs font-bold text-slate-600 hover:text-sky-600 transition-colors">
            ← {user?.role === 'instructor' ? 'Instructor Portal' : 'Admin Console'}
          </Link>
          <button
            onClick={() => { setShowForm(true); setEditing(null); setForm(empty); }}
            className="bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:shadow-md hover:shadow-sky-500/20 transition-all"
          >
            + Create New Course
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900">
            {user?.role === 'instructor' ? 'My Authored Courses' : 'Platform Courses'} <span className="text-slate-400 font-bold text-lg">({courses.length})</span>
          </h2>
        </div>

        {/* Course Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 md:p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-extrabold text-slate-900 mb-5">{editing ? 'Edit Course' : 'Create New Course'}</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Course Title *</label>
                  <input className={inp} placeholder="e.g. Complete Web Development Bootcamp"
                    value={form.title} onChange={e => setForm({...form, title: e.target.value})}/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Description *</label>
                  <textarea className={inp} rows={3} placeholder="Comprehensive description of course outcome..."
                    value={form.description} onChange={e => setForm({...form, description: e.target.value})}/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Category *</label>
                  <input className={inp} placeholder="e.g. Web Development, Data Science, Design"
                    value={form.category} onChange={e => setForm({...form, category: e.target.value})}/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Target Level</label>
                  <select className={inp} value={form.level}
                    onChange={e => setForm({...form, level: e.target.value})}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Thumbnail Image URL</label>
                  <input className={inp} placeholder="https://images.unsplash.com/photo-..."
                    value={form.thumbnail} onChange={e => setForm({...form, thumbnail: e.target.value})}/>
                  {form.thumbnail && (
                    <img src={form.thumbnail} alt="preview" className="mt-2 w-full h-32 object-cover rounded-2xl border border-slate-200"/>
                  )}
                </div>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Price (Rs. Rupees)</label>
                    <input className={inp} type="number" min="0" placeholder="0"
                      value={form.price}
                      onChange={e => setForm({...form, price: +e.target.value})}
                      disabled={form.isFree}/>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-bold text-slate-700 pb-3 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 accent-sky-600" checked={form.isFree}
                      onChange={e => setForm({...form, isFree: e.target.checked, price: e.target.checked ? 0 : form.price})}/>
                    Free Course
                  </label>
                </div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-sky-600" checked={form.isPublished}
                    onChange={e => setForm({...form, isPublished: e.target.checked})}/>
                  Publish Immediately
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={submit}
                  className="flex-1 bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 text-white py-3 rounded-2xl font-bold text-xs hover:shadow-lg transition-all">
                  {editing ? 'Update Course' : 'Create Course'}
                </button>
                <button onClick={() => { setShowForm(false); setEditing(null); }}
                  className="flex-1 border border-slate-200 py-3 rounded-2xl font-bold text-xs hover:bg-slate-50 transition text-slate-600">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Lesson Modal */}
        {addingLesson && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 md:p-8 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-extrabold text-slate-900 mb-5">Add Video Lesson</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Lesson Title *</label>
                  <input className={inp} placeholder="e.g. 1.1 Introduction to Components"
                    value={lessonForm.title}
                    onChange={e => setLessonForm({...lessonForm, title: e.target.value})}/>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">YouTube Video URL *</label>
                  <input className={inp}
                    placeholder="https://www.youtube.com/watch?v=xxxxxxxx"
                    value={lessonForm.videoUrl}
                    onChange={e => setLessonForm({...lessonForm, videoUrl: e.target.value})}/>
                </div>

                {lessonForm.videoUrl && getYouTubeId(lessonForm.videoUrl) && (
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 block uppercase">Video Preview</label>
                    <div className="rounded-2xl overflow-hidden bg-black shadow-xs" style={{aspectRatio:'16/9'}}>
                      <iframe
                        width="100%" height="100%"
                        src={`https://www.youtube.com/embed/${getYouTubeId(lessonForm.videoUrl)}`}
                        title="YouTube preview"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 block">Description (Optional)</label>
                  <textarea className={inp} rows={2}
                    placeholder="Lesson notes or key concepts covered..."
                    value={lessonForm.description}
                    onChange={e => setLessonForm({...lessonForm, description: e.target.value})}/>
                </div>

                <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-sky-600"
                    checked={lessonForm.freePreview}
                    onChange={e => setLessonForm({...lessonForm, freePreview: e.target.checked})}/>
                  Enable Free Preview
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => addLesson(addingLesson)}
                  className="flex-1 bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 text-white py-3 rounded-2xl font-bold text-xs hover:shadow-lg transition-all">
                  Add Lesson
                </button>
                <button onClick={() => {
                  setAddingLesson(null);
                  setLessonForm({ title: '', videoUrl: '', description: '', freePreview: false });
                }} className="flex-1 border border-slate-200 py-3 rounded-2xl font-bold text-xs hover:bg-slate-50 transition text-slate-600">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Courses List */}
        <div className="space-y-4">
          {courses.length === 0 && (
            <div className="text-center py-24 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-slate-800 font-bold text-lg mb-1">No courses created yet</p>
              <p className="text-slate-400 text-xs mb-6">Click "+ Create New Course" to add your first course</p>
              <button onClick={() => setShowForm(true)}
                className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-6 py-3 rounded-2xl font-bold text-xs hover:shadow-lg transition-all">
                + Create New Course
              </button>
            </div>
          )}

          {courses.map(course => (
            <div key={course._id} className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
              <div className="p-6 flex flex-col md:flex-row items-start gap-4">
                <div className="flex gap-4 items-start flex-1 min-w-0">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-24 h-16 rounded-2xl object-cover shrink-0 border border-slate-100"/>
                  ) : (
                    <div className="w-24 h-16 rounded-2xl bg-gradient-to-tr from-sky-100 to-cyan-100 flex items-center justify-center text-3xl shrink-0">📚</div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-extrabold text-slate-900 text-lg truncate">{course.title}</h3>
                    <p className="text-xs font-semibold text-slate-400 mt-1">
                      {course.category} · <span className="capitalize">{course.level}</span> · {course.lessons?.length || 0} lessons
                    </p>
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      By {course.instructor?.name} ·{' '}
                      <span className={course.isFree ? 'text-emerald-600 font-bold' : 'font-bold text-slate-900'}>
                        {course.isFree ? 'Free' : `Rs. ${course.price.toLocaleString('en-IN')}`}
                      </span>
                    </p>
                    <span className={`inline-block mt-2 text-[11px] px-3 py-0.5 rounded-full font-extrabold ${
                      course.isPublished ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}>
                      {course.isPublished ? '● Published' : '○ Draft'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2 flex-wrap shrink-0">
                  <button onClick={() => togglePublish(course._id)}
                    className="text-xs px-3.5 py-1.5 border border-slate-200 rounded-xl hover:bg-slate-50 transition text-slate-700 font-bold">
                    {course.isPublished ? '⏸ Unpublish' : '▶ Publish'}
                  </button>
                  <button onClick={() => {
                    setEditing(course._id);
                    setForm({
                      title: course.title, description: course.description,
                      category: course.category, level: course.level,
                      price: course.price, isFree: course.isFree,
                      thumbnail: course.thumbnail || '', isPublished: course.isPublished
                    });
                    setShowForm(true);
                  }} className="text-xs px-3.5 py-1.5 border border-sky-200 text-sky-600 rounded-xl hover:bg-sky-50 transition font-bold">
                    ✏️ Edit
                  </button>
                  <button onClick={() => {
                    setAddingLesson(course._id);
                    setLessonForm({ title: '', videoUrl: '', description: '', freePreview: false });
                  }} className="text-xs px-3.5 py-1.5 bg-gradient-to-r from-sky-500 to-cyan-500 text-white rounded-xl hover:shadow-md transition font-bold">
                    + Add Lesson
                  </button>
                  <Link to={`/admin/quizzes?courseId=${course._id}`} className="text-xs px-3.5 py-1.5 border border-indigo-200 text-indigo-600 rounded-xl hover:bg-indigo-50 transition font-bold text-center">
                    📝 Manage Quiz
                  </Link>
                  <button onClick={() => deleteCourse(course._id)}
                    className="text-xs px-3.5 py-1.5 border border-rose-200 text-rose-500 rounded-xl hover:bg-rose-50 transition font-bold">
                    🗑️ Delete
                  </button>
                </div>
              </div>

              {course.lessons?.length > 0 && (
                <div className="border-t border-slate-100 px-6 py-4 bg-slate-50/60">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
                    Course Lessons ({course.lessons.length})
                  </p>
                  <div className="space-y-2">
                    {course.lessons.map((lesson, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white rounded-2xl px-4 py-3 border border-slate-200/60 shadow-2xs">
                        <span className="w-6 h-6 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-xs font-bold shrink-0">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate">{lesson.title}</p>
                          {lesson.videoUrl && (
                            <p className="text-[11px] text-sky-500 truncate mt-0.5">🎬 {lesson.videoUrl}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {lesson.freePreview && (
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">Free Preview</span>
                          )}
                          <button onClick={() => deleteLesson(course._id, i)}
                            className="text-xs text-rose-400 hover:text-rose-600 transition font-bold ml-1">✕</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}