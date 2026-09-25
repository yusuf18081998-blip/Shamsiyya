import React, { useState } from 'react';
import { Database, Server, Layout, ShieldCheck, X, Copy, Check } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const TechnicalArchitectureModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'db' | 'api' | 'security' | 'frontend'>('db');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const sqlSchemaCode = `-- ========================================================
-- "SHAMSIYYA" CRM & LMS - POSTGRESQL / RELATIONAL DATABASE SCHEMA
-- Kurs: GROW UP A1 (Narxi: 290 000 so'm)
-- ========================================================

-- 1. FOYDALANUVCHILAR VA ROLLARI (Users & Auth)
CREATE TYPE user_role AS ENUM ('super_admin', 'teacher', 'student');
CREATE TYPE payment_status AS ENUM ('paid', 'pending', 'debt');
CREATE TYPE attendance_type AS ENUM ('present', 'absent_reason', 'absent_no_reason', 'late');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'student',
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. GURUHLAR (Groups)
CREATE TABLE groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL, -- e.g. "GROW UP A1 - 1-Guruh"
    teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    lesson_time VARCHAR(50), -- e.g. "Dush-Chor-Jum 09:00"
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. KURSLAR VA MODULLAR (Courses & Curriculum)
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(150) NOT NULL DEFAULT 'GROW UP A1',
    description TEXT,
    price_uzs NUMERIC(12, 2) NOT NULL DEFAULT 290000.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Modullar: Manhaj A0, Manhaj A1, Grammatika
CREATE TABLE course_modules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL, -- 'manhaj_a0', 'manhaj_a1', 'grammar'
    title VARCHAR(150) NOT NULL,
    order_index INT NOT NULL
);

-- 4. DARSLAR (Lessons)
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    module_id UUID REFERENCES course_modules(id) ON DELETE CASCADE,
    lesson_number INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    arabic_title VARCHAR(250),
    description TEXT,
    content_markdown TEXT,
    audio_url TEXT,
    pdf_attachment_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TESTLAR VA SAVOLLAR (Quizzes & Questions)
CREATE TABLE quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    pass_score INT DEFAULT 70
);

CREATE TABLE quiz_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    arabic_snippet VARCHAR(255),
    options JSONB NOT NULL, -- ["A", "B", "C", "D"]
    correct_option_index INT NOT NULL,
    explanation TEXT,
    points INT DEFAULT 10
);

-- 6. MOLIYA VA TO'LOVLAR (Payments - STRICT ADMIN-ONLY MODIFICATION)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id),
    amount NUMERIC(12, 2) NOT NULL DEFAULT 290000.00,
    status payment_status NOT NULL DEFAULT 'debt', -- 'paid', 'pending', 'debt'
    payment_method VARCHAR(50), -- 'Payme', 'Click', 'Naqd', 'Bank'
    verified_by_admin_id UUID REFERENCES users(id),
    paid_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. DAVOMAT VA FAOLIYAT BALLARI (Attendance & Grading)
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status attendance_type NOT NULL DEFAULT 'present',
    marked_by UUID REFERENCES users(id)
);

CREATE TABLE student_grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    activity_points INT DEFAULT 0,
    quiz_points INT DEFAULT 0,
    total_points INT GENERATED ALWAYS AS (activity_points + quiz_points) STORED,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. SERTIFIKATLAR (Certificates)
CREATE TABLE certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    certificate_code VARCHAR(50) UNIQUE NOT NULL, -- 'SHM-2026-A1-001'
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id),
    issued_date DATE NOT NULL,
    final_score INT NOT NULL,
    pdf_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`;

  const mongoSchemaCode = `// ========================================================
// "SHAMSIYYA" CRM & LMS - MONGODB (MONGOOSE) SCHEMAS
// ========================================================

const mongoose = require('mongoose');

// 1. User & Student Schema
const UserSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true, unique: true },
  email: { type: String, sparse: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student'], default: 'student' },
  group: { type: String, default: 'GROW UP A1 - 1-Guruh' },
  // Faqat o'qituvchi/admin tomonidan yangilanuvchi ko'rsatkichlar:
  activityPoints: { type: Number, default: 0 },
  quizPoints: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  attendanceRate: { type: Number, default: 100 },
  certificateGranted: { type: Boolean, default: false },
  certificateId: { type: String }
}, { timestamps: true });

// 2. Payment Schema (Admin-Only Modifiable)
const PaymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: String, default: 'GROW UP A1' },
  amount: { type: Number, default: 290000 },
  status: { type: String, enum: ['paid', 'pending', 'debt'], default: 'debt' },
  paymentDate: { type: Date },
  paymentMethod: { type: String, enum: ['Payme', 'Click', 'Naqd', 'Bank'] },
  adminNotes: { type: String },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// 3. Lesson & Curriculum Schema
const LessonSchema = new mongoose.Schema({
  module: { type: String, enum: ['manhaj_a0', 'manhaj_a1', 'grammar'], required: true },
  lessonNumber: { type: Number, required: true },
  title: { type: String, required: true },
  arabicTitle: { type: String },
  duration: { type: String, default: '45 daqiqa' },
  description: { type: String },
  contentText: { type: String },
  arabicExamples: [{ arabic: String, transcription: String, translation: String }],
  resources: [{ name: String, type: String, size: String }],
  quiz: [{
    question: String,
    arabicSnippet: String,
    options: [String],
    correctIndex: Number,
    explanation: String,
    points: { type: Number, default: 10 }
  }]
}, { timestamps: true });

module.exports = {
  User: mongoose.model('User', UserSchema),
  Payment: mongoose.model('Payment', PaymentSchema),
  Lesson: mongoose.model('Lesson', LessonSchema)
};`;

  const apiEndpointsCode = `// ========================================================
// "SHAMSIYYA" REST API ENDPOINTS & ACCESS CONTROL MATRIX
// ========================================================

/*
  AUTHENTICATION:
  POST /api/auth/login            -> JWT token + User Info
  GET  /api/auth/me               -> Joriy foydalanuvchi ma'lumotlari

  STUDENT MANAGEMENT (CRM - Faqat Admin):
  GET    /api/admin/students      -> Barcha o'quvchilar ro'yxati + filtrlash
  POST   /api/admin/students      -> Yangi o'quvchi ro'yxatdan o'tkazish
  PUT    /api/admin/students/:id  -> Guruh, profil ma'lumotlarini yangilash
  DELETE /api/admin/students/:id  -> O'quvchini tizimdan o'chirish

  MOLIYA VA TO'LOVLAR (QAT'IY QOIDA: FACHAT ADMIN O'ZGARTIRADI):
  GET    /api/admin/payments/summary -> Jami tushum (290 000 so'mdan), kutilayotgan, qarzdorlik
  GET    /api/admin/payments/debtors -> Qarzdorlar ro'yxati (filtrlangan)
  PATCH  /api/admin/payments/:id     -> To'lov statusini o'zgartirish (paid, pending, debt)
  
  O'QUVCHI MOLIYA KO'RINISHI (FAQAT READ-ONLY):
  GET    /api/student/my-payment     -> O'zining to'lov holati (To'langan yoki Qarzdor).
                                        HECH QANDAY O'ZGARTIRISH IMKONI YO'Q!

  BAHOLASH VA DAVOMAT:
  POST   /api/admin/grades/add-points -> O'quvchiga faollik bali berish (+5, +10, +15)
  POST   /api/admin/attendance        -> Davomatni belgilash (Keldi, Sababli, Sababsiz, Kechikdi)
  GET    /api/grades/leaderboard      -> Oylik top-o'quvchilar reytingi

  LMS (DARSLAR VA TESTLAR):
  GET    /api/lessons                 -> Barcha modullar (Manhaj A0, A1, Grammatika)
  POST   /api/lessons                 -> [Admin] Yangi dars qo'shish
  POST   /api/quiz/submit             -> [Student] Test topshirish va natijani hisoblash

  SERTIFIKATLAR:
  POST   /api/admin/certificates/grant   -> [Admin] O'quvchiga sertifikat berish
  GET    /api/student/my-certificate     -> [Student] Sertifikatni ko'rish/PDF yuklash
*/`;

  const securityMiddlewareCode = `// ========================================================
// EXPRESS JS DA ROLE-BASED ACCESS CONTROL (RBAC) MANTIG'I
// ========================================================

const jwt = require('jsonwebtoken');

// 1. JWT Tokenni tekshirish
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "Avtorizatsiyadan o'tilmagan!" });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role, fullName, group }
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token yaroqsiz yoki muddati o'tgan!" });
  }
};

// 2. Faqat Admin huquqini talab qiluvchi Middleware
// (Moliya statusini o'zgartirish, ball qo'yish, o'quvchi o'chirish uchun)
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      error: "Ruxsat etilmagan!",
      message: "Ushbu amalni faqat 'Shamsiyya' ma'muriyati (Admin) bajara oladi."
    });
  }
  next();
};

// 3. TO'LOV XAVFSIZLIGI CONTROLLER NAMUNASI:
// O'quvchi API orqali soxta to'lov yubora olmasligi qat'iy kafolatlanadi
app.patch('/api/admin/payments/:studentId/status', verifyToken, requireAdmin, async (req, res) => {
  const { studentId } = req.params;
  const { newStatus, method, note } = req.body;
  
  // Faqat 'paid', 'pending', 'debt' qiymatlari qabul qilinadi
  const payment = await Payment.findOneAndUpdate(
    { student: studentId },
    { 
      status: newStatus,
      paymentMethod: method,
      adminNotes: note,
      verifiedBy: req.user.id,
      paidAt: newStatus === 'paid' ? new Date() : null
    },
    { new: true }
  );

  return res.json({ success: true, message: "To'lov holati Admin tomonidan muvaffaqiyatli yangilandi", payment });
});`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-rose-100 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-rose-100 bg-rose-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center shadow-xs">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Shamsiyya CRM & LMS — Tizim Arxitekturasi va Texnik Hujjatlar
              </h2>
              <p className="text-xs text-slate-500">
                PostgreSQL SQL DDL, Mongoose Schemas, REST API, RBAC xavfsizlik va Frontend tavsiyalari
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex items-center border-b border-slate-200 px-6 gap-2 bg-slate-50/60">
          <button
            onClick={() => setActiveTab('db')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'db'
                ? 'border-rose-500 text-rose-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Database className="w-4 h-4" />
            1. Ma'lumotlar Bazasi (SQL & MongoDB)
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'api'
                ? 'border-rose-500 text-rose-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Server className="w-4 h-4" />
            2. REST API Endpointlar
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'security'
                ? 'border-rose-500 text-rose-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            3. RBAC & To'lov Xavfsizligi
          </button>
          <button
            onClick={() => setActiveTab('frontend')}
            className={`flex items-center gap-2 py-3 px-4 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'frontend'
                ? 'border-rose-500 text-rose-600 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layout className="w-4 h-4" />
            4. Frontend UI/UX Tavsiyalari
          </button>
        </div>

        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm">
          {activeTab === 'db' && (
            <div className="space-y-6">
              <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 flex items-start gap-3">
                <Database className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <p className="font-semibold text-slate-900 mb-1">
                    Relatsion (PostgreSQL) va NoSQL (MongoDB) modellar arxitekturasi:
                  </p>
                  O'quvchilar, Kurslar («GROW UP A1» - 290 000 so'm), Modullar (Manhaj A0, Manhaj A1, Grammatika), Darslar, Testlar, Davomat va <strong>Faqat Admin boshqaruvidagi Moliya jadvali</strong> o'rtasidagi bog'liqliklar to'liq ishlab chiqilgan.
                </div>
              </div>

              {/* PostgreSQL DDL */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                    PostgreSQL DDL Jadval Strukturasi (SQL):
                  </span>
                  <button
                    onClick={() => copyToClipboard(sqlSchemaCode, 'sql')}
                    className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium"
                  >
                    {copiedKey === 'sql' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'sql' ? 'Nusxa olindi!' : "SQL nusxalash"}
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl overflow-x-auto text-xs font-mono leading-relaxed border border-slate-800 max-h-72">
                  {sqlSchemaCode}
                </pre>
              </div>

              {/* MongoDB Mongoose */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800 text-xs flex items-center gap-1.5">
                    MongoDB (Mongoose Schema Models):
                  </span>
                  <button
                    onClick={() => copyToClipboard(mongoSchemaCode, 'mongo')}
                    className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium"
                  >
                    {copiedKey === 'mongo' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'mongo' ? 'Nusxa olindi!' : "Mongoose nusxalash"}
                  </button>
                </div>
                <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl overflow-x-auto text-xs font-mono leading-relaxed border border-slate-800 max-h-64">
                  {mongoSchemaCode}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              <div className="bg-rose-50/50 p-4 rounded-xl border border-rose-100 flex items-start gap-3">
                <Server className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <p className="font-semibold text-slate-900 mb-1">
                    REST API Marshrutlar & Ruxsat darajalari
                  </p>
                  Barcha endpointlar autentifikatsiya qilingan JWT tokeni bilan himoyalanadi. Moliya va o'quvchilar tahririga doir barcha endpointlar <code>requireAdmin</code> middleware orqali himoyalanadi.
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 text-xs">
                  API Marshrutlar Matritsasi:
                </span>
                <button
                  onClick={() => copyToClipboard(apiEndpointsCode, 'api')}
                  className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium"
                >
                  {copiedKey === 'api' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'api' ? 'Nusxa olindi!' : "API nusxalash"}
                </button>
              </div>
              <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl overflow-x-auto text-xs font-mono leading-relaxed border border-slate-800 max-h-96">
                {apiEndpointsCode}
              </pre>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-900">
                  <p className="font-bold text-amber-950 mb-1">
                    Qat'iy Talab: O'quvchi to'lov statusini o'zgartira olmaslik kafolati
                  </p>
                  O'quvchi panelida hech qanday to'lovni tasdiqlash yoki «To'ladim» tugmasi mavjud emas. Backend darajasida to'lov holatini o'zgartirish <code>requireAdmin</code> middleware tomonidan qat'iy nazorat qilinadi.
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-800 text-xs">
                  Express.js RBAC & To'lov Nazorati Kodu:
                </span>
                <button
                  onClick={() => copyToClipboard(securityMiddlewareCode, 'sec')}
                  className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium"
                >
                  {copiedKey === 'sec' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'sec' ? 'Nusxa olindi!' : "Kodni nusxalash"}
                </button>
              </div>
              <pre className="p-4 bg-slate-950 text-slate-200 rounded-xl overflow-x-auto text-xs font-mono leading-relaxed border border-slate-800 max-h-96">
                {securityMiddlewareCode}
              </pre>
            </div>
          )}

          {activeTab === 'frontend' && (
            <div className="space-y-4 text-xs text-slate-700 leading-relaxed">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-rose-100 bg-white">
                  <h4 className="font-bold text-slate-900 mb-2 text-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    Ranglar Palitrasi (Pink & Rose)
                  </h4>
                  <ul className="space-y-1.5 text-slate-600">
                    <li>• Asosiy pushti: <code className="text-rose-600 bg-rose-50 px-1 py-0.5 rounded">#EC4899 (rose-500)</code></li>
                    <li>• Oq va och pushti fon: <code className="text-rose-600 bg-rose-50 px-1 py-0.5 rounded">#FFFDFE, #FDF2F8 (bg-rose-50/50)</code></li>
                    <li>• Urg'ular: Oltin / Amber <code className="text-amber-600 bg-amber-50 px-1 py-0.5 rounded">#F59E0B (amber-500)</code> va Mayin Binafsha</li>
                    <li>• Tipografiya: <em>Plus Jakarta Sans</em> (tizim uchun) va <em>Amiri</em> (arabcha xattotlik va jumlalar uchun).</li>
                  </ul>
                </div>

                <div className="p-4 rounded-xl border border-rose-100 bg-white">
                  <h4 className="font-bold text-slate-900 mb-2 text-sm flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    Rolga oid Panellar Taqqoslami
                  </h4>
                  <ul className="space-y-1.5 text-slate-600">
                    <li>• <strong>Admin:</strong> O'quvchilar CRM, to'lov holatlarini (290 000 so'm) o'zgartirish, qarzdorlar filtri, davomat va ballar qo'yish, darslar va sertifikat berish.</li>
                    <li>• <strong>Student:</strong> Read-only to'lov statusi, 3 modul darslari (Manhaj A0, Manhaj A1, Grammatika), interaktiv test topshirish, reyting va sertifikat yuklab olish.</li>
                  </ul>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50">
                <h4 className="font-bold text-slate-900 mb-1">Frontend Loyiha Fayl Strukturasi:</h4>
                <pre className="p-3 bg-white text-slate-800 rounded-lg text-xs font-mono border border-slate-200">
{`src/
├── assets/images/       # Shamsiyya logotip, kurs rasmlari, sertifikat foni
├── components/
│   ├── Header.tsx       # Top Bar, Rol almashtirgich, profil
│   ├── CertificateModal.tsx  # Nafis Shamsiyya sertifikati (Print/PDF)
│   ├── TechnicalArchitectureModal.tsx # Ushbu tizim arxitekturasi
│   ├── admin/
│   │   ├── AdminDashboard.tsx   # Asosiy admin boshqaruv paneli
│   │   ├── StudentsCRM.tsx      # Lidlar va o'quvchilar jadvali
│   │   ├── FinanceModule.tsx    # To'lovlar (290 000 so'm), qarzdorlar
│   │   ├── ContentManagement.tsx# Manhaj A0/A1, Grammatika darslari
│   │   └── AttendanceGrading.tsx# Davomat va raqamli ballar jurnali
│   └── student/
│       ├── StudentDashboard.tsx # O'quvchi shaxsiy kabineti
│       ├── StudentFinance.tsx   # READ-ONLY to'lov ko'rinishi
│       ├── CourseViewer.tsx     # Manhaj A0, A1, Grammatika darslari
│       ├── InteractiveQuiz.tsx  # Dars testlari va avtomatik ball
│       └── StudentLeaderboard.tsx# Reyting va sertifikat bo'limi
├── data/
│   └── initialData.ts   # Kurs darslari, o'quvchilar, savollar
├── types/
│   └── index.ts         # TypeScript interfeyslari
└── App.tsx              # Asosiy holat (State) va router/rol boshqaruvi`}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
          <span>«Shamsiyya» Ayollar Arab Tili Markazi LMS Arxitekturasi</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
};
