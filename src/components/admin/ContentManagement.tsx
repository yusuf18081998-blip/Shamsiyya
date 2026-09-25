import React, { useState } from 'react';
import { Lesson, CourseModuleType } from '../../types';
import { BookOpen, PlusCircle, FileText, Headphones, HelpCircle, Check, ChevronRight } from 'lucide-react';

interface Props {
  lessons: Lesson[];
  onAddLesson: (lesson: Omit<Lesson, 'id'>) => void;
  onUpdateLesson: (lesson: Lesson) => void;
}

export const ContentManagement: React.FC<Props> = ({ lessons, onAddLesson }) => {
  const [activeTab, setActiveTab] = useState<CourseModuleType>('manhaj_a0');
  const [selectedLesson, setSelectedLesson] = useState<Lesson>(lessons[0]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newArabicTitle, setNewArabicTitle] = useState('');
  const [newDuration, setNewDuration] = useState('45 daqiqa');
  const [newDesc, setNewDesc] = useState('');
  const [newContent, setNewContent] = useState('');

  const filteredLessons = lessons.filter((l) => l.module === activeTab);

  const handleCreateLesson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newNumber = filteredLessons.length + 1;
    onAddLesson({
      module: activeTab,
      number: newNumber,
      title: newTitle,
      arabicTitle: newArabicTitle || 'دَرْسٌ جَدِيدٌ',
      duration: newDuration,
      description: newDesc,
      contentText: newContent,
      arabicExamples: [
        {
          arabic: 'مِثَالٌ تَوْضِيحِيٌّ',
          transcription: 'Misaalun tavziyhiy',
          translation: 'Mavzuga oid namuna',
        },
      ],
      resources: [
        {
          name: `${activeTab.toUpperCase()}_Dars${newNumber}_Qo‘llanma.pdf`,
          type: 'pdf',
          size: '2.1 MB',
        },
      ],
      quiz: [
        {
          id: `q-custom-${Date.now()}`,
          question: `${newTitle} bo‘yicha nazorat savoli:`,
          options: ['To‘g‘ri javob', 'Noto‘g‘ri javob 1', 'Noto‘g‘ri javob 2'],
          correctIndex: 0,
          explanation: 'Dars materialida bayon qilingan qoidaga asosan.',
          points: 10,
        },
      ],
    });

    setNewTitle('');
    setNewArabicTitle('');
    setNewDesc('');
    setNewContent('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Module Selector Segmented Control */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-rose-100 shadow-xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => {
              setActiveTab('manhaj_a0');
              const found = lessons.find((l) => l.module === 'manhaj_a0');
              if (found) setSelectedLesson(found);
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'manhaj_a0'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            1. Manhaj A0 (Harflar & Maxraj)
          </button>
          <button
            onClick={() => {
              setActiveTab('manhaj_a1');
              const found = lessons.find((l) => l.module === 'manhaj_a1');
              if (found) setSelectedLesson(found);
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'manhaj_a1'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            2. Manhaj A1 (So‘zlashuv & Matn)
          </button>
          <button
            onClick={() => {
              setActiveTab('grammar');
              const found = lessons.find((l) => l.module === 'grammar');
              if (found) setSelectedLesson(found);
            }}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              activeTab === 'grammar'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3. Grammatika Qo‘llanmasi
          </button>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          Yangi Dars Yuklash
        </button>
      </div>

      {/* Grid: Lesson List and Active Lesson Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lesson List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-rose-100 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-rose-100 bg-rose-50/40">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              {activeTab === 'manhaj_a0'
                ? 'Manhaj A0 Mavzulari'
                : activeTab === 'manhaj_a1'
                ? 'Manhaj A1 Mavzulari'
                : 'Grammatika Qo‘llanmasi Darslari'}
            </h4>
            <span className="text-[11px] text-slate-500">
              Jami {filteredLessons.length} ta dars mavjud
            </span>
          </div>

          <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
            {filteredLessons.map((lesson) => (
              <button
                key={lesson.id}
                onClick={() => setSelectedLesson(lesson)}
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
                  <p className="font-arabic text-xs text-rose-600 mt-1">
                    {lesson.arabicTitle}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">
                    {lesson.description}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mt-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Selected Lesson Preview & Materials (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-rose-100 shadow-xs p-6 space-y-6">
          <div className="border-b border-rose-100 pb-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                {selectedLesson.number}-Dars · Davomiyligi: {selectedLesson.duration}
              </span>
              <span className="text-xs text-slate-400">
                LMS ID: <code className="font-mono text-[11px]">{selectedLesson.id}</code>
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 mt-2">
              {selectedLesson.title}
            </h3>
            <p className="font-arabic text-xl text-rose-600 mt-1">
              {selectedLesson.arabicTitle}
            </p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              {selectedLesson.description}
            </p>
          </div>

          {/* Theoretical content */}
          <div>
            <h5 className="font-bold text-slate-800 text-xs mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-rose-500" />
              Nazariy Qoidalar & Tushuntirish
            </h5>
            <div className="p-4 bg-slate-50 rounded-xl text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans border border-slate-100">
              {selectedLesson.contentText}
            </div>
          </div>

          {/* Arabic Examples */}
          <div>
            <h5 className="font-bold text-slate-800 text-xs mb-2 uppercase tracking-wider">
              Darsdagi Arabcha Matnlar & Maxraj Misollari:
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {selectedLesson.arabicExamples.map((ex, idx) => (
                <div key={idx} className="p-3 bg-rose-50/40 rounded-xl border border-rose-100">
                  <p className="font-arabic text-lg text-rose-700 font-bold mb-1">
                    {ex.arabic}
                  </p>
                  <p className="text-xs font-medium text-slate-800">{ex.transcription}</p>
                  <p className="text-[11px] text-slate-500">{ex.translation}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Attached Files & Resources */}
          <div>
            <h5 className="font-bold text-slate-800 text-xs mb-2 uppercase tracking-wider">
              Biriktirilgan Qo‘llanmalar & Audio Materiallar:
            </h5>
            <div className="flex flex-wrap gap-3">
              {selectedLesson.resources.map((res, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  {res.type === 'pdf' ? (
                    <FileText className="w-4 h-4 text-rose-500" />
                  ) : (
                    <Headphones className="w-4 h-4 text-purple-500" />
                  )}
                  <div>
                    <span className="font-semibold text-slate-800 block leading-tight">
                      {res.name}
                    </span>
                    <span className="text-[10px] text-slate-400">{res.size}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quiz Preview */}
          <div className="pt-4 border-t border-slate-100">
            <h5 className="font-bold text-slate-800 text-xs mb-2 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-amber-500" />
              Biriktirilgan Nazorat Testlari ({selectedLesson.quiz.length} ta savol):
            </h5>
            <div className="space-y-2">
              {selectedLesson.quiz.map((q, idx) => (
                <div key={q.id} className="p-3 bg-slate-50 rounded-xl text-xs space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">
                      {idx + 1}. {q.question}
                    </span>
                    <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      +{q.points} ball
                    </span>
                  </div>
                  {q.arabicSnippet && (
                    <p className="font-arabic text-base text-rose-600">{q.arabicSnippet}</p>
                  )}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {q.options.map((opt, oIdx) => (
                      <div
                        key={oIdx}
                        className={`p-1.5 rounded-lg text-[11px] flex items-center gap-1.5 ${
                          oIdx === q.correctIndex
                            ? 'bg-emerald-100/70 text-emerald-800 font-semibold'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        {oIdx === q.correctIndex && <Check className="w-3 h-3 text-emerald-600" />}
                        <span>{opt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Lessom Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-rose-100 p-6 w-full max-w-xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-rose-600" />
                Yangi Dars Qo‘shish: {activeTab.toUpperCase()}
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateLesson} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mavzu Nomi (O‘zbekcha) *</label>
                  <input
                    type="text"
                    required
                    placeholder="Masalan: Tanvin qoidalari"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Arabcha Nomi</label>
                  <input
                    type="text"
                    placeholder="أَحْكَامُ التَّنْوِينِ"
                    value={newArabicTitle}
                    onChange={(e) => setNewArabicTitle(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400 font-arabic text-base"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Dars Davomiyligi</label>
                <input
                  type="text"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Qisqacha Tavsif</label>
                <input
                  type="text"
                  placeholder="Darsda o'rganiladigan asosiy tushunchalar..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nazariy Qoidalar & Matn</label>
                <textarea
                  rows={4}
                  placeholder="Dars matni va qoidalari..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Darsni Joylash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
