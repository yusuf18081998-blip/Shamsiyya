import React, { useState } from 'react';
import { Student, PaymentStatus } from '../../types';
import { CreditCard, AlertCircle, CheckCircle2, Clock, Search, Send, DollarSign, ShieldAlert } from 'lucide-react';

interface Props {
  students: Student[];
  onUpdatePayment: (studentId: string, status: PaymentStatus, method?: string, note?: string) => void;
}

export const FinanceModule: React.FC<Props> = ({ students, onUpdatePayment }) => {
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'debt'>('all');
  const [search, setSearch] = useState('');
  const [selectedStudentForEdit, setSelectedStudentForEdit] = useState<Student | null>(null);
  const [editStatus, setEditStatus] = useState<PaymentStatus>('debt');
  const [editMethod, setEditMethod] = useState<'Payme' | 'Click' | 'Naqd' | 'Bank'>('Payme');
  const [editNote, setEditNote] = useState('');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const COURSE_PRICE = 290000;

  // Financial calculations
  const totalStudents = students.length;
  const paidStudents = students.filter(s => s.paymentStatus === 'paid');
  const pendingStudents = students.filter(s => s.paymentStatus === 'pending');
  const debtStudents = students.filter(s => s.paymentStatus === 'debt');

  const totalCollected = paidStudents.length * COURSE_PRICE;
  const totalDebt = debtStudents.length * COURSE_PRICE;
  const totalPending = pendingStudents.length * COURSE_PRICE;

  const filteredStudents = students.filter(s => {
    const matchesFilter = filter === 'all' || s.paymentStatus === filter;
    const matchesSearch = s.fullName.toLowerCase().includes(search.toLowerCase()) ||
                          s.phone.includes(search) ||
                          s.group.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleOpenEdit = (student: Student) => {
    setSelectedStudentForEdit(student);
    setEditStatus(student.paymentStatus);
    setEditMethod(student.paymentMethod || 'Payme');
    setEditNote(student.paymentNote || '');
  };

  const handleSavePayment = () => {
    if (selectedStudentForEdit) {
      onUpdatePayment(selectedStudentForEdit.id, editStatus, editMethod, editNote);
      setSelectedStudentForEdit(null);
      setNotificationMsg(`${selectedStudentForEdit.fullName} to‘lov holati o‘zgartirildi!`);
      setTimeout(() => setNotificationMsg(null), 3000);
    }
  };

  const handleSendReminder = (student: Student) => {
    setNotificationMsg(`Eslatma SMS yuborildi: ${student.fullName} (${student.phone})`);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notificationMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center justify-between shadow-sm animate-fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{notificationMsg}</span>
          </div>
        </div>
      )}

      {/* Security Rule Banner */}
      <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="text-xs text-rose-950">
          <span className="font-bold">Moliya va To'lov Qoidasi (Xavfsizlik talabi):</span>
          <p className="mt-0.5 text-rose-800">
            Faqat Admin to‘lov statuslarini (To‘langan, Kutilmoqda, Qarzdor) tasdiqlash va o‘zgartirish huquqiga ega. O‘quvchi kabinetida to‘lov statusi qat’iy faqat o‘qish (Read-Only) rejimida taqdim etiladi.
          </p>
        </div>
      </div>

      {/* Financial Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Collected */}
        <div className="p-5 bg-white rounded-2xl border border-rose-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tushum (Kassa)</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
              {totalCollected.toLocaleString('uz-UZ')} <span className="text-xs font-normal text-slate-500">so‘m</span>
            </div>
            <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" /> {paidStudents.length} ta o‘quvchi to‘lagan
            </p>
          </div>
        </div>

        {/* Debt Amount */}
        <div className="p-5 bg-white rounded-2xl border border-rose-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Qarzdorlik</span>
            <div className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-rose-600 tabular-nums">
              {totalDebt.toLocaleString('uz-UZ')} <span className="text-xs font-normal text-slate-500">so‘m</span>
            </div>
            <p className="text-xs text-rose-500 mt-1 flex items-center gap-1 font-medium">
              {debtStudents.length} ta o‘quvchida qarzdorlik
            </p>
          </div>
        </div>

        {/* Pending Amount */}
        <div className="p-5 bg-white rounded-2xl border border-rose-100 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Kutilmoqda (Cheklar)</span>
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-amber-600 tabular-nums">
              {totalPending.toLocaleString('uz-UZ')} <span className="text-xs font-normal text-slate-500">so‘m</span>
            </div>
            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1 font-medium">
              {pendingStudents.length} ta o‘quvchi cheki tekshiruvda
            </p>
          </div>
        </div>

        {/* Course Rate Card */}
        <div className="p-5 bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl border border-rose-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Kurs Narxi: GROW UP A1</span>
            <div className="w-8 h-8 rounded-lg bg-rose-200 text-rose-800 flex items-center justify-center">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
              290 000 <span className="text-xs font-normal text-slate-500">so‘m / oy</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Jami o‘quvchilar: {totalStudents} nafar
            </p>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Interactive Segmented Filter Controls */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl w-full sm:w-auto">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Barchasi ({students.length})
          </button>
          <button
            onClick={() => setFilter('paid')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filter === 'paid'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            To‘langan ({paidStudents.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filter === 'pending'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-amber-700'
            }`}
          >
            Kutilmoqda ({pendingStudents.length})
          </button>
          <button
            onClick={() => setFilter('debt')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
              filter === 'debt'
                ? 'bg-rose-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-rose-700'
            }`}
          >
            Qarzdorlar ({debtStudents.length})
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Ism, telefon yoki guruh bo‘yicha..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-rose-400 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-xs overflow-hidden">
        <div className="px-6 py-4 border-b border-rose-100 flex items-center justify-between bg-rose-50/30">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">O‘quvchilar To‘lov Vedomosti</h3>
            <p className="text-xs text-slate-500">
              «GROW UP A1» kursi uchun belgilangan 290 000 so‘m oylik to‘lovlar ro‘yxati
            </p>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Ko‘rsatilmoqda: <strong className="text-slate-800">{filteredStudents.length}</strong> ta o‘quvchi
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-6">O‘quvchi</th>
                <th className="py-3 px-6">Guruh</th>
                <th className="py-3 px-6 text-right">Summa</th>
                <th className="py-3 px-6 text-center">To‘lov Holati</th>
                <th className="py-3 px-6">To‘lov Usuli & Sana</th>
                <th className="py-3 px-6">Admin Qaydlari</th>
                <th className="py-3 px-6 text-right">Harakat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-400">
                    Hech qanday o‘quvchi topilmadi
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-rose-50/20 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="font-semibold text-slate-900">{student.fullName}</div>
                      <div className="text-[11px] text-slate-400">{student.phone}</div>
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {student.group}
                    </td>
                    <td className="py-3.5 px-6 text-right font-bold text-slate-900 tabular-nums">
                      290 000 so‘m
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      {student.paymentStatus === 'paid' && (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md text-[11px] border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          To‘langan
                        </span>
                      )}
                      {student.paymentStatus === 'pending' && (
                        <span className="inline-flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-md text-[11px] border border-amber-200">
                          <Clock className="w-3.5 h-3.5" />
                          Kutilmoqda
                        </span>
                      )}
                      {student.paymentStatus === 'debt' && (
                        <span className="inline-flex items-center gap-1 text-rose-700 font-semibold bg-rose-50 px-2.5 py-1 rounded-md text-[11px] border border-rose-200">
                          <AlertCircle className="w-3.5 h-3.5" />
                          Qarzdor
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-slate-600">
                      {student.paymentMethod ? (
                        <div>
                          <span className="font-medium text-slate-800">{student.paymentMethod}</span>
                          {student.paymentDate && (
                            <span className="text-[11px] text-slate-400 block">{student.paymentDate}</span>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-slate-500 max-w-xs truncate">
                      {student.paymentNote || '—'}
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {student.paymentStatus === 'debt' && (
                          <button
                            onClick={() => handleSendReminder(student)}
                            title="SMS Eslatma yuborish"
                            className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => handleOpenEdit(student)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 rounded-md text-xs font-medium transition-colors cursor-pointer"
                        >
                          Holatni o‘zgartirish
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

      {/* Edit Payment Status Modal (ADMIN ONLY) */}
      {selectedStudentForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-rose-100 p-6 w-full max-w-md space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="font-bold text-slate-900 text-base">To‘lov Holatini Yangilash</h4>
                <p className="text-xs text-slate-500">{selectedStudentForEdit.fullName}</p>
              </div>
              <button
                onClick={() => setSelectedStudentForEdit(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Kurs va Narx:</label>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-800 font-bold">
                  GROW UP A1 — 290 000 so‘m
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">To‘lov Statusi (Faqat Admin):</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setEditStatus('paid')}
                    className={`py-2 px-3 rounded-xl border font-semibold transition-all cursor-pointer ${
                      editStatus === 'paid'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    To‘langan
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus('pending')}
                    className={`py-2 px-3 rounded-xl border font-semibold transition-all cursor-pointer ${
                      editStatus === 'pending'
                        ? 'border-amber-500 bg-amber-50 text-amber-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Kutilmoqda
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditStatus('debt')}
                    className={`py-2 px-3 rounded-xl border font-semibold transition-all cursor-pointer ${
                      editStatus === 'debt'
                        ? 'border-rose-500 bg-rose-50 text-rose-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Qarzdor
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">To‘lov Usuli:</label>
                <select
                  value={editMethod}
                  onChange={(e) => setEditMethod(e.target.value as any)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                >
                  <option value="Payme">Payme</option>
                  <option value="Click">Click</option>
                  <option value="Naqd">Naqd pul</option>
                  <option value="Bank">Bank o‘tkazmasi</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Admin Izohi / Chek raqami:</label>
                <textarea
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="Masalan: Chek tasdiqlandi, to'liq to'landi..."
                  rows={2}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedStudentForEdit(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Bekor qilish
              </button>
              <button
                type="button"
                onClick={handleSavePayment}
                className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Saqlash
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
