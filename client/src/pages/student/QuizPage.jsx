import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import Logo from '../../components/Logo';

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
      toast.error('Please answer all questions before submitting'); return;
    }
    let correct = 0;
    quiz.questions.forEach((q, i) => {
      if (parseInt(answers[i]) === q.correctAnswer) correct++;
    });
    const score  = Math.round((correct / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;
    setResult({ score, correct, total: quiz.questions.length, passed });
    setSubmitted(true);
    if (passed) toast.success('You passed! 🎉 Great job!');
    else toast.error('Keep practicing! You can try again 💪');
  };

  const retry = () => {
    setAnswers({});
    setResult(null);
    setSubmitted(false);
  };

  // Loading State
  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"/>
        <p className="text-slate-400 font-medium text-sm">Preparing your quiz...</p>
      </div>
    </div>
  );

  // No quiz found
  if (notFound) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-10 max-w-md w-full text-center">
        <div className="text-6xl mb-4">📝</div>
        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">No Quiz Available</h2>
        <p className="text-slate-500 text-sm mb-6">The instructor has not added a quiz for this course yet.</p>
        <button
          onClick={() => navigate(-1)}
          className="bg-gradient-to-r from-sky-500 to-cyan-500 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:shadow-lg transition-all"
        >
          ← Return to Course
        </button>
      </div>
    </div>
  );

  // Result screen
  if (submitted && result) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 md:p-10 max-w-lg w-full text-center">
        <div className={`text-6xl font-black mb-3 ${result.passed ? 'text-emerald-500' : 'text-rose-500'}`}>
          {result.score}%
        </div>
        <div className="text-5xl mb-4">{result.passed ? '🎉' : '💪'}</div>

        <h2 className="text-2xl font-extrabold text-slate-900 mb-2">
          {result.passed ? 'Assessment Passed!' : 'Requires Improvement'}
        </h2>
        <p className="text-slate-600 text-sm mb-2">
          You scored <strong>{result.correct}</strong> out of <strong>{result.total}</strong> questions correctly.
        </p>
        <p className="text-xs font-semibold text-slate-400 mb-8">
          Required Passing Score: {quiz.passingScore}%
        </p>

        {/* Answer review */}
        <div className="text-left space-y-3 mb-8 max-h-60 overflow-y-auto pr-1">
          {quiz.questions.map((q, i) => {
            const isCorrect = parseInt(answers[i]) === q.correctAnswer;
            return (
              <div key={i} className={`p-4 rounded-2xl border text-xs ${isCorrect ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' : 'bg-rose-50/70 border-rose-200 text-rose-900'}`}>
                <p className="font-bold text-slate-900 mb-1">{i + 1}. {q.questionText}</p>
                <p className={`font-semibold ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {isCorrect ? '✓ Correct' : `✗ Wrong — Correct Answer: ${q.options[q.correctAnswer]}`}
                </p>
                {!isCorrect && q.explanation && (
                  <p className="text-slate-500 mt-1 font-normal">💡 {q.explanation}</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={retry}
            className="px-6 py-3 border border-slate-200 rounded-2xl font-bold text-xs text-slate-700 hover:bg-slate-50 transition-all"
          >
            Retry Quiz
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 text-white rounded-2xl font-bold text-xs hover:shadow-lg transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );

  // Quiz active form
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Top Navigation */}
      <div className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-sky-600 font-bold hover:underline text-xs">← Exit Quiz</button>
          <Logo size="sm" showText={false} />
        </div>
        <h1 className="font-extrabold text-slate-900 text-base truncate max-w-xs">{quiz.title}</h1>
        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
          {Object.keys(answers).length} / {quiz.questions.length} Answered
        </span>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Metric Header Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs mb-6 flex gap-6 text-center">
          <div className="flex-1">
            <div className="text-2xl font-extrabold text-sky-600">{quiz.questions.length}</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">Questions</div>
          </div>
          <div className="flex-1 border-x border-slate-100">
            <div className="text-2xl font-extrabold text-amber-500">{quiz.passingScore}%</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">Passing Score</div>
          </div>
          <div className="flex-1">
            <div className="text-2xl font-extrabold text-cyan-600">{quiz.timeLimit || 30}m</div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">Estimated Time</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-sky-500 to-cyan-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(Object.keys(answers).length / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {quiz.questions.map((q, i) => (
            <div
              key={i}
              className={`bg-white rounded-3xl p-6 border-2 transition-all shadow-xs ${
                answers[i] !== undefined ? 'border-sky-300' : 'border-slate-200/80'
              }`}
            >
              <p className="font-bold text-slate-900 text-base mb-4 leading-snug">
                <span className="text-sky-500 mr-2">{i + 1}.</span>
                {q.questionText}
              </p>

              <div className="space-y-2.5">
                {q.options.map((opt, j) => (
                  <label
                    key={j}
                    className={`flex items-center gap-3.5 p-4 rounded-2xl cursor-pointer border text-sm font-medium transition-all ${
                      answers[i] == j
                        ? 'border-sky-500 bg-sky-50/70 text-slate-900 shadow-xs'
                        : 'border-slate-200/80 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q${i}`}
                      value={j}
                      checked={answers[i] == j}
                      onChange={() => setAnswers(a => ({ ...a, [i]: j }))}
                      className="w-4 h-4 accent-sky-600"
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="mt-8 sticky bottom-6">
          <button
            onClick={submit}
            disabled={Object.keys(answers).length < quiz.questions.length}
            className="w-full bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-600 text-white py-4 rounded-2xl font-bold text-base hover:shadow-xl hover:shadow-sky-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit Quiz ({Object.keys(answers).length}/{quiz.questions.length} Answered)
          </button>
        </div>
      </div>
    </div>
  );
}