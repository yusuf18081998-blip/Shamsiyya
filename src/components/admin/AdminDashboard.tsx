import React, { useState } from 'react';
import { Student, Lesson, AttendanceRecord, PaymentStatus } from '../../types';
import { StudentsCRM } from './StudentsCRM';
import { FinanceModule } from './FinanceModule';
import { AttendanceGrading } from './AttendanceGrading';
import { ContentManagement } from './ContentManagement';
import { Users, DollarSign, CalendarCheck, BookOpen } from 'lucide-react';

interface Props {
  students: Student[];
  lessons: Lesson[];
  attendance: AttendanceRecord[];
  onAddStudent: (student: Omit<Student, 'id' | 'totalPoints' | 'activityPoints' | 'quizPoints' | 'attendanceRate' | 'certificateGranted'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onUpdatePayment: (studentId: string, status: PaymentStatus, method?: string, note?: string) => void;
  onAddAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  onAddPoints: (studentId: string, points: number, reason: string) => void;
  onAddLesson: (lesson: Omit<Lesson, 'id'>) => void;
  onUpdateLesson: (lesson: Lesson) => void;
  onGrantCertificate: (studentId: string) => void;
  onViewCertificate: (student: Student) => void;
}

export const AdminDashboard: React.FC<Props> = ({
  students,
  lessons,
  attendance,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onUpdatePayment,
  onAddAttendance,
  onAddPoints,
  onAddLesson,
  onUpdateLesson,
  onGrantCertificate,
  onViewCertificate,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<'students' | 'finance' | 'grading' | 'content'>('students');

  const debtCount = students.filter((s) => s.paymentStatus === 'debt').length;

  return (
    <div className="space-y-6">
      {/* Chief Teacher Welcome & Live Server Banner */}
      <div className="bg-gradient-to-r from-rose-500 via-pink-600 to-rose-700 rounded-3xl p-5 text-white shadow-md relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-arabic text-amber-200 text-lg">أَهْلًا وَسَهْلًا</span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full font-medium backdrop-blur-xs">
              Markaz Boshqaruvi
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            Assalomu alaykum, Bosh ustoz A.Xo‘jayeva!
          </h2>
          <p className="text-xs text-rose-100 mt-0.5">
            «Shamsiyya» akademiyasi CRM & LMS tizimi faol ishlamoqda.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 bg-black/20 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 text-xs">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-medium text-emerald-300">Server Faol:</span>
          <span className="text-white font-mono font-semibold">GROW UP A1 (290 000 so‘m)</span>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white border border-rose-100 rounded-2xl shadow-xs">
        <button
          onClick={() => setActiveAdminTab('students')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeAdminTab === 'students'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>O‘quvchilar (CRM)</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeAdminTab === 'students' ? 'bg-white/20' : 'bg-slate-100 text-slate-700'}`}>
            {students.length}
          </span>
        </button>

        <button
          onClick={() => setActiveAdminTab('finance')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeAdminTab === 'finance'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>Moliya & To‘lovlar</span>
          {debtCount > 0 && (
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeAdminTab === 'finance' ? 'bg-white text-rose-600' : 'bg-rose-100 text-rose-700'}`}>
              {debtCount} qarzdor
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('grading')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeAdminTab === 'grading'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Davomat & Baholash</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('content')}
          className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeAdminTab === 'content'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Darslar & Kontent (LMS)</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeAdminTab === 'content' ? 'bg-white/20' : 'bg-slate-100 text-slate-700'}`}>
            {lessons.length} mavzu
          </span>
        </button>
      </div>

      {/* Tab Panels */}
      {activeAdminTab === 'students' && (
        <StudentsCRM
          students={students}
          onAddStudent={onAddStudent}
          onUpdateStudent={onUpdateStudent}
          onDeleteStudent={onDeleteStudent}
          onViewCertificate={onViewCertificate}
          onToggleCertificate={onGrantCertificate}
        />
      )}

      {activeAdminTab === 'finance' && (
        <FinanceModule
          students={students}
          onUpdatePayment={onUpdatePayment}
        />
      )}

      {activeAdminTab === 'grading' && (
        <AttendanceGrading
          students={students}
          attendance={attendance}
          onAddAttendance={onAddAttendance}
          onAddPoints={onAddPoints}
          onGrantCertificate={onGrantCertificate}
          onViewCertificate={onViewCertificate}
        />
      )}

      {activeAdminTab === 'content' && (
        <ContentManagement
          lessons={lessons}
          onAddLesson={onAddLesson}
          onUpdateLesson={onUpdateLesson}
        />
      )}
    </div>
  );
};
