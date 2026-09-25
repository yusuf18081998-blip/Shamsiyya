import React from 'react';
import { AuthUser } from '../types';
import { Shield, GraduationCap, Sparkles, LogOut } from 'lucide-react';
import shamsiyyaLogo from '../assets/images/shamsiyya_logo_emblem_1790347598348.jpg';

interface Props {
  currentUser: AuthUser;
  onLogout: () => void;
  activeStudentName: string;
}

export const Header: React.FC<Props> = ({
  currentUser,
  onLogout,
  activeStudentName,
}) => {
  const isAdmin = currentUser.role === 'admin';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={shamsiyyaLogo}
              alt="Shamsiyya Emblem"
              className="w-9 h-9 rounded-full object-cover border border-rose-200 shadow-xs"
            />
            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                Shamsiyya
              </span>
              <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider">
                CRM & LMS
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-arabic leading-none">
              مَرْكَزُ شَمْسِيَّة - كُورْس «GROW UP A1»
            </span>
          </div>
        </div>

        {/* Center Zone: Active Course Pill */}
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-600 bg-rose-50/70 py-1.5 px-3 rounded-lg border border-rose-100/80">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          <span className="font-semibold text-slate-800">Kurs: GROW UP A1</span>
          <span className="text-slate-300">|</span>
          <span className="text-rose-600 font-medium">290 000 so‘m / oy</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500">Manhaj A0 · A1 · Grammatika</span>
        </div>

        {/* Right Action Zone */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Role Status Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
              isAdmin
                ? 'bg-rose-50 text-rose-700 border-rose-200'
                : 'bg-purple-50 text-purple-700 border-purple-200'
            }`}
          >
            {isAdmin ? (
              <>
                <Shield className="w-3.5 h-3.5 text-rose-600" />
                <span>Bosh ustoz A.Xo‘jayeva</span>
              </>
            ) : (
              <>
                <GraduationCap className="w-3.5 h-3.5 text-purple-600" />
                <span className="truncate max-w-[120px]">{activeStudentName}</span>
              </>
            )}
          </div>

          {/* User profile avatar & Logout */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
            <button
              onClick={onLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 hover:border-red-200 border border-transparent rounded-lg transition-colors cursor-pointer"
              title="Tizimdan chiqish"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Chiqish</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
