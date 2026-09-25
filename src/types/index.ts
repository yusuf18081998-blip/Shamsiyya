export type UserRole = 'admin' | 'student';

export type PaymentStatus = 'paid' | 'pending' | 'debt';

export interface AuthUser {
  id: string;
  role: UserRole;
  fullName: string;
  username: string;
  phone?: string;
  studentId?: string;
}

export interface Student {
  id: string;
  fullName: string;
  username?: string;
  password?: string;
  phone: string;
  email: string;
  group: string;
  enrollmentDate: string;
  status: 'active' | 'graduated' | 'paused';
  paymentStatus: PaymentStatus;
  paymentAmount: number; // 290 000 UZS standard for GROW UP A1
  paymentDate?: string;
  paymentMethod?: 'Naqd' | 'Payme' | 'Click' | 'Bank';
  paymentNote?: string;
  totalPoints: number;
  activityPoints: number;
  quizPoints: number;
  attendanceRate: number; // percentage
  certificateGranted: boolean;
  certificateId?: string;
  certificateDate?: string;
  avatar?: string;
}

export type CourseModuleType = 'manhaj_a0' | 'manhaj_a1' | 'grammar';

export interface QuizQuestion {
  id: string;
  question: string;
  arabicSnippet?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points: number;
}

export interface LessonExample {
  arabic: string;
  transcription: string;
  translation: string;
}

export interface LessonResource {
  name: string;
  type: 'pdf' | 'audio' | 'vocab';
  size: string;
}

export interface Lesson {
  id: string;
  module: CourseModuleType;
  number: number;
  title: string;
  arabicTitle: string;
  duration: string;
  description: string;
  contentText: string;
  arabicExamples: LessonExample[];
  resources: LessonResource[];
  quiz: QuizQuestion[];
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  lessonNumber: number;
  date: string;
  status: 'present' | 'absent_reason' | 'absent_no_reason' | 'late';
}

export interface ActivityScoreRecord {
  id: string;
  studentId: string;
  studentName: string;
  points: number;
  reason: string;
  date: string;
}

export interface QuizAttempt {
  studentId: string;
  lessonId: string;
  score: number;
  maxScore: number;
  passed: boolean;
  date: string;
}
