import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReactPlayer from 'react-player';
import axios from 'axios';

export default function VideoPlayer() {
  const { courseId, lessonId } = useParams();
  const [course, setCourse]   = useState(null);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/courses/${courseId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => {
      setCourse(res.data);
      const lesson = res.data.lessons.find(l => l._id === lessonId) || res.data.lessons[0];
      setCurrent(lesson);
    });
  }, [courseId, lessonId]);

  if (!course || !current) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-72 bg-gray-900 overflow-y-auto border-r border-gray-800">
        <div className="p-4 border-b border-gray-800">
          <h2 className="font-semibold text-sm truncate">{course.title}</h2>
        </div>
        <ul>
          {course.lessons.map((lesson, i) => (
            <li key={lesson._id}>
              <button
                onClick={() => setCurrent(lesson)}
                className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-800 transition ${current._id === lesson._id ? 'bg-gray-800 text-purple-400' : 'text-gray-300'}`}
              >
                <span className="text-gray-500 mr-2">{i + 1}.</span>
                {lesson.title}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Player */}
      <div className="flex-1 flex flex-col">
        <div className="aspect-video bg-black">
          <ReactPlayer url={current.videoUrl} width="100%" height="100%" controls playing />
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{current.title}</h1>
          <p className="text-gray-400">{current.description}</p>
        </div>
      </div>
    </div>
  );
}