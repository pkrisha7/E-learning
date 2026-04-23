import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function QuizPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz]         = useState(null);
  const [answers, setAnswers]   = useState({});
  const [result, setResult]     = useState(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/quizzes/course/${courseId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    }).then(res => setQuiz(res.data));
  }, [courseId]);

  const submit = () => {
    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (parseInt(answers[i]) === q.correctAnswer) correct++;
    });
    const score = Math.round((correct / quiz.questions.length) * 100);
    setResult({ score, correct, total: quiz.questions.length, passed: score >= quiz.passingScore });
    setSubmitted(true);
  };

  if (!quiz) return <div className="flex items-center justify-center h-screen">Loading quiz...</div>;

  if (submitted && result) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <div className={`text-6xl font-bold mb-4 ${result.passed ? 'text-green-500' : 'text-red-500'}`}>{result.score}%</div>
        <h2 className="text-2xl font-bold mb-2">{result.passed ? 'Passed! 🎉' : 'Try again'}</h2>
        <p className="text-gray-500 mb-6">{result.correct} of {result.total} correct. Passing score: {quiz.passingScore}%</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => { setSubmitted(false); setAnswers({}); setResult(null); }}
            className="px-6 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition">Retry</button>
          <button onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-primary text-white rounded-xl hover:bg-primary-dark transition">Dashboard</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{quiz.title}</h1>
        <p className="text-gray-500 mb-8">{quiz.questions.length} questions · {quiz.timeLimit} min · Pass at {quiz.passingScore}%</p>
        <div className="space-y-6">
          {quiz.questions.map((q, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="font-semibold mb-4">{i + 1}. {q.questionText}</p>
              <div className="space-y-2">
                {q.options.map((opt, j) => (
                  <label key={j} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition ${answers[i] == j ? 'border-primary bg-indigo-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <input type="radio" name={`q${i}`} value={j} checked={answers[i] == j} onChange={() => setAnswers(a => ({ ...a, [i]: j }))} className="accent-primary" />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={submit}
          disabled={Object.keys(answers).length < quiz.questions.length}
          className="mt-8 w-full bg-primary text-white py-4 rounded-2xl font-semibold text-lg hover:bg-primary-dark transition disabled:opacity-40"
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );
}