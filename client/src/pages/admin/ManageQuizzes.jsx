import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Logo from '../../components/Logo';

import { useAuth } from '../../context/AuthContext';

const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
const inp = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-slate-50/50 focus:bg-white transition-all';
const emptyQ = { questionText: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' };

export default function ManageQuizzes() {
  const { user }                  = useAuth();
  const [courses, setCourses]     = useState([]);
  const [selected, setSelected]   = useState('');
  const [quiz, setQuiz]           = useState(null);
  const [questions, setQuestions] = useState([{ ...emptyQ, options: ['','','',''] }]);
  const [title, setTitle]         = useState('');
  const [passingScore, setPassingScore] = useState(60);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/courses', authHeaders())
      .then(res => {
        setCourses(res.data);
        const searchParams = new URLSearchParams(window.location.search);
        const preselect = searchParams.get('courseId');
        if (preselect && res.data.some(c => c._id === preselect)) {
          loadQuiz(preselect);
        } else if (res.data.length > 0) {
          loadQuiz(res.data[0]._id);
        }
      });
  }, []);

  const loadQuiz = async (courseId) => {
    setSelected(courseId);
    try {
      const res = await axios.get(`http://localhost:5000/api/quizzes/course/${courseId}`, authHeaders());
      setQuiz(res.data);
      setTitle(res.data.title);
      setPassingScore(res.data.passingScore);
      setQuestions(res.data.questions);
    } catch {
      setQuiz(null);
      setTitle('');
      setPassingScore(60);
      setQuestions([{ ...emptyQ, options: ['','','',''] }]);
    }
  };

  const addQuestion    = () => setQuestions([...questions, { ...emptyQ, options: ['','','',''] }]);
  const removeQuestion = (i) => setQuestions(questions.filter((_, idx) => idx !== i));
  const updateQ        = (i, field, val) => setQuestions(questions.map((q, idx) => idx === i ? { ...q, [field]: val } : q));
  const updateOption   = (qi, oi, val)   => setQuestions(questions.map((q, idx) => idx === qi ? { ...q, options: q.options.map((o, j) => j === oi ? val : o) } : q));

  const save = async () => {
    if (!title) { toast.error('Add a quiz title'); return; }
    try {
      const payload = { course: selected, title, passingScore, questions };
      if (quiz) {
        await axios.put(`http://localhost:5000/api/quizzes/${quiz._id}`, payload, authHeaders());
        toast.success('Quiz updated! ✅');
      } else {
        await axios.post('http://localhost:5000/api/quizzes', payload, authHeaders());
        toast.success('Quiz created! ✅');
      }
      loadQuiz(selected);
    } catch {
      toast.error('Failed to save quiz');
    }
  };

  return (
    <div className="min-h-screen page-theme-bg text-slate-900">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Logo size="md" />
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">/ Quiz Builder</span>
        </div>
        <Link to={user?.role === 'instructor' ? '/tutor' : '/admin'} className="text-xs font-bold text-slate-600 hover:text-sky-600 transition-colors">
          ← {user?.role === 'instructor' ? 'Instructor Portal' : 'Back to Admin'}
        </Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-6">Manage Course Quizzes</h2>

        {/* Course selector */}
        <div className="mb-6 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select Target Course</label>
          <select className={inp} value={selected} onChange={e => loadQuiz(e.target.value)}>
            <option value="">-- Choose a course to build or edit quiz --</option>
            {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
          </select>
        </div>

        {selected && (
          <div className="space-y-6">
            {/* Quiz settings */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
              <h3 className="font-extrabold text-slate-900 text-base">Quiz Configuration</h3>
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Quiz Title *</label>
                <input className={inp} placeholder="e.g. Final React & Redux Assessment" value={title} onChange={e => setTitle(e.target.value)}/>
              </div>

              <div className="flex items-center gap-4">
                <label className="text-xs font-bold text-slate-600 uppercase whitespace-nowrap">Passing Score (%)</label>
                <input type="number" className={inp} value={passingScore} onChange={e => setPassingScore(+e.target.value)}/>
              </div>
            </div>

            {/* Questions */}
            {questions.map((q, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-slate-900 text-sm">Question {i + 1}</span>
                  {questions.length > 1 && (
                    <button onClick={() => removeQuestion(i)} className="text-xs font-bold text-rose-500 hover:text-rose-600">
                      Remove Question
                    </button>
                  )}
                </div>

                <input className={inp} placeholder="Question prompt / statement *" value={q.questionText} onChange={e => updateQ(i, 'questionText', e.target.value)}/>

                <div className="space-y-2.5">
                  {q.options.map((opt, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <input
                        type="radio"
                        name={`correct-${i}`}
                        checked={q.correctAnswer === j}
                        onChange={() => updateQ(i, 'correctAnswer', j)}
                        className="w-4 h-4 accent-sky-600"
                      />
                      <input className={inp} placeholder={`Option ${j + 1}`} value={opt} onChange={e => updateOption(i, j, e.target.value)}/>
                    </div>
                  ))}
                </div>

                <p className="text-[11px] font-semibold text-slate-400">Select the radio button beside the correct answer</p>
                <input className={inp} placeholder="Explanation for correct answer (optional)" value={q.explanation} onChange={e => updateQ(i, 'explanation', e.target.value)}/>
              </div>
            ))}

            <button
              onClick={addQuestion}
              className="w-full border-2 border-dashed border-sky-200 hover:border-sky-400 text-sky-600 py-3.5 rounded-2xl hover:bg-sky-50/50 transition-all text-xs font-bold"
            >
              + Add Question
            </button>

            <button
              onClick={save}
              className="w-full bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 text-white py-4 rounded-2xl font-bold text-sm hover:shadow-lg hover:shadow-sky-500/25 transition-all"
            >
              {quiz ? 'Update Quiz' : 'Save & Publish Quiz'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}