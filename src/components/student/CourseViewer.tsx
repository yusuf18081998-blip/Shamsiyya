import React, { useState } from 'react';
import { Lesson, CourseModuleType } from '../../types';
import { InteractiveQuiz } from './InteractiveQuiz';
import { BookOpen, FileText, Headphones, Download, Volume2, CheckCircle, ChevronRight, Sparkles } from 'lucide-react';

interface Props {
  lessons: Lesson[];
  onQuizCompleted: (earnedPoints: number) => void;
}

export const CourseViewer: React.FC<Props> = ({ lessons, onQuizCompleted }) => {
  const [activeTab, setActiveTab] = useState<CourseModuleType>('manhaj_a0');
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(lessons[0]);
  const [activeSubTab, setActiveSubTab] = useState<'content' | 'quiz'>('content');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState<string | null>(null);

  const filteredLessons = lessons.filter((l) => l.module === activeTab);

  const handleDownloadResource = (resourceName: string) => {
    setDownloadMsg(`"${resourceName}" muvaffaqiyatli yuklab olindi!`);
    setTimeout(() => setDownloadMsg(null), 3000);
  };

  const handlePlayArabic = (arabicText: string) => {
    setIsPlayingAudio(true);
    // Simple Web Speech API or simulated speech for Arabic pronunciation
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(arabicText);
      utterance.lang = 'ar-SA';
      utterance.rate = 0.85;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsPlayingAudio(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {downloadMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{downloadMsg}</span>
        </div>
      )}

      {/* Module Navigation Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => {
              setActiveTab('manhaj_a0');
              const found = lessons.find((l) => l.module === 'manhaj_a0');
              if (found) setSelectedLesson(found);
              setActiveSubTab('content');
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'manhaj_a0'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Manhaj A0 (Harflar & Maxraj)
          </button>

          <button
            onClick={() => {
              setActiveTab('manhaj_a1');
              const found = lessons.find((l) => l.module === 'manhaj_a1');
              if (found) setSelectedLesson(found);
              setActiveSubTab('content');
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'manhaj_a1'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Manhaj A1 (So‘zlashuv & Nutq)
          </button>

          <button
            onClick={() => {
              setActiveTab('grammar');
              const found = lessons.find((l) => l.module === 'grammar');
              if (found) setSelectedLesson(found);
              setActiveSubTab('content');
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'grammar'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Grammatika Alohida Qo‘llanmasi
          </button>
        </div>

        <div className="text-xs text-rose-600 font-semibold flex items-center gap-1.5 bg-rose-50 px-3 py-1.5 rounded-xl border border-rose-100">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Kurs: GROW UP A1</span>
        </div>
      </div>

      {/* Main Study Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar Lesson List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-rose-100 shadow-xs overflow-hidden h-fit">
          <div className="p-4 border-b border-rose-100 bg-rose-50/40">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              {activeTab === 'manhaj_a0'
                ? 'Manhaj A0 Mavzulari'
                : activeTab === 'manhaj_a1'
                ? 'Manhaj A1 Mavzulari'
                : 'Grammatika Qo‘llanmasi'}
            </h4>
            <span className="text-[11px] text-slate-500">
              Qadam-baqadam o‘rganish tartibi
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {filteredLessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => {
                  setSelectedLesson(lesson);
                  setActiveSubTab('content');
                }}
                className={`w-full text-left p-4 transition-all flex items-start justify-between gap-2 cursor-pointer ${
                  selectedLesson.id === lesson.id
                    ? 'bg-rose-50/60 border-l-4 border-rose-600'
                    : 'hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-700 font-bold text-[10px] flex items-center justify-center">
                      {lesson.number}
                    </span>
                    <h5 className="font-bold text-slate-900 text-xs leading-tight">
                      {lesson.title}
                    </h5>
                  </div>
                  <p className="font-arabic text-sm text-rose-600 mt-1">
                    {lesson.arabicTitle}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    {lesson.duration} · {lesson.quiz.length} ta test savoli
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Selected Lesson Interactive Content (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Header of selected lesson */}
          <div className="bg-white rounded-2xl border border-rose-100 shadow-xs p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 pb-4">
              <div>
                <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                  {selectedLesson.number}-Mavzu · {selectedLesson.duration}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  {selectedLesson.title}
                </h3>
                <p className="font-arabic text-2xl text-rose-600 mt-1">
                  {selectedLesson.arabicTitle}
                </p>
              </div>

              {/* Sub-tab: Darslik vs Test */}
              <div className="flex items-center p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setActiveSubTab('content')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeSubTab === 'content'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Dars Matni
                </button>
                <button
                  onClick={() => setActiveSubTab('quiz')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeSubTab === 'quiz'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-rose-600'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Test Topshirish
                </button>
              </div>
            </div>

            {activeSubTab === 'content' ? (
              <div className="pt-6 space-y-6">
                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed italic bg-rose-50/30 p-3 rounded-xl border border-rose-100/60">
                  {selectedLesson.description}
                </p>

                {/* Theory & Explanation */}
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-rose-600" />
                    Nazariy Qoidalar & Qo‘llanma
                  </h4>
                  <div className="p-4 bg-slate-50/80 rounded-xl text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans border border-slate-200/60">
                    {selectedLesson.contentText}
                  </div>
                </div>

                {/* Arabic Examples with Audio Pronunciation */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                      Arabcha Namunalar & Talaffuz:
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Tinglash uchun ovoz tugmasini bosing
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedLesson.arabicExamples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-white rounded-xl border border-rose-100 shadow-2xs hover:border-rose-300 transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-arabic text-2xl text-rose-700 font-bold leading-normal">
                            {ex.arabic}
                          </p>
                          <button
                            onClick={() => handlePlayArabic(ex.arabic)}
                            title="Arabcha talaffuzni tinglash"
                            className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="mt-2 pt-2 border-t border-slate-100">
                          <p className="text-xs font-semibold text-slate-800">{ex.transcription}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{ex.translation}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Downloadable Resources */}
                <div>
                  <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-2">
                    Dars Fayllari & Resurslar:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedLesson.resources.map((res, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-2"
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          {res.type === 'pdf' ? (
                            <FileText className="w-5 h-5 text-rose-500 shrink-0" />
                          ) : (
                            <Headphones className="w-5 h-5 text-purple-500 shrink-0" />
                          )}
                          <div className="truncate">
                            <span className="text-xs font-semibold text-slate-800 block truncate">
                              {res.name}
                            </span>
                            <span className="text-[10px] text-slate-400">{res.size}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDownloadResource(res.name)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-lg border border-slate-200 text-xs font-medium transition-colors shrink-0 cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Yuklab olish</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Call to Action for Quiz */}
                <div className="p-4 bg-gradient-to-r from-rose-50 to-pink-50 rounded-xl border border-rose-200/80 flex items-center justify-between">
                  <div>
                    <h5 className="font-bold text-slate-900 text-xs">Mavzuni to‘liq o‘zlashtirdingizmi?</h5>
                    <p className="text-[11px] text-slate-500">
                      O‘z bilimingizni sinab ko‘ring va reytingingiz uchun qimmatli ballar to‘plang!
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveSubTab('quiz')}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
                  >
                    Testni Boshlash ({selectedLesson.quiz.length} savol)
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-6">
                <InteractiveQuiz
                  lesson={selectedLesson}
                  onQuizCompleted={onQuizCompleted}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
