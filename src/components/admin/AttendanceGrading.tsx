import React, { useState } from 'react';
import { Student, AttendanceRecord } from '../../types';
import { Award, CheckCircle, XCircle, Clock, PlusCircle, Trophy, Sparkles } from 'lucide-react';

interface Props {
  students: Student[];
  attendance: AttendanceRecord[];
  onAddAttendance: (record: Omit<AttendanceRecord, 'id'>) => void;
  onAddPoints: (studentId: string, points: number, reason: string) => void;
  onGrantCertificate: (studentId: string) => void;
  onViewCertificate: (student: Student) => void;
}

export const AttendanceGrading: React.FC<Props> = ({
  students,
  attendance,
  onAddAttendance,
  onAddPoints,
  onGrantCertificate,
  onViewCertificate,
}) => {
  const [selectedLesson, setSelectedLesson] = useState<number>(1);
  const [selectedStudentForPoints, setSelectedStudentForPoints] = useState<Student | null>(null);
  const [pointAmount, setPointAmount] = useState<number>(10);
  const [pointReason, setPointReason] = useState<string>('Darsdagi faol ishtirok va to‘g‘ri maxraj');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Top students (Leaderboard)
  const topStudents = [...students].sort((a, b) => b.totalPoints - a.totalPoints);

  const handleMarkAttendance = (student: Student, status: 'present' | 'absent_reason' | 'absent_no_reason' | 'late') => {
    onAddAttendance({
      studentId: student.id,
      studentName: student.fullName,
      lessonNumber: selectedLesson,
      date: new Date().toISOString().split('T')[0],
      status,
    });
    setSuccessToast(`${student.fullName} davomati qayd etildi`);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  const handleGivePoints = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForPoints) return;
    onAddPoints(selectedStudentForPoints.id, pointAmount, pointReason);
    setSuccessToast(`${selectedStudentForPoints.fullName}ga +${pointAmount} ball berildi!`);
    setSelectedStudentForPoints(null);
    setTimeout(() => setSuccessToast(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Bar: Monthly Top Leaderboard & Certificate Recommendation */}
      <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-300" />
              <h3 className="font-bold text-lg">Oylik Top-O‘quvchilar & Sertifikat Monitoringi</h3>
            </div>
            <p className="text-xs text-rose-100 mt-1 max-w-xl">
              Darsdagi faollik ballari va test natijalari asosida avtomatik hisoblanuvchi reyting. 90+ ball to‘plagan o‘quvchilar «Shamsiyya» sertifikatiga ega bo‘ladi.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-semibold">
              Sertifikat egalari: {students.filter((s) => s.certificateGranted).length} nafar
            </span>
          </div>
        </div>

        {/* Podium for top 3 or Empty state */}
        {topStudents.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-xl text-center text-rose-100 text-xs mt-4">
            Hozircha o‘quvchilar ro‘yxati bo‘sh. Yangi o‘quvchilar qo‘shilgach, bu yerda oylik yetakchilar podiumi paydo bo‘ladi.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-6">
            {topStudents.slice(0, 3).map((std, idx) => (
              <div
                key={std.id}
                className="bg-white/15 backdrop-blur-md border border-white/20 p-4 rounded-xl flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-950 font-extrabold text-xs flex items-center justify-center shadow-xs">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white leading-tight">{std.fullName}</h4>
                    <p className="text-[11px] text-rose-100">{std.group}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-black text-amber-300 tabular-nums">
                    {std.totalPoints} <span className="text-[10px] font-normal">ball</span>
                  </div>
                  {std.certificateGranted ? (
                    <button
                      onClick={() => onViewCertificate(std)}
                      className="text-[10px] text-amber-200 underline font-medium hover:text-white cursor-pointer"
                    >
                      Sertifikat (№{std.certificateId || '001'})
                    </button>
                  ) : (
                    <button
                      onClick={() => onGrantCertificate(std.id)}
                      className="text-[10px] bg-white text-rose-600 font-semibold px-2 py-0.5 rounded shadow-xs hover:bg-rose-50 cursor-pointer"
                    >
                      Sertifikat berish
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Attendance & Grading Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Attendance Journal (2 columns) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-rose-100 shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-rose-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-rose-50/40">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Davomat Jurnali (GROW UP A1)</h3>
              <p className="text-xs text-slate-500">Dars raqamini tanlang va o‘quvchilar qatnashuvini belgilang</p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-600 font-medium">Dars:</span>
              <select
                value={selectedLesson}
                onChange={(e) => setSelectedLesson(Number(e.target.value))}
                className="p-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 font-semibold focus:ring-2 focus:ring-rose-400"
              >
                <option value={1}>1-Dars: Maxrajlar asoslari</option>
                <option value={2}>2-Dars: Harakatlar (Fatha, Kasra, Zamma)</option>
                <option value={3}>3-Dars: Salomlashish va Tanishuv</option>
                <option value={4}>4-Dars: Oila va Qarindoshlar</option>
                <option value={5}>5-Dars: Kalomning Qismlari</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-6">O‘quvchi</th>
                  <th className="py-3 px-6 text-center">Davomat Foizi</th>
                  <th className="py-3 px-6 text-center">Joriy Holat</th>
                  <th className="py-3 px-6 text-right">Belgilash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-400">
                      <p className="font-semibold text-slate-600 mb-1">O‘quvchilar ro‘yxati bo‘sh</p>
                      <p className="text-xs text-slate-400">Markazga birinchi o‘quvchini qo‘shish uchun CRM bo‘limiga o‘ting.</p>
                    </td>
                  </tr>
                ) : (
                  students.map((student) => {
                  const record = attendance.find(
                    (a) => a.studentId === student.id && a.lessonNumber === selectedLesson
                  );

                  return (
                    <tr key={student.id} className="hover:bg-rose-50/20 transition-colors">
                      <td className="py-3 px-6">
                        <div className="font-semibold text-slate-900">{student.fullName}</div>
                        <div className="text-[11px] text-slate-400">{student.group}</div>
                      </td>
                      <td className="py-3 px-6 text-center">
                        <span className="font-semibold text-slate-800 tabular-nums">
                          {student.attendanceRate}%
                        </span>
                      </td>
                      <td className="py-3 px-6 text-center">
                        {record?.status === 'present' && (
                          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold border border-emerald-200">
                            Kelgan
                          </span>
                        )}
                        {record?.status === 'late' && (
                          <span className="text-[11px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold border border-amber-200">
                            Kechikkan
                          </span>
                        )}
                        {record?.status === 'absent_reason' && (
                          <span className="text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-semibold border border-blue-200">
                            Sababli
                          </span>
                        )}
                        {record?.status === 'absent_no_reason' && (
                          <span className="text-[11px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-semibold border border-rose-200">
                            Sababsiz
                          </span>
                        )}
                        {!record && <span className="text-slate-400 text-[11px]">Belgilanmagan</span>}
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleMarkAttendance(student, 'present')}
                            title="Keldi"
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors cursor-pointer"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMarkAttendance(student, 'late')}
                            title="Kechikdi"
                            className="p-1.5 text-amber-600 hover:bg-amber-50 rounded-md transition-colors cursor-pointer"
                          >
                            <Clock className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMarkAttendance(student, 'absent_reason')}
                            title="Sababli kelmadi"
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors cursor-pointer"
                          >
                            <span className="text-[11px] font-bold">Sab</span>
                          </button>
                          <button
                            onClick={() => handleMarkAttendance(student, 'absent_no_reason')}
                            title="Sababsiz kelmadi"
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
            </table>
          </div>
        </div>

        {/* Right: Quick Activity Points Giver (1 column) */}
        <div className="bg-white rounded-2xl border border-rose-100 shadow-xs p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <PlusCircle className="w-5 h-5 text-rose-600" />
              <h3 className="font-bold text-slate-900 text-sm">Faollik Bali Qo‘yish</h3>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Darsda to‘g‘ri talaffuz, uy vazifasi va lug‘at yodlash uchun o‘quvchilarga rag‘batlantiruvchi ballar bering.
            </p>

            <form onSubmit={handleGivePoints} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">O‘quvchini Tanlang:</label>
                <select
                  value={selectedStudentForPoints?.id || ''}
                  onChange={(e) => {
                    const std = students.find((s) => s.id === e.target.value);
                    setSelectedStudentForPoints(std || null);
                  }}
                  required
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                >
                  <option value="">O‘quvchini tanlang...</option>
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.totalPoints} ball)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ball Miqdori:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[5, 10, 15].map((pts) => (
                    <button
                      key={pts}
                      type="button"
                      onClick={() => setPointAmount(pts)}
                      className={`py-2 rounded-xl font-bold border transition-colors cursor-pointer ${
                        pointAmount === pts
                          ? 'border-rose-500 bg-rose-50 text-rose-600 shadow-xs'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      +{pts} ball
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sabab / Izoh:</label>
                <input
                  type="text"
                  value={pointReason}
                  onChange={(e) => setPointReason(e.target.value)}
                  placeholder="Masalan: Uy vazifasini 100% to'g'ri bajardi"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <button
                type="submit"
                disabled={!selectedStudentForPoints}
                className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl font-semibold shadow-xs transition-colors cursor-pointer"
              >
                Ballni Qo‘shish
              </button>
            </form>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-500 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500 shrink-0" />
            <span>Ballar avtomatik umumiy reyting va sertifikat balliga qo‘shiladi.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
