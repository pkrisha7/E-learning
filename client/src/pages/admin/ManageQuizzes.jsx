import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
const inp = 'w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400';
const emptyQ = { questionText: '', options: ['', '', '', ''], correctAnswer: 0, explanation: '' };

export default function ManageQuizzes() {
  const [courses, setCourses]     = useState([]);
  const [selected, setSelected]   = useState('');
  const [quiz, setQuiz]           = useState(null);
  const [questions, setQuestions] = useState([{ ...emptyQ, options: ['','','',''] }]);
  const [title, setTitle]         = useState('');
  const [passingScore, setPassingScore] = useState(60);

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/courses', authHeaders())
      .then(res => setCourses(res.data));
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
      } else {
        await axios.post('http://localhost:5000/api/quizzes', payload, authHeaders());
      }
      toast.success('Quiz saved!');
      loadQuiz(selected);
    } catch {
      toast.error('Failed to save quiz');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <Link to="/admin" className="text-xl font-bold text-purple-600">← Admin</Link>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Quizzes</h2>

        {/* Course selector */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Course</label>
          <select className={inp} value={selected} onChange={e => loadQuiz(e.target.value)}>
            <option value="">-- Pick a course --</option>
            {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
          </select>
        </div>

        {selected && (
          <div className="space-y-5">
            {/* Quiz settings */}
            <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
              <h3 className="font-semibold text-gray-800">Quiz Settings</h3>
              <input className={inp} placeholder="Quiz title *" value={title} onChange={e => setTitle(e.target.value)}/>
              <div className="flex items-center gap-3">
                <label className="text-sm text-gray-600 whitespace-nowrap">Passing score %</label>
                <input type="number" className={inp} value={passingScore} onChange={e => setPassingScore(+e.target.value)}/>
              </div>
            </div>

            {/* Questions */}
            {questions.map((q, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700">Question {i + 1}</span>
                  {questions.length > 1 && (
                    <button onClick={() => removeQuestion(i)} className="text-xs text-red-400 hover:text-red-600">Remove</button>
                  )}
                </div>
                <input className={inp} placeholder="Question text *" value={q.questionText} onChange={e => updateQ(i, 'questionText', e.target.value)}/>
                <div className="space-y-2">
                  {q.options.map((opt, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <input type="radio" name={`correct-${i}`} checked={q.correctAnswer === j}
                        onChange={() => updateQ(i, 'correctAnswer', j)} className="accent-purple-600"/>
                      <input className={inp} placeholder={`Option ${j + 1}`} value={opt}
                        onChange={e => updateOption(i, j, e.target.value)}/>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-400">Select the radio button next to the correct answer</p>
                <input className={inp} placeholder="Explanation (optional)" value={q.explanation}
                  onChange={e => updateQ(i, 'explanation', e.target.value)}/>
              </div>
            ))}

            <button onClick={addQuestion}
              className="w-full border-2 border-dashed border-purple-200 text-purple-500 py-3 rounded-2xl hover:bg-purple-50 transition text-sm font-medium">
              + Add Question
            </button>

            <button onClick={save}
              className="w-full bg-purple-600 text-white py-3 rounded-2xl font-semibold hover:bg-purple-700 transition">
              {quiz ? 'Update Quiz' : 'Create Quiz'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}