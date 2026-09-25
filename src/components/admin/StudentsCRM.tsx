import React, { useState } from 'react';
import { Student } from '../../types';
import { UserPlus, Search, Edit3, Trash2, Award, Phone, Mail, Users } from 'lucide-react';

interface Props {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id' | 'totalPoints' | 'activityPoints' | 'quizPoints' | 'attendanceRate' | 'certificateGranted'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  onViewCertificate: (student: Student) => void;
  onToggleCertificate: (studentId: string) => void;
}

export const StudentsCRM: React.FC<Props> = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  onViewCertificate,
  onToggleCertificate,
}) => {
  const [search, setSearch] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // New Student Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('123456');
  const [group, setGroup] = useState('GROW UP A1 - 1-Guruh (Ertalabki)');
  const [initialPayment, setInitialPayment] = useState<'paid' | 'pending' | 'debt'>('debt');
  const [status, setStatus] = useState<'active' | 'graduated' | 'paused'>('active');

  const groups = Array.from(new Set(students.map((s) => s.group)));

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search) ||
      (s.username && s.username.toLowerCase().includes(search.toLowerCase())) ||
      s.email.toLowerCase().includes(search.toLowerCase());
    const matchesGroup = selectedGroup === 'all' || s.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;

    const defaultUsername = username.trim() || fullName.trim().toLowerCase().split(' ')[0];

    onAddStudent({
      fullName,
      phone,
      email: email || `${defaultUsername}@shamsiyya.uz`,
      username: defaultUsername,
      password: password || '123456',
      group,
      enrollmentDate: new Date().toISOString().split('T')[0],
      status,
      paymentStatus: initialPayment,
      paymentAmount: 290000,
      paymentNote: initialPayment === 'paid' ? 'Birinchi oylik to‘lov qabul qilindi' : undefined,
    });

    // Reset
    setFullName('');
    setPhone('+998 ');
    setEmail('');
    setUsername('');
    setPassword('123456');
    setIsAddModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent) return;
    onUpdateStudent(editingStudent);
    setEditingStudent(null);
  };

  return (
    <div className="space-y-6">
      {/* Top action row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-rose-100 shadow-xs">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="O‘quvchini qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
            />
          </div>

          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="p-2 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:ring-2 focus:ring-rose-400"
          >
            <option value="all">Barcha Guruhlar</option>
            {groups.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors cursor-pointer"
        >
          <UserPlus className="w-4 h-4" />
          Yangi O‘quvchi Qo‘shish
        </button>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/40">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-600" />
              «GROW UP A1» O‘quvchilar Boshqaruvi
            </h3>
            <p className="text-xs text-slate-500">
              Guruhlar, to‘lov holati, jami to‘plangan ballar va sertifikat berish
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Jami: <strong className="text-slate-900">{filteredStudents.length}</strong> o‘quvchi
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-6">O‘quvchi</th>
                <th className="py-3.5 px-6">Aloqa</th>
                <th className="py-3.5 px-6">Guruh</th>
                <th className="py-3.5 px-6 text-center">To‘lov (290 ming)</th>
                <th className="py-3.5 px-6 text-center">Faollik Ball</th>
                <th className="py-3.5 px-6 text-center">Davomat</th>
                <th className="py-3.5 px-6 text-center">Sertifikat</th>
                <th className="py-3.5 px-6 text-right">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-slate-400">
                    O‘quvchi topilmadi
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-semibold text-slate-900">{student.fullName}</div>
                      <div className="text-[11px] text-slate-400">
                        Qabul: {student.enrollmentDate}
                      </div>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-1 text-slate-600">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{student.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-400 text-[11px] mt-0.5">
                        <Mail className="w-3 h-3 text-slate-300" />
                        <span>{student.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-slate-700 font-medium">
                      {student.group}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      {student.paymentStatus === 'paid' && (
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          To‘langan
                        </span>
                      )}
                      {student.paymentStatus === 'pending' && (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          Kutilmoqda
                        </span>
                      )}
                      {student.paymentStatus === 'debt' && (
                        <span className="text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Qarzdor
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <span className="font-bold text-slate-900 tabular-nums">
                        {student.totalPoints}
                      </span>
                      <span className="text-slate-400 text-[10px] ml-1">ball</span>
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              student.attendanceRate >= 90
                                ? 'bg-emerald-500'
                                : student.attendanceRate >= 75
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            }`}
                            style={{ width: `${student.attendanceRate}%` }}
                          />
                        </div>
                        <span className="font-medium text-slate-700 text-[11px] tabular-nums">
                          {student.attendanceRate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      {student.certificateGranted ? (
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => onViewCertificate(student)}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2 py-0.5 rounded transition-colors cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5 text-amber-600" />
                            Ko‘rish
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onToggleCertificate(student.id)}
                          className="text-[11px] text-slate-500 hover:text-rose-600 underline cursor-pointer"
                        >
                          Berish
                        </button>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setEditingStudent(student)}
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="Tahrirlash"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`${student.fullName}ni tizimdan o‘chirishni tasdiqlaysizmi?`)) {
                              onDeleteStudent(student.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          title="O‘chirish"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Student Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-rose-100 p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-rose-600" />
                Yangi O‘quvchi Ro‘yxatga Olish
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  To‘liq Ism Familiya *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Mahbuba Yusupova"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Telefon *</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    placeholder="student@shamsiyya.uz"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                <div>
                  <label className="block font-semibold text-rose-800 mb-1">Kabinet Logini</label>
                  <input
                    type="text"
                    placeholder="Masalan: mahbuba"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400 font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-rose-800 mb-1">Kirish Paroli</label>
                  <input
                    type="text"
                    placeholder="123456"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Guruh Tanlash</label>
                <select
                  value={group}
                  onChange={(e) => setGroup(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                >
                  <option value="GROW UP A1 - 1-Guruh (Ertalabki)">
                    GROW UP A1 - 1-Guruh (Ertalabki 09:00)
                  </option>
                  <option value="GROW UP A1 - 2-Guruh (Kechki)">
                    GROW UP A1 - 2-Guruh (Kechki 18:00)
                  </option>
                  <option value="GROW UP A1 - 3-Guruh (Shanba/Yakshanba)">
                    GROW UP A1 - 3-Guruh (Weekend)
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    To‘lov Holati (290 000 so‘m)
                  </label>
                  <select
                    value={initialPayment}
                    onChange={(e) => setInitialPayment(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                  >
                    <option value="paid">To‘langan (Payme/Click)</option>
                    <option value="pending">Kutilmoqda (Tekshiruv)</option>
                    <option value="debt">Qarzdor (To‘lanmagan)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Holati</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                  >
                    <option value="active">Faol o‘quvchi</option>
                    <option value="paused">Muzlatilgan</option>
                  </select>
                </div>
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
                  Ro‘yxatga olish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Student Modal */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-rose-100 p-6 w-full max-w-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-slate-900 text-base">O‘quvchi Ma'lumotlarini Tahrirlash</h4>
              <button
                onClick={() => setEditingStudent(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">To‘liq Ism</label>
                <input
                  type="text"
                  value={editingStudent.fullName}
                  onChange={(e) => setEditingStudent({ ...editingStudent, fullName: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Telefon</label>
                  <input
                    type="text"
                    value={editingStudent.phone}
                    onChange={(e) => setEditingStudent({ ...editingStudent, phone: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Guruh</label>
                  <input
                    type="text"
                    value={editingStudent.group}
                    onChange={(e) => setEditingStudent({ ...editingStudent, group: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-rose-50/50 rounded-xl border border-rose-100">
                <div>
                  <label className="block font-semibold text-rose-800 mb-1">Kabinet Logini</label>
                  <input
                    type="text"
                    value={editingStudent.username || ''}
                    onChange={(e) => setEditingStudent({ ...editingStudent, username: e.target.value })}
                    placeholder="Login"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-rose-800 mb-1">Yangi Parol</label>
                  <input
                    type="text"
                    value={editingStudent.password || '123456'}
                    onChange={(e) => setEditingStudent({ ...editingStudent, password: e.target.value })}
                    placeholder="Parol"
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs"
                >
                  Yangilash
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
