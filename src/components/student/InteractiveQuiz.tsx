import React, { useState } from 'react';
import { Lesson, QuizQuestion } from '../../types';
import { HelpCircle, CheckCircle2, XCircle, Award, RotateCcw } from 'lucide-react';

interface Props {
  lesson: Lesson;
  onQuizCompleted: (earnedPoints: number) => void;
}

export const InteractiveQuiz: React.FC<Props> = ({ lesson, onQuizCompleted }) => {
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [earnedPoints, setEarnedPoints] = useState(0);

  const questions = lesson.quiz;
  const maxPoints = questions.reduce((sum, q) => sum + q.points, 0);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (submitted) return;
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let total = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        total += q.points;
      }
    });
    setEarnedPoints(total);
    setSubmitted(true);
    onQuizCompleted(total);
  };

  const handleReset = () => {
    setUserAnswers({});
    setSubmitted(false);
    setEarnedPoints(0);
  };

  const allAnswered = questions.every((q) => userAnswers[q.id] !== undefined);

  return (
    <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6 space-y-6">
      {/* Quiz Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-rose-100 pb-4">
        <div>
          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
            {lesson.number}-Dars Nazorat Testi
          </span>
          <h4 className="text-base font-bold text-slate-900 mt-1">
            Mavzuni Mustahkamlash: {lesson.title}
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            Jami savollar: <strong className="text-slate-900">{questions.length} ta</strong>
          </span>
          <span className="text-slate-300">·</span>
          <span className="text-xs text-slate-500">
            Maksimal ball: <strong className="text-rose-600">{maxPoints} ball</strong>
          </span>
        </div>
      </div>

      {/* Result summary banner when submitted */}
      {submitted && (
        <div className="p-5 bg-gradient-to-r from-rose-500 to-pink-600 rounded-2xl text-white shadow-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Award className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h5 className="font-bold text-base">Test Yakunlandi!</h5>
              <p className="text-xs text-rose-100">
                Siz {maxPoints} balldan <strong className="text-amber-300 text-sm">{earnedPoints} ball</strong> to‘pladingiz. Ball profilingizga qo‘shildi!
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white text-rose-600 font-semibold text-xs rounded-xl hover:bg-rose-50 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Qayta ishlash
          </button>
        </div>
      )}

      {/* Questions list */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {questions.map((q, idx) => {
          const selectedOption = userAnswers[q.id];
          const isCorrect = selectedOption === q.correctIndex;

          return (
            <div
              key={q.id}
              className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="font-bold text-slate-900 text-sm leading-snug">
                  {idx + 1}. {q.question}
                </span>
                <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-100 shrink-0">
                  +{q.points} ball
                </span>
              </div>

              {q.arabicSnippet && (
                <div className="p-3 bg-white rounded-xl border border-rose-100 text-right">
                  <p className="font-arabic text-xl text-rose-700 font-bold">{q.arabicSnippet}</p>
                </div>
              )}

              {/* Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {q.options.map((opt, optIdx) => {
                  let optionStyle = 'border-slate-200 hover:border-rose-300 bg-white text-slate-700';

                  if (selectedOption === optIdx) {
                    optionStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-semibold ring-1 ring-rose-400';
                  }

                  if (submitted) {
                    if (optIdx === q.correctIndex) {
                      optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-400';
                    } else if (selectedOption === optIdx && !isCorrect) {
                      optionStyle = 'border-rose-500 bg-rose-100 text-rose-900 line-through';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      disabled={submitted}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      className={`w-full text-left p-3 rounded-xl border text-xs flex items-center justify-between transition-all cursor-pointer ${optionStyle}`}
                    >
                      <span>{opt}</span>
                      {submitted && optIdx === q.correctIndex && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      )}
                      {submitted && selectedOption === optIdx && !isCorrect && (
                        <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation after submit */}
              {submitted && (
                <div className="mt-2 p-3 bg-white rounded-xl border border-slate-200 text-xs text-slate-600 flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800">Izoh: </span>
                    {q.explanation}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {!submitted && (
          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-500">
              {Object.keys(userAnswers).length} / {questions.length} ta savolga javob berildi
            </span>
            <button
              type="submit"
              disabled={!allAnswered}
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              Testni Yakunlash & Ballni Olish
            </button>
          </div>
        )}
      </form>
    </div>
  );
};
