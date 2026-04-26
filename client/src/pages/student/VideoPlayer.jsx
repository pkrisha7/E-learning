import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import axios from 'axios';
import toast from 'react-hot-toast';

const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function VideoPlayer() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse]       = useState(null);
  const [current, setCurrent]     = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [completed, setCompleted] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    Promise.all([
      axios.get(`http://localhost:5000/api/courses/${courseId}`),
      axios.get('http://localhost:5000/api/courses/my-enrollments', authHeaders()),
    ]).then(([courseRes, enrollRes]) => {
      const c = courseRes.data;
      setCourse(c);
      const lesson = c.lessons.find(l => l._id === lessonId) || c.lessons[0];
      setCurrent(lesson);
      const enroll = enrollRes.data.find(e => e.course?._id === courseId || e.course === courseId);
      setEnrollment(enroll);
    });
  }, [courseId, lessonId]);

  useEffect(() => {
    if (enrollment && current) {
      const done = enrollment.progress?.find(p => p.lessonId === current._id && p.completed);
      setCompleted(!!done);
    }
  }, [enrollment, current]);

  const markComplete = async () => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/courses/${courseId}/progress/${current._id}`,
        {}, authHeaders()
      );
      setEnrollment(res.data);
      setCompleted(true);
      toast.success('Lesson marked complete! ✅');
    } catch {
      toast.error('Failed to mark complete');
    }
  };

  const goToLesson = (lesson) => {
    setCurrent(lesson);
    navigate(`/learn/${courseId}/lesson/${lesson._id}`);
  };

  const nextLesson = () => {
    const idx = course.lessons.findIndex(l => l._id === current._id);
    if (idx < course.lessons.length - 1) goToLesson(course.lessons[idx + 1]);
    else toast('You finished the course! 🎉');
  };

  const completedIds = new Set(enrollment?.progress?.filter(p => p.completed).map(p => p.lessonId) || []);
  const progress = course ? Math.round((completedIds.size / course.lessons.length) * 100) : 0;

  if (!course || !current) return (
    <div className="flex items-center justify-center h-screen bg-gray-950">
      <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"/>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-950 text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-900 flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-800">
          <Link to="/dashboard" className="text-purple-400 text-xs hover:underline">← Dashboard</Link>
          <h2 className="font-semibold text-sm mt-1 truncate">{course.title}</h2>
          {/* Progress bar */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Progress</span><span>{progress}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5">
              <div className="bg-purple-500 h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }}/>
            </div>
          </div>
        </div>

        <div className="overflow-y-auto flex-1">
          {course.lessons.map((lesson, i) => {
            const isDone    = completedIds.has(lesson._id);
            const isCurrent = current._id === lesson._id;
            return (
              <button key={lesson._id} onClick={() => goToLesson(lesson)}
                className={`w-full text-left px-4 py-3 text-sm transition flex items-start gap-3
                  ${isCurrent ? 'bg-purple-900/50 text-purple-300' : 'hover:bg-gray-800 text-gray-300'}`}>
                <span className={`mt-0.5 w-5 h-5 rounded-full flex items-center justify-center text-xs shrink-0 font-bold
                  ${isDone ? 'bg-green-500 text-white' : isCurrent ? 'bg-purple-500 text-white' : 'bg-gray-700 text-gray-400'}`}>
                  {isDone ? '✓' : i + 1}
                </span>
                <span className="truncate">{lesson.title}</span>
              </button>
            );
          })}
        </div>

        {/* Quiz button */}
        <div className="p-4 border-t border-gray-800">
          <button onClick={() => navigate(`/quiz/${courseId}`)}
            className="w-full bg-purple-600 text-white py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 transition">
            Take Quiz 📝
          </button>
        </div>
      </aside>

      {/* Main player */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Video */}
        <div className="bg-black aspect-video w-full">
          <ReactPlayer
            ref={playerRef}
            url={current.videoUrl}
            width="100%" height="100%"
            controls playing
            onEnded={markComplete}
          />
        </div>

        {/* Lesson info */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-950">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold mb-2">{current.title}</h1>
              {current.description && <p className="text-gray-400 text-sm">{current.description}</p>}
            </div>
            <div className="flex gap-3 shrink-0">
              {!completed ? (
                <button onClick={markComplete}
                  className="bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-700 transition">
                  ✓ Mark Complete
                </button>
              ) : (
                <span className="bg-green-900/50 text-green-400 px-4 py-2 rounded-xl text-sm font-semibold">
                  ✅ Completed
                </span>
              )}
              <button onClick={nextLesson}
                className="bg-purple-600 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-purple-700 transition">
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}