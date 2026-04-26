import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const authHeaders = () => ({ headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });

export default function QuizPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz]           = useState(null);
  const [answers, setAnswers]     = useState({});
  const [result, setResult]       = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading]     = useState(true);
  const [notFound, setNotFound]   = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/quizzes/course/${courseId}`, authHeaders())
      .then(res => setQuiz(res.data))
      .catch(err => {
        if (err.response?.status === 404) setNotFound(true);
        else toast.error('Failed to load quiz');
      })
      .finally(() => setLoading(false));
  }, [courseId]);

  const submit = () => {
    if (Object.keys(answers).length < quiz.questions.length) {
      toast.error('Please answer all questions'); return;
    }
    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (parseInt(answers[i]) === q.correctAnswer) correct++;
    });
    const score  = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;
    setResult({ score, correct, total: quiz.questions.length, passed });
    setSubmitted(true);
    if (passed) toast.success('You passed! 🎉');
    else toast.error('Keep trying! You can do it 💪');
  };

  const retry = () => {
    setAnswers({});
    setResult(null);
    setSubmitted(false);
  };

  // Loading
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
        <p className="text-gray-400">Loading quiz...</p>
      </div>
    </div>
  );

  // No quiz found
  if (notFound) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Quiz Yet</h2>
        <p className="text-gray-400 mb-6">The instructor hasn't added a quiz for this course yet.</p>
        <button onClick={() => navigate(-1)}
          className="bg-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-purple-700 transition">
          ← Go Back
        </button>
      </div>
    </div>
  );

  // Result screen
  if (submitted && result) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        <div className={`text-7xl font-bold mb-4 ${result.passed ? 'text-green-500' : 'text-red-500'}`}>
          {result.score}%
        </div>
        <div className="text-5xl mb-4">{result.passed ? '🎉' : '😔'}</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {result.passed ? 'Congratulations!' : 'Not quite there yet'}
        </h2>
        <p className="text-gray-500 mb-2">
          You got <strong>{result.correct}</strong> out of <strong>{result.total}</strong> correct
        </p>
        <p className="text-gray-400 text-sm mb-8">
          Passing score: {quiz.passingScore}% · Your score: {result.score}%
        </p>

        {/* Answer review */}
        <div className="text-left space-y-3 mb-8">
          {quiz.questions.map((q, i) => {
            const isCorrect = parseInt(answers[i]) === q.correctAnswer;
            return (
              <div key={i} className={`p-4 rounded-xl border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className="text-sm font-medium text-gray-800 mb-1">{i + 1}. {q.questionText}</p>
                <p className={`text-xs ${isCorrect ? 'text-green-600' : 'text-red-500'}`}>
                  {isCorrect ? '✓ Correct' : `✗ Wrong — correct: ${q.options[q.correctAnswer]}`}
                </p>
                {!isCorrect && q.explanation && (
                  <p className="text-xs text-gray-500 mt-1">💡 {q.explanation}</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 justify-center">
          <button onClick={retry}
            className="px-6 py-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition">
            Retry Quiz
          </button>
          <button onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition">
            Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  // Quiz questions
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="text-purple-600 hover:underline text-sm">← Back</button>
        <h1 className="font-bold text-gray-900">{quiz.title}</h1>
        <span className="text-sm text-gray-400">{Object.keys(answers).length}/{quiz.questions.length} answered</span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Quiz info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mb-6 flex gap-6 text-center">
          <div className="flex-1">
            <div className="text-2xl font-bold text-purple-600">{quiz.questions.length}</div>
            <div className="text-xs text-gray-400 mt-1">Questions</div>
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-amber-500">{quiz.passingScore}%</div>
            <div className="text-xs text-gray-400 mt-1">To pass</div>
          </div>
          <div className="flex-1">
            <div className="text-2xl font-bold text-blue-500">{quiz.timeLimit || 30}</div>
            <div className="text-xs text-gray-400 mt-1">Minutes</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full transition-all"
              style={{ width: `${(Object.keys(answers).length / quiz.questions.length) * 100}%` }}/>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-5">
          {quiz.questions.map((q, i) => (
            <div key={i} className={`bg-white rounded-2xl p-6 shadow-sm border-2 transition
              ${answers[i] !== undefined ? 'border-purple-200' : 'border-transparent'}`}>
              <p className="font-semibold text-gray-900 mb-4">
                <span className="text-purple-500 mr-2">{i + 1}.</span>
                {q.questionText}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, j) => (
                  <label key={j}
                    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition
                      ${answers[i] == j ? 'border-purple-400 bg-purple-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                    <input type="radio" name={`q${i}`} value={j}
                      checked={answers[i] == j}
                      onChange={() => setAnswers(a => ({ ...a, [i]: j }))}
                      className="accent-purple-600"/>
                    <span className="text-sm text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="mt-8 sticky bottom-4">
          <button onClick={submit}
            disabled={Object.keys(answers).length < quiz.questions.length}
            className="w-full bg-purple-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-purple-700 transition disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-purple-200">
            Submit Quiz ({Object.keys(answers).length}/{quiz.questions.length} answered)
          </button>
        </div>
      </div>
    </div>
  );
}