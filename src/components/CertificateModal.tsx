import React from 'react';
import { Student } from '../types';
import { X, Printer, Award, CheckCircle2, QrCode } from 'lucide-react';
import shamsiyyaLogo from '../assets/images/shamsiyya_logo_emblem_1790347598348.jpg';

interface Props {
  student: Student | null;
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<Props> = ({ student, isOpen, onClose }) => {
  if (!isOpen || !student) return null;

  const handlePrint = () => {
    window.print();
  };

  const certNumber = student.certificateId || `SHM-2026-A1-${student.id.replace('std-', '00')}`;
  const issueDate = student.certificateDate || '2026-09-24';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden my-6">
        {/* Action bar (Hidden when printing) */}
        <div className="flex items-center justify-between px-6 py-3.5 border-b border-rose-100 bg-rose-50/60 print:hidden">
          <div className="flex items-center gap-2 text-rose-800 font-semibold text-sm">
            <Award className="w-5 h-5 text-rose-500" />
            <span>«Shamsiyya» Rasmiy O'quv Sertifikati</span>
            <span className="text-xs text-rose-500 font-normal ml-2">ID: {certNumber}</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Chop etish / PDF saqlash
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Certificate Canvas */}
        <div id="printable-certificate" className="p-8 bg-[#FFFDFE] flex justify-center">
          <div className="relative w-full max-w-[850px] aspect-[1.414/1] bg-white border-8 border-rose-200/60 p-8 rounded-xl shadow-lg flex flex-col justify-between overflow-hidden">
            {/* Elegant Ornamental Borders */}
            <div className="absolute inset-2 border-2 border-amber-300/60 rounded-lg pointer-events-none"></div>
            <div className="absolute -top-16 -right-16 w-56 h-56 bg-rose-100/40 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-amber-100/40 rounded-full blur-2xl pointer-events-none"></div>

            {/* Header: Logo and Title */}
            <div className="relative text-center pt-2">
              <div className="flex items-center justify-center gap-3 mb-2">
                <img
                  src={shamsiyyaLogo}
                  alt="Shamsiyya Emblem"
                  className="w-14 h-14 rounded-full object-cover border-2 border-amber-300 shadow-xs"
                />
              </div>
              <p className="font-arabic text-2xl text-rose-600 tracking-wide">
                مَرْكَزُ شَمْسِيَّة لِتَعْلِيمِ اللُّغَةِ العَرَبِيَّةِ
              </p>
              <h1 className="text-xl font-bold tracking-widest text-slate-800 uppercase mt-1">
                SHAMSIYYA ARAB TILI MARKAZI
              </h1>
              <div className="flex items-center justify-center gap-3 my-2">
                <div className="h-[1px] w-24 bg-gradient-to-r from-transparent to-amber-400"></div>
                <span className="text-xs font-semibold text-amber-600 tracking-widest uppercase">
                  Muvaffaqiyat Sertifikati
                </span>
                <div className="h-[1px] w-24 bg-gradient-to-l from-transparent to-amber-400"></div>
              </div>
            </div>

            {/* Body */}
            <div className="relative text-center my-auto px-6 space-y-4">
              <p className="text-xs text-slate-500 uppercase tracking-wider">
                Ushbu sertifikat quyidagi o‘quvchiga taqdim etiladi:
              </p>

              <h2 className="text-3xl font-extrabold text-slate-900 border-b-2 border-rose-300 inline-block pb-2 px-8">
                {student.fullName}
              </h2>

              <p className="text-sm text-slate-700 max-w-xl mx-auto leading-relaxed mt-2">
                «Shamsiyya» arab tili markazining <strong>«GROW UP A1»</strong> o‘quv dasturini (Manhaj A0, Manhaj A1 va Grammatika qo‘llanmasi) muvaffaqiyatli yakunlab, yakuniy imtihon va testlardan yuqori natija ko‘rsatgani uchun berildi.
              </p>

              <div className="flex items-center justify-center gap-8 text-xs text-slate-600 pt-1">
                <div>
                  <span className="text-slate-400">To‘plangan ball:</span>{' '}
                  <strong className="text-rose-600 text-sm font-bold">{student.totalPoints} ball</strong>
                </div>
                <div>
                  <span className="text-slate-400">Davomat ko‘rsatkichi:</span>{' '}
                  <strong className="text-emerald-600 text-sm font-bold">{student.attendanceRate}%</strong>
                </div>
                <div>
                  <span className="text-slate-400">Guruh:</span>{' '}
                  <strong className="text-slate-800">{student.group}</strong>
                </div>
              </div>
            </div>

            {/* Footer Signatures, Gold Seal & QR Code */}
            <div className="relative pt-6 border-t border-rose-100 flex items-end justify-between px-4 pb-2">
              <div className="text-left space-y-1">
                <div className="w-44 border-b border-slate-400 pb-1">
                  <span className="text-xs font-serif italic text-slate-800 font-bold">
                    Bosh ustoz A. Xo‘jayeva
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Bosh Ustoz / Markaz Rahbari</p>
                <p className="text-[10px] text-slate-500 font-mono">Sana: {issueDate}</p>
              </div>

              {/* Rosette Gold Seal */}
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 via-amber-300 to-yellow-100 border-2 border-amber-600 shadow-md flex items-center justify-center text-center p-1">
                  <div className="w-full h-full rounded-full border border-dashed border-amber-800 flex flex-col items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-amber-900" />
                    <span className="text-[8px] font-bold text-amber-950 uppercase tracking-tighter">
                      TASDIQLANDI
                    </span>
                  </div>
                </div>
                <span className="text-[9px] font-mono text-slate-400 mt-1">№ {certNumber}</span>
              </div>

              {/* Verification & QR */}
              <div className="text-right flex items-center gap-2.5">
                <div className="text-right">
                  <p className="text-[10px] font-semibold text-slate-700">QR Haqiqiylik</p>
                  <p className="text-[9px] text-slate-400">shamsiyya.uz/verify</p>
                </div>
                <div className="p-1.5 border border-slate-200 rounded-md bg-white shadow-xs">
                  <QrCode className="w-8 h-8 text-slate-800" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
