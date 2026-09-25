import React from 'react';
import { Student } from '../../types';
import { CreditCard, CheckCircle2, AlertCircle, Clock, ShieldCheck, HelpCircle } from 'lucide-react';

interface Props {
  student: Student;
}

export const StudentFinance: React.FC<Props> = ({ student }) => {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Read-Only Notice Banner */}
      <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-950">
          <span className="font-bold">Moliya bo‘limi xavfsizlik qoidasi (Faqat Ko‘rish Rejimi / Read-Only):</span>
          <p className="mt-0.5 text-amber-800 leading-relaxed">
            Sizning to‘lov holatingiz to‘g‘ridan-to‘g‘ri «Shamsiyya» markazi ma’muriyati tomonidan yuritiladi. O‘quvchi profilingizda to‘lov holatini o‘zboshimchalik bilan o‘zgartirish yoki tasdiqlash funksiyasi mavjud emas. Savollar yuzasidan ma’muriyatga murojaat qiling.
          </p>
        </div>
      </div>

      {/* Main Payment Status Card */}
      <div className="bg-white rounded-2xl border border-rose-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-100 pb-6">
          <div>
            <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider block">
              Joriy Kurs To‘lovi
            </span>
            <h3 className="text-xl font-bold text-slate-900 mt-1">
              «GROW UP A1» Arab Tili Intensiv Kursi
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              O‘quvchi: <strong>{student.fullName}</strong> · Guruh: {student.group}
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Belgilangan oylik to‘lov:</span>
            <span className="text-2xl font-black text-slate-900 tabular-nums">
              290 000 <span className="text-sm font-normal text-slate-500">so‘m</span>
            </span>
          </div>
        </div>

        {/* Dynamic Status Display */}
        <div className="p-6 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {student.paymentStatus === 'paid' && (
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs">
                <CheckCircle2 className="w-8 h-8" />
              </div>
            )}
            {student.paymentStatus === 'pending' && (
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
                <Clock className="w-8 h-8" />
              </div>
            )}
            {student.paymentStatus === 'debt' && (
              <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 shadow-xs">
                <AlertCircle className="w-8 h-8" />
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Rasmiy Holat:</span>
                {student.paymentStatus === 'paid' && (
                  <span className="text-base font-bold text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-lg border border-emerald-200">
                    To‘langan (290 000 so‘m)
                  </span>
                )}
                {student.paymentStatus === 'pending' && (
                  <span className="text-base font-bold text-amber-700 bg-amber-50 px-3 py-0.5 rounded-lg border border-amber-200">
                    Kutilmoqda (Tekshiruvda)
                  </span>
                )}
                {student.paymentStatus === 'debt' && (
                  <span className="text-base font-bold text-rose-700 bg-rose-50 px-3 py-0.5 rounded-lg border border-rose-200">
                    Qarzdorlik mavjud (290 000 so‘m)
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                {student.paymentStatus === 'paid' &&
                  `Sizning to‘lovingiz muvaffaqiyatli qabul qilingan va tasdiqlangan. Dars materiallari va barcha testlardan to‘liq foydalana olasiz.`}
                {student.paymentStatus === 'pending' &&
                  `Sizning to‘lov kvitansiyangiz markaz hisobchisi tomonidan tekshirilmoqda. Tez orada tasdiqlanadi.`}
                {student.paymentStatus === 'debt' &&
                  `Joriy oy uchun to‘lov hali qabul qilinmagan. Darslarda uzilish bo‘lmasligi uchun iltimos markaz ma’muriyatiga bog‘laning.`}
              </p>
            </div>
          </div>
        </div>

        {/* Verification Ledger Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[11px] text-slate-400 block uppercase font-medium">To‘lov Usuli</span>
            <span className="text-sm font-semibold text-slate-800 mt-1 block">
              {student.paymentMethod || 'Ma’lumot kiritilmagan'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[11px] text-slate-400 block uppercase font-medium">Tasdiqlangan Sana</span>
            <span className="text-sm font-semibold text-slate-800 mt-1 block">
              {student.paymentDate || '—'}
            </span>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="text-[11px] text-slate-400 block uppercase font-medium">Admin / Ma’muriyat Qaydi</span>
            <span className="text-sm font-semibold text-slate-800 mt-1 block truncate">
              {student.paymentNote || 'Qayd mavjud emas'}
            </span>
          </div>
        </div>

        {/* Contact Help */}
        <div className="pt-4 border-t border-rose-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-rose-500" />
            <span>To‘lov masalalari bo‘yicha: +998 71 200 45 45</span>
          </div>
          <span className="text-slate-400">«Shamsiyya» Qabulxona bo‘limi</span>
        </div>
      </div>
    </div>
  );
};
