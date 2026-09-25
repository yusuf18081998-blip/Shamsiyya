import React from 'react';
import { Student } from '../../types';
import { Trophy, Award, CheckCircle, Star, Sparkles, Calendar } from 'lucide-react';

interface Props {
  currentStudent: Student;
  allStudents: Student[];
  onViewCertificate: (student: Student) => void;
}

export const StudentLeaderboard: React.FC<Props> = ({
  currentStudent,
  allStudents,
  onViewCertificate,
}) => {
  const sortedStudents = [...allStudents].sort((a, b) => b.totalPoints - a.totalPoints);
  const myRank = sortedStudents.findIndex((s) => s.id === currentStudent.id) + 1;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Individual stats banner */}
      <div className="bg-gradient-to-r from-rose-500 via-rose-600 to-pink-600 rounded-3xl p-6 sm:p-8 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 border border-white/30 backdrop-blur-md flex items-center justify-center text-2xl font-black">
              {currentStudent.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold bg-white/20 px-2.5 py-0.5 rounded-full text-rose-100">
                  {currentStudent.group}
                </span>
                <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  Guruhda #{myRank}-o‘rinda
                </span>
              </div>
              <h2 className="text-2xl font-extrabold mt-1">{currentStudent.fullName}</h2>
              <p className="text-xs text-rose-100 mt-0.5">
                «GROW UP A1» kursi faol tinglovchisi
              </p>
            </div>
          </div>

          {/* Certificate action inside banner */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex flex-col justify-between items-start md:items-end">
            <span className="text-xs text-rose-100 mb-1">Rasmiy Sertifikat Holati:</span>
            {currentStudent.certificateGranted ? (
              <button
                onClick={() => onViewCertificate(currentStudent)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-400 hover:bg-amber-300 text-amber-950 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                <Award className="w-4 h-4" />
                Sertifikatni Ko‘rish & Yuklash
              </button>
            ) : (
              <div className="text-xs text-rose-200 flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>90+ ball to‘planganda beriladi</span>
              </div>
            )}
          </div>
        </div>

        {/* 4 Key Performance Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/20">
          <div>
            <span className="text-[11px] text-rose-200 uppercase font-medium">Umumiy Ball</span>
            <div className="text-2xl font-black text-amber-300 tabular-nums">
              {currentStudent.totalPoints} <span className="text-xs font-normal">ball</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] text-rose-200 uppercase font-medium">Darsdagi Faollik</span>
            <div className="text-2xl font-black text-white tabular-nums">
              {currentStudent.activityPoints} <span className="text-xs font-normal">ball</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] text-rose-200 uppercase font-medium">Test Natijalari</span>
            <div className="text-2xl font-black text-white tabular-nums">
              {currentStudent.quizPoints} <span className="text-xs font-normal">ball</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] text-rose-200 uppercase font-medium">Davomat</span>
            <div className="text-2xl font-black text-emerald-300 tabular-nums">
              {currentStudent.attendanceRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/40">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Guruh O‘quvchilari Reytingi (Leaderboard)
            </h3>
            <p className="text-xs text-slate-500">
              «GROW UP A1» kursi o‘quvchilarining oylik natijalari
            </p>
          </div>
          <span className="text-xs font-semibold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-100">
            Top O‘quvchilar
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-6 text-center w-16">O‘rin</th>
                <th className="py-3 px-6">O‘quvchi</th>
                <th className="py-3 px-6">Guruh</th>
                <th className="py-3 px-6 text-center">Davomat</th>
                <th className="py-3 px-6 text-right">To‘plangan Ball</th>
                <th className="py-3 px-6 text-center">Sertifikat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedStudents.map((std, idx) => {
                const isCurrent = std.id === currentStudent.id;

                return (
                  <tr
                    key={std.id}
                    className={`transition-colors ${
                      isCurrent
                        ? 'bg-rose-50/70 font-semibold'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="py-3.5 px-6 text-center">
                      {idx === 0 && (
                        <span className="w-6 h-6 rounded-full bg-amber-400 text-amber-950 font-black inline-flex items-center justify-center text-xs shadow-xs">
                          1
                        </span>
                      )}
                      {idx === 1 && (
                        <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-800 font-black inline-flex items-center justify-center text-xs shadow-xs">
                          2
                        </span>
                      )}
                      {idx === 2 && (
                        <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-black inline-flex items-center justify-center text-xs shadow-xs">
                          3
                        </span>
                      )}
                      {idx > 2 && (
                        <span className="text-slate-500 font-bold">{idx + 1}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="text-slate-900 font-semibold flex items-center gap-1.5">
                        {std.fullName}
                        {isCurrent && (
                          <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.2 rounded font-normal">
                            Siz
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">{std.group}</td>
                    <td className="py-3.5 px-6 text-center">
                      <span className="text-slate-700 font-medium">{std.attendanceRate}%</span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <span className="text-rose-600 font-extrabold text-sm tabular-nums">
                        {std.totalPoints}
                      </span>
                      <span className="text-slate-400 text-[10px] ml-1">ball</span>
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      {std.certificateGranted ? (
                        <span className="inline-flex items-center gap-1 text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <CheckCircle className="w-3 h-3 text-amber-600" />
                          Berilgan
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">Jarayonda</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
