import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
const empty = { title: '', description: '', category: '', level: 'beginner', price: 0, isFree: false, thumbnail: '', isPublished: false };

export default function ManageCourses() {
  const [courses, setCourses]   = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(empty);
  const [editing, setEditing]   = useState(null);
  const [lessonForm, setLessonForm] = useState({ title: '', videoUrl: '', description: '', freePreview: false });
  const [addingLesson, setAddingLesson] = useState(null);

  const load = () =>
    axios.get('http://localhost:5000/api/admin/courses', authHeaders())
      .then(res => setCourses(res.data));

  useEffect(() => { load(); }, []);

  const submit = async () => {
    try {
      if (editing) {
        await axios.put(`http://localhost:5000/api/courses/${editing}`, form, authHeaders());
        toast.success('Course updated');
      } else {
        await axios.post('http://localhost:5000/api/courses', form, authHeaders());
        toast.success('Course created');
      }
      setForm(empty); setEditing(null); setShowForm(false); load();
    } catch (e) { toast.error(e.response?.data?.message || 'Error'); }
  };

  const togglePublish = async (id) => {
    await axios.put(`http://localhost:5000/api/admin/courses/${id}/toggle`, {}, authHeaders());
    toast.success('Visibility updated'); load();
  };

  const deleteCourse = async (id) => {
    if (!confirm('Delete this course?')) return;
    await axios.delete(`http://localhost:5000/api/admin/courses/${id}`, authHeaders());
    toast.success('Deleted'); load();
  };

  const addLesson = async (courseId) => {
    try {
      const course = courses.find(c => c._id === courseId);
      const updated = { ...course, lessons: [...(course.lessons || []), lessonForm] };
      await axios.put(`http://localhost:5000/api/courses/${courseId}`, updated, authHeaders());
      toast.success('Lesson added');
      setAddingLesson(null);
      setLessonForm({ title: '', videoUrl: '', description: '', freePreview: false });
      load();
    } catch (e) { toast.error('Failed to add lesson'); }
  };

  const inp = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400';

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <Link to="/admin" className="text-xl font-bold text-purple-600">← Admin</Link>
        <button
          onClick={() => { setShowForm(true); setEditing(null); setForm(empty); }}
          className="bg-purple-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 transition"
        >
          + New Course
        </button>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Courses ({courses.length})</h2>

        {/* Course Form Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold mb-4">{editing ? 'Edit Course' : 'New Course'}</h3>
              <div className="space-y-3">
                <input
                  className={inp} placeholder="Course title *"
                  value={form.title} onChange={e => setForm({...form, title: e.target.value})}
                />
                <textarea
                  className={inp} rows={3} placeholder="Description *"
                  value={form.description} onChange={e => setForm({...form, description: e.target.value})}
                />
                <input
                  className={inp} placeholder="Category (e.g. Web Development)"
                  value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                />
                <select
                  className={inp} value={form.level}
                  onChange={e => setForm({...form, level: e.target.value})}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
                <input
                  className={inp} placeholder="Thumbnail URL (paste any image link)"
                  value={form.thumbnail} onChange={e => setForm({...form, thumbnail: e.target.value})}
                />
                <div className="flex gap-4 items-center">
                  <input
                    className={`${inp} flex-1`} type="number" placeholder="Price (USD)"
                    value={form.price} onChange={e => setForm({...form, price: +e.target.value})}
                  />
                  <label className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
                    <input type="checkbox" checked={form.isFree}
                      onChange={e => setForm({...form, isFree: e.target.checked})}
                    /> Free course
                  </label>
                </div>
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={form.isPublished}
                    onChange={e => setForm({...form, isPublished: e.target.checked})}
                  /> Publish immediately
                </label>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={submit}
                  className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition">
                  {editing ? 'Update' : 'Create'}
                </button>
                <button onClick={() => { setShowForm(false); setEditing(null); }}
                  className="flex-1 border border-gray-200 py-2.5 rounded-xl hover:bg-gray-50 transition">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Lesson Modal */}
        {addingLesson && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-xl font-bold mb-4">Add Lesson</h3>
              <div className="space-y-3">
                <input
                  className={inp} placeholder="Lesson title *"
                  value={lessonForm.title} onChange={e => setLessonForm({...lessonForm, title: e.target.value})}
                />
                <input
                  className={inp} placeholder="Video URL (YouTube / direct mp4 link)"
                  value={lessonForm.videoUrl} onChange={e => setLessonForm({...lessonForm, videoUrl: e.target.value})}
                />
                <textarea
                  className={inp} rows={2} placeholder="Description (optional)"
                  value={lessonForm.description} onChange={e => setLessonForm({...lessonForm, description: e.target.value})}
                />
                <label className="flex items-center gap-2 text-sm text-gray-600">
                  <input type="checkbox" checked={lessonForm.freePreview}
                    onChange={e => setLessonForm({...lessonForm, freePreview: e.target.checked})}
                  /> Free preview (visible without enrollment)
                </label>
              </div>
              <div className="flex gap-3 mt-5">
                <button onClick={() => addLesson(addingLesson)}
                  className="flex-1 bg-purple-600 text-white py-2.5 rounded-xl font-semibold hover:bg-purple-700 transition">
                  Add Lesson
                </button>
                <button onClick={() => setAddingLesson(null)}
                  className="flex-1 border border-gray-200 py-2.5 rounded-xl hover:bg-gray-50 transition">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Courses List */}
        <div className="space-y-4">
          {courses.length === 0 && (
            <div className="text-center py-24 text-gray-400">
              <div className="text-5xl mb-4">📚</div>
              <p className="text-lg mb-2">No courses yet</p>
              <p className="text-sm">Click "+ New Course" to create your first one</p>
            </div>
          )}
          {courses.map(course => (
            <div key={course._id} className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex gap-4 items-start">
                  {course.thumbnail
                    ? <img src={course.thumbnail} className="w-16 h-12 rounded-lg object-cover"/>
                    : <div className="w-16 h-12 rounded-lg bg-purple-100 flex items-center justify-center text-2xl">📚</div>
                  }
                  <div>
                    <h3 className="font-semibold text-gray-900">{course.title}</h3>
                    <p className="text-sm text-gray-400 mt-0.5">{course.category} · {course.level} · {course.lessons?.length || 0} lessons</p>
                    <p className="text-sm text-gray-400">By {course.instructor?.name} · {course.isFree ? 'Free' : `$${course.price}`}</p>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${course.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {course.isPublished ? '● Published' : '○ Draft'}
                  </span>
                  <button onClick={() => togglePublish(course._id)}
                    className="text-xs px-3 py-1 border border-gray-200 rounded-full hover:bg-gray-50 transition">
                    {course.isPublished ? 'Unpublish' : 'Publish'}
                  </button>
                  <button onClick={() => {
                    setEditing(course._id);
                    setForm({ title: course.title, description: course.description, category: course.category, level: course.level, price: course.price, isFree: course.isFree, thumbnail: course.thumbnail || '', isPublished: course.isPublished });
                    setShowForm(true);
                  }} className="text-xs px-3 py-1 border border-blue-200 text-blue-600 rounded-full hover:bg-blue-50 transition">
                    Edit
                  </button>
                  <button onClick={() => setAddingLesson(course._id)}
                    className="text-xs px-3 py-1 border border-purple-200 text-purple-600 rounded-full hover:bg-purple-50 transition">
                    + Lesson
                  </button>
                  <button onClick={() => deleteCourse(course._id)}
                    className="text-xs px-3 py-1 border border-red-200 text-red-500 rounded-full hover:bg-red-50 transition">
                    Delete
                  </button>
                </div>
              </div>

              {/* Lessons list */}
              {course.lessons?.length > 0 && (
                <div className="mt-4 border-t border-gray-50 pt-4">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">Lessons</p>
                  <div className="space-y-1">
                    {course.lessons.map((l, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="text-gray-300 w-5">{i + 1}.</span>
                        <span className="flex-1">{l.title}</span>
                        {l.freePreview && (
                          <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">Free</span>
                        )}
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