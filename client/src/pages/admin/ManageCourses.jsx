import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
const empty = { title: '', description: '', category: '', level: 'beginner', price: 0, isFree: false, thumbnail: '', isPublished: false };

export default function ManageCourses() {
  const [courses, setCourses]       = useState([]);
  const [showForm, setShowForm]     = useState(false);
  const [form, setForm]             = useState(empty);
  const [editing, setEditing]       = useState(null);
  const [addingLesson, setAddingLesson] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    title: '', videoUrl: '', description: '', freePreview: false
  });

  const load = () =>
    axios.get('http://localhost:5000/api/admin/courses', authHeaders())
      .then(res => setCourses(res.data));

  useEffect(() => { load(); }, []);

  const submit = async () => {
    if (!form.title || !form.description || !form.category) {
      toast.error('Please fill title, description and category'); return;
    }
    try {
      if (editing) {
        await axios.put(`http://localhost:5000/api/courses/${editing}`, form, authHeaders());
        toast.success('Course updated ✅');
      } else {
        await axios.post('http://localhost:5000/api/courses', form, authHeaders());
        toast.success('Course created ✅');
      }
      setForm(empty); setEditing(null); setShowForm(false); load();
    } catch (e) { toast.error(e.response?.data?.message || 'Error saving course'); }
  };

  const togglePublish = async (id) => {
    await axios.put(`http://localhost:5000/api/admin/courses/${id}/toggle`, {}, authHeaders());
    toast.success('Visibility updated'); load();
  };

  const deleteCourse = async (id) => {
    if (!confirm('Delete this course? This cannot be undone.')) return;
    await axios.delete(`http://localhost:5000/api/admin/courses/${id}`, authHeaders());
    toast.success('Course deleted'); load();
  };

  const addLesson = async (courseId) => {
    if (!lessonForm.title || !lessonForm.videoUrl) {
      toast.error('Lesson title and video URL are required'); return;
    }
    try {
      const course  = courses.find(c => c._id === courseId);
      const updated = { ...course, lessons: [...(course.lessons || []), lessonForm] };
      await axios.put(`http://localhost:5000/api/courses/${courseId}`, updated, authHeaders());
      toast.success('Lesson added ✅');
      setAddingLesson(null);
      setLessonForm({ title: '', videoUrl: '', description: '', freePreview: false });
      load();
    } catch { toast.error('Failed to add lesson'); }
  };

  const deleteLesson = async (courseId, lessonIndex) => {
    if (!confirm('Delete this lesson?')) return;
    const course  = courses.find(c => c._id === courseId);
    const lessons = course.lessons.filter((_, i) => i !== lessonIndex);
    await axios.put(`http://localhost:5000/api/courses/${courseId}`, { ...course, lessons }, authHeaders());
    toast.success('Lesson deleted'); load();
  };

  // Extract YouTube video ID from any YouTube URL format
  const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const inp = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white';

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <Link to="/admin" className="text-xl font-bold text-purple-600">← Admin</Link>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm(empty); }}
          className="bg-purple-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 transition"
        >
          + New Course
        </button>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Courses <span className="text-gray-400 font-normal text-lg">({courses.length})</span>
        </h2>

        {/* Course Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-5">{editing ? 'Edit Course' : 'Create New Course'}</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Title *</label>
                  <input className={inp} placeholder="e.g. Complete React Developer Course"
                    value={form.title} onChange={e => setForm({...form, title: e.target.value})}/>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Description *</label>
                  <textarea className={inp} rows={3} placeholder="What will students learn?"
                    value={form.description} onChange={e => setForm({...form, description: e.target.value})}/>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Category *</label>
                  <input className={inp} placeholder="e.g. Web Development, Data Science, Design"
                    value={form.category} onChange={e => setForm({...form, category: e.target.value})}/>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Level</label>
                  <select className={inp} value={form.level}
                    onChange={e => setForm({...form, level: e.target.value})}>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Thumbnail URL</label>
                  <input className={inp} placeholder="https://example.com/image.jpg"
                    value={form.thumbnail} onChange={e => setForm({...form, thumbnail: e.target.value})}/>
                  {form.thumbnail && (
                    <img src={form.thumbnail} alt="preview"
                      className="mt-2 w-full h-32 object-cover rounded-xl"/>
                  )}
                </div>
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Price (USD)</label>
                    <input className={inp} type="number" min="0" placeholder="0"
                      value={form.price}
                      onChange={e => setForm({...form, price: +e.target.value})}
                      disabled={form.isFree}/>
                  </div>
                  <label className="flex items-center gap-2 text-sm text-gray-600 pb-2.5 whitespace-nowrap cursor-pointer">
                    <input type="checkbox" className="accent-purple-600" checked={form.isFree}
                      onChange={e => setForm({...form, isFree: e.target.checked, price: e.target.checked ? 0 : form.price})}/>
                    Free course
                  </label>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" className="accent-purple-600" checked={form.isPublished}
                    onChange={e => setForm({...form, isPublished: e.target.checked})}/>
                  Publish immediately (visible to students)
                </label>
              </div>
              <div className="flex gap-3 mt-6">
                <button onClick={submit}
                  className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition">
                  {editing ? 'Update Course' : 'Create Course'}
                </button>
                <button onClick={() => { setShowForm(false); setEditing(null); }}
                  className="flex-1 border border-gray-200 py-2.5 rounded-xl hover:bg-gray-50 transition text-gray-600">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Lesson Modal */}
        {addingLesson && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-5">Add Lesson</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Lesson Title *</label>
                  <input className={inp} placeholder="e.g. Introduction to React Hooks"
                    value={lessonForm.title}
                    onChange={e => setLessonForm({...lessonForm, title: e.target.value})}/>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">YouTube URL *</label>
                  <input className={inp}
                    placeholder="https://www.youtube.com/watch?v=xxxxxxxx"
                    value={lessonForm.videoUrl}
                    onChange={e => setLessonForm({...lessonForm, videoUrl: e.target.value})}/>
                  <p className="text-xs text-gray-400 mt-1">
                    ✅ Supported: youtube.com/watch?v=... or youtu.be/...
                  </p>
                </div>

                {/* Live YouTube preview */}
                {lessonForm.videoUrl && getYouTubeId(lessonForm.videoUrl) && (
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Preview</label>
                    <div className="rounded-xl overflow-hidden bg-black" style={{aspectRatio:'16/9'}}>
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

                {lessonForm.videoUrl && !getYouTubeId(lessonForm.videoUrl) && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-3">
                    <p className="text-xs text-red-500">
                      ❌ Invalid YouTube URL. Please use format:<br/>
                      https://www.youtube.com/watch?v=VIDEO_ID
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Description (optional)</label>
                  <textarea className={inp} rows={2}
                    placeholder="What will students learn in this lesson?"
                    value={lessonForm.description}
                    onChange={e => setLessonForm({...lessonForm, description: e.target.value})}/>
                </div>

                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input type="checkbox" className="accent-purple-600"
                    checked={lessonForm.freePreview}
                    onChange={e => setLessonForm({...lessonForm, freePreview: e.target.checked})}/>
                  Free preview (students can watch without enrolling)
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button onClick={() => addLesson(addingLesson)}
                  className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition">
                  Add Lesson
                </button>
                <button onClick={() => {
                  setAddingLesson(null);
                  setLessonForm({ title: '', videoUrl: '', description: '', freePreview: false });
                }} className="flex-1 border border-gray-200 py-2.5 rounded-xl hover:bg-gray-50 transition text-gray-600">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Courses List */}
        <div className="space-y-4">
          {courses.length === 0 && (
            <div className="text-center py-24 bg-white rounded-2xl shadow-sm">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-lg text-gray-500 mb-1">No courses yet</p>
              <p className="text-sm text-gray-400 mb-6">Click "+ New Course" to create your first one</p>
              <button onClick={() => setShowForm(true)}
                className="bg-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition">
                + New Course
              </button>
            </div>
          )}

          {courses.map(course => (
            <div key={course._id} className="bg-white rounded-2xl shadow-sm overflow-hidden">

              {/* Course header */}
              <div className="p-5 flex flex-col md:flex-row items-start gap-4">

                {/* Left — thumbnail + info */}
                <div className="flex gap-4 items-start flex-1 min-w-0">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title}
                      className="w-20 h-14 rounded-xl object-cover shrink-0"/>
                  ) : (
                    <div className="w-20 h-14 rounded-xl bg-purple-100 flex items-center justify-center text-3xl shrink-0">📚</div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg truncate">{course.title}</h3>
                    <p className="text-sm text-gray-400 mt-0.5">
                      {course.category} · <span className="capitalize">{course.level}</span> · {course.lessons?.length || 0} lessons
                    </p>
                    <p className="text-sm text-gray-400">
                      By {course.instructor?.name} ·{' '}
                      <span className={course.isFree ? 'text-green-600 font-medium' : 'font-medium'}>
                        {course.isFree ? 'Free' : `$${course.price}`}
                      </span>
                    </p>
                    <span className={`inline-block mt-1 text-xs px-3 py-0.5 rounded-full font-medium
                      ${course.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {course.isPublished ? '● Published' : '○ Draft'}
                    </span>
                  </div>
                </div>

                {/* Right — action buttons stacked vertically */}
                <div className="flex flex-row md:flex-col gap-2 flex-wrap shrink-0">
                  <button onClick={() => togglePublish(course._id)}
                    className="text-xs px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-600 font-medium">
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
                  }} className="text-xs px-4 py-2 border border-blue-200 text-blue-600 rounded-xl hover:bg-blue-50 transition font-medium">
                    ✏️ Edit
                  </button>
                  <button onClick={() => {
                    setAddingLesson(course._id);
                    setLessonForm({ title: '', videoUrl: '', description: '', freePreview: false });
                  }} className="text-xs px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition font-medium">
                    + Add Lesson
                  </button>
                  <button onClick={() => deleteCourse(course._id)}
                    className="text-xs px-4 py-2 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition font-medium">
                    🗑️ Delete
                  </button>
                </div>
              </div>

              {/* Lessons list */}
              {course.lessons?.length > 0 && (
                <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                    Lessons ({course.lessons.length})
                  </p>
                  <div className="space-y-2">
                    {course.lessons.map((lesson, i) => (
                      <div key={i}
                        className="flex items-center gap-3 bg-white rounded-xl px-4 py-3 border border-gray-100">
                        <span className="w-7 h-7 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold shrink-0">
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{lesson.title}</p>
                          {lesson.videoUrl && (
                            <p className="text-xs text-purple-400 truncate mt-0.5">
                              🎬 {lesson.videoUrl}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {lesson.freePreview && (
                            <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">
                              Free
                            </span>
                          )}
                          {getYouTubeId(lesson.videoUrl) && (
                            <span className="text-xs bg-red-100 text-red-500 px-2 py-0.5 rounded-full">
                              ▶ YouTube
                            </span>
                          )}
                          <button onClick={() => deleteLesson(course._id, i)}
                            className="text-xs text-red-400 hover:text-red-600 transition ml-1 font-bold">
                            ✕
                          </button>
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