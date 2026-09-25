import React, { useState } from 'react';
import { AuthUser, Student } from '../../types';
import {
  Lock,
  User,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Eye,
  EyeOff,
  ShieldCheck
} from 'lucide-react';
import shamsiyyaLogo from '../../assets/images/shamsiyya_logo_emblem_1790347598348.jpg';

interface Props {
  students: Student[];
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginScreen: React.FC<Props> = ({
  students,
  onLoginSuccess,
}) => {
  const [loginInput, setLoginInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status & Error
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const cleanLogin = loginInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    if (!cleanLogin || !cleanPass) {
      setErrorMessage("Iltimos, login va parolni kiriting.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // 1. Check Admin Credentials (admin / admin)
      if (cleanLogin === 'admin' && cleanPass === 'admin') {
        setSuccessMessage("Muvaffaqiyatli kirildi! Boshqaruv paneli yuklanmoqda...");
        setTimeout(() => {
          onLoginSuccess({
            id: 'admin-master',
            role: 'admin',
            fullName: 'Bosh ustoz A.Xo‘jayeva',
            username: 'admin',
          });
        }, 350);
        return;
      }

      // 2. Check Student Credentials from CRM database
      const matchedStudent = students.find((s) => {
        const matchUsername = s.username && s.username.toLowerCase() === cleanLogin;
        const matchPhone = s.phone && s.phone.replace(/\D/g, '') === cleanLogin.replace(/\D/g, '');
        const matchEmail = s.email && s.email.toLowerCase() === cleanLogin;
        return matchUsername || matchPhone || matchEmail;
      });

      if (matchedStudent) {
        const studentPassword = matchedStudent.password || '123456';
        if (cleanPass === studentPassword) {
          setSuccessMessage(`Xush kelibsiz, ${matchedStudent.fullName}! Kabinet yuklanmoqda...`);
          setTimeout(() => {
            onLoginSuccess({
              id: matchedStudent.id,
              role: 'student',
              fullName: matchedStudent.fullName,
              username: matchedStudent.username || matchedStudent.phone,
              phone: matchedStudent.phone,
              studentId: matchedStudent.id,
            });
          }, 350);
          return;
        }
      }

      // 3. Fallback: Invalid credentials
      setIsLoading(false);
      setErrorMessage("Login yoki parol noto‘g‘ri kiritildi. Iltimos, qaytadan tekshirib ko‘ring.");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-radial from-rose-100/40 via-[#FFFDFE] to-rose-50/60 flex flex-col justify-between p-4 sm:p-6 lg:p-8">
      {/* Top Brand Header */}
      <div className="max-w-6xl w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-rose-200 shadow-xs">
            <img
              src={shamsiyyaLogo}
              alt="Shamsiyya"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="font-extrabold text-slate-900 text-base tracking-tight flex items-center gap-1.5">
              <span>Shamsiyya</span>
              <span className="text-[10px] uppercase font-bold text-rose-600 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded">
                CRM & LMS
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-arabic leading-none">
              مَرْكَزُ شَمْسِيَّة لِتَعْلِيمِ اللُّغَةِ العَرَبِيَّة
            </div>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          Kurs: <span className="font-bold text-rose-600">GROW UP A1</span>
        </div>
      </div>

      {/* Main Login Card - Unified, Professional, Confidential */}
      <div className="max-w-md w-full mx-auto my-8">
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-rose-100 shadow-xl overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-rose-500 via-pink-600 to-rose-700 p-7 text-white text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

            <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white p-1 shadow-lg ring-4 ring-white/30">
              <img
                src={shamsiyyaLogo}
                alt="Shamsiyya Emblem"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <h1 className="text-xl font-bold tracking-tight">«Shamsiyya» O‘quv Markazi</h1>
            <p className="text-xs text-rose-100 font-arabic mt-1 text-lg">
              مَرْكَزُ شَمْسِيَّة - كُورْس «GROW UP A1»
            </p>
            <div className="inline-flex items-center gap-1.5 bg-black/20 text-white/95 px-3 py-0.5 rounded-full text-[11px] font-medium mt-2 backdrop-blur-xs">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Yagona Tizimga Kirish</span>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-7">
            {/* Feedback Notifications */}
            {errorMessage && (
              <div className="mb-4 p-3.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2.5 animate-shake">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-700 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Login Field */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Login yoki Telefon Raqam:
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    placeholder="Login yoki telefon raqamingizni kiriting"
                    className="w-full pl-10 pr-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Parol:
                  </label>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-11 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:border-rose-400 focus:ring-2 focus:ring-rose-100 transition-all placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-rose-600 focus:ring-rose-400 border-slate-300 w-4 h-4"
                  />
                  <span>Eslab qolish</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  Xavfsiz ulanish (SSL)
                </span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 via-pink-600 to-rose-600 hover:from-rose-600 hover:via-pink-700 hover:to-rose-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-rose-200 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 active:scale-[0.99] mt-2"
              >
                <span>{isLoading ? 'Tekshirilmoqda...' : 'Tizimga Kirish'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="max-w-md w-full mx-auto text-center text-xs text-slate-400 space-y-1">
        <p className="font-semibold text-slate-600">«Shamsiyya» Ayollar Arab Tili Markazi</p>
        <p className="text-[11px]">
          Barcha huquqlar himoyalangan © 2026 · Toshkent
        </p>
      </div>
    </div>
  );
};
