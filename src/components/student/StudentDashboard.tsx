import React, { useState } from 'react';
import { Student, Lesson } from '../../types';
import { CourseViewer } from './CourseViewer';
import { StudentFinance } from './StudentFinance';
import { StudentLeaderboard } from './StudentLeaderboard';
import { BookOpen, CreditCard, Trophy } from 'lucide-react';

interface Props {
  currentStudent: Student;
  allStudents: Student[];
  lessons: Lesson[];
  onQuizCompleted: (points: number) => void;
  onViewCertificate: (student: Student) => void;
}

export const StudentDashboard: React.FC<Props> = ({
  currentStudent,
  allStudents,
  lessons,
  onQuizCompleted,
  onViewCertificate,
}) => {
  const [activeTab, setActiveTab] = useState<'courses' | 'finance' | 'leaderboard'>('courses');

  return (
    <div className="space-y-6">
      {/* Student Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-rose-100 rounded-2xl shadow-xs">
        <button
          onClick={() => setActiveTab('courses')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'courses'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Darslar & Qo‘llanmalar (LMS)</span>
        </button>

        <button
          onClick={() => setActiveTab('finance')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'finance'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>To‘lov Holati (Faqat Ko‘rish)</span>
          <span
            className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              currentStudent.paymentStatus === 'paid'
                ? activeTab === 'finance' ? 'bg-white text-emerald-700' : 'bg-emerald-100 text-emerald-800'
                : activeTab === 'finance' ? 'bg-white text-rose-700' : 'bg-rose-100 text-rose-800'
            }`}
          >
            {currentStudent.paymentStatus === 'paid' ? 'To‘langan' : 'Qarzdor'}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeTab === 'leaderboard'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>Mening Natijalarim & Sertifikat</span>
          <span className="text-[10px] text-amber-500 font-bold">
            {currentStudent.totalPoints} ball
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeTab === 'courses' && (
        <CourseViewer
          lessons={lessons}
          onQuizCompleted={onQuizCompleted}
        />
      )}

      {activeTab === 'finance' && (
        <StudentFinance student={currentStudent} />
      )}

      {activeTab === 'leaderboard' && (
        <StudentLeaderboard
          currentStudent={currentStudent}
          allStudents={allStudents}
          onViewCertificate={onViewCertificate}
        />
      )}
    </div>
  );
};
