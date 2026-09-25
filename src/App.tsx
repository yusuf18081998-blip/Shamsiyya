import { useState, useEffect } from 'react';
import { Student, Lesson, AttendanceRecord, PaymentStatus, AuthUser } from './types';
import { INITIAL_STUDENTS, INITIAL_LESSONS, INITIAL_ATTENDANCE } from './data/initialData';
import { Header } from './components/Header';
import { LoginScreen } from './components/auth/LoginScreen';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { StudentDashboard } from './components/student/StudentDashboard';
import { CertificateModal } from './components/CertificateModal';
import { Shield, Eye } from 'lucide-react';
import { api } from './services/api';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('shamsiyya_auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Admin Preview Mode State (Only when logged in as admin to test student perspective)
  const [adminViewMode, setAdminViewMode] = useState<'admin' | 'student_preview'>('admin');

  // Persistence State - Fresh production initialization
  const [students, setStudents] = useState<Student[]>(() => {
    // Clear out any old prototype mock data from previous sessions
    localStorage.removeItem('shamsiyya_students');
    const saved = localStorage.getItem('shamsiyya_students_prod');
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = localStorage.getItem('shamsiyya_lessons_prod');
    return saved ? JSON.parse(saved) : INITIAL_LESSONS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    localStorage.removeItem('shamsiyya_attendance');
    const saved = localStorage.getItem('shamsiyya_attendance_prod');
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  // Current active student for Student Panel
  const [selectedStudentId, setSelectedStudentId] = useState<string>(() => {
    return students[0]?.id || '';
  });

  // Certificate Modal State
  const [certificateStudent, setCertificateStudent] = useState<Student | null>(null);
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);

  // Sync Auth with LocalStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('shamsiyya_auth_user', JSON.stringify(currentUser));
      if (currentUser.role === 'student' && currentUser.studentId) {
        setSelectedStudentId(currentUser.studentId);
      }
    } else {
      localStorage.removeItem('shamsiyya_auth_user');
    }
  }, [currentUser]);

  // Sync Data with LocalStorage
  useEffect(() => {
    localStorage.setItem('shamsiyya_students_prod', JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem('shamsiyya_lessons_prod', JSON.stringify(lessons));
  }, [lessons]);

  useEffect(() => {
    localStorage.setItem('shamsiyya_attendance_prod', JSON.stringify(attendance));
  }, [attendance]);

  // Sync with Backend Server on Mount
  useEffect(() => {
    async function loadServerData() {
      try {
        const [serverStudents, serverAttendance] = await Promise.all([
          api.getStudents(),
          api.getAttendance(),
        ]);
        if (serverStudents && Array.isArray(serverStudents) && serverStudents.length > 0) {
          setStudents(serverStudents);
        }
        if (serverAttendance && Array.isArray(serverAttendance) && serverAttendance.length > 0) {
          setAttendance(serverAttendance);
        }
      } catch (e) {
        console.warn('Server offline, using cached local data');
      }
    }
    loadServerData();
  }, []);

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    if (user.role === 'student' && user.studentId) {
      setSelectedStudentId(user.studentId);
    }
    setAdminViewMode('admin');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setAdminViewMode('admin');
  };

  // Determine current active student:
  const activeStudent =
    currentUser?.role === 'student'
      ? students.find((s) => s.id === currentUser.studentId) || null
      : students.find((s) => s.id === selectedStudentId) || students[0] || null;

  // Actions for Admin with Backend Sync
  const handleAddStudent = async (
    newStdData: Omit<Student, 'id' | 'totalPoints' | 'activityPoints' | 'quizPoints' | 'attendanceRate' | 'certificateGranted'>
  ) => {
    const newStudent: Student = {
      ...newStdData,
      id: `std-${Date.now()}`,
      username: newStdData.username || newStdData.fullName.toLowerCase().split(' ')[0],
      password: newStdData.password || '123456',
      totalPoints: 0,
      activityPoints: 0,
      quizPoints: 0,
      attendanceRate: 100,
      certificateGranted: false,
    };
    setStudents((prev) => [newStudent, ...prev]);
    if (!selectedStudentId) {
      setSelectedStudentId(newStudent.id);
    }
    // Async save to server
    api.addStudent(newStudent);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    api.updateStudent(updatedStudent);
  };

  const handleDeleteStudent = (id: string) => {
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (selectedStudentId === id) {
      const remaining = students.filter((s) => s.id !== id);
      setSelectedStudentId(remaining[0]?.id || '');
    }
    api.deleteStudent(id);
  };

  const handleUpdatePayment = (
    studentId: string,
    status: PaymentStatus,
    method?: string,
    note?: string
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            paymentStatus: status,
            paymentMethod: method ? (method as any) : s.paymentMethod,
            paymentNote: note !== undefined ? note : s.paymentNote,
            paymentDate: status === 'paid' ? new Date().toISOString().split('T')[0] : s.paymentDate,
          };
        }
        return s;
      })
    );
    api.updatePayment(studentId, status, method, note);
  };

  const handleAddAttendance = (record: Omit<AttendanceRecord, 'id'>) => {
    const newRecord: AttendanceRecord = {
      ...record,
      id: `att-${Date.now()}`,
    };
    setAttendance((prev) => [newRecord, ...prev]);

    const studentRecords = [...attendance, newRecord].filter((a) => a.studentId === record.studentId);
    const presentRecords = studentRecords.filter(
      (a) => a.status === 'present' || a.status === 'late'
    );
    const rate = Math.round((presentRecords.length / Math.max(studentRecords.length, 1)) * 100);

    setStudents((prev) =>
      prev.map((s) => (s.id === record.studentId ? { ...s, attendanceRate: rate } : s))
    );
    api.addAttendance(record);
  };

  const handleAddPoints = (studentId: string, points: number, reason: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          const newAct = s.activityPoints + points;
          const newTotal = newAct + s.quizPoints;
          const shouldGrantCert = newTotal >= 90;
          return {
            ...s,
            activityPoints: newAct,
            totalPoints: newTotal,
            certificateGranted: s.certificateGranted || shouldGrantCert,
            certificateId: s.certificateId || (shouldGrantCert ? `SHM-2026-A1-${s.id.replace('std-', '00')}` : undefined),
            certificateDate: s.certificateDate || (shouldGrantCert ? new Date().toISOString().split('T')[0] : undefined),
          };
        }
        return s;
      })
    );
    api.givePoints(studentId, points, reason);
  };

  const handleAddLesson = (newLessonData: Omit<Lesson, 'id'>) => {
    const newLesson: Lesson = {
      ...newLessonData,
      id: `les-${Date.now()}`,
    };
    setLessons((prev) => [...prev, newLesson]);
  };

  const handleUpdateLesson = (updatedLesson: Lesson) => {
    setLessons((prev) =>
      prev.map((l) => (l.id === updatedLesson.id ? updatedLesson : l))
    );
  };

  const handleGrantCertificate = (studentId: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === studentId) {
          return {
            ...s,
            certificateGranted: true,
            certificateId: s.certificateId || `SHM-2026-A1-${s.id.replace('std-', '00')}`,
            certificateDate: new Date().toISOString().split('T')[0],
          };
        }
        return s;
      })
    );
  };

  const handleViewCertificate = (student: Student) => {
    setCertificateStudent(student);
    setIsCertModalOpen(true);
  };

  // Actions for Student
  const handleQuizCompleted = (earnedPoints: number) => {
    if (!activeStudent) return;
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === activeStudent.id) {
          const newQuiz = s.quizPoints + earnedPoints;
          const newTotal = s.activityPoints + newQuiz;
          const shouldGrant = newTotal >= 90;
          return {
            ...s,
            quizPoints: newQuiz,
            totalPoints: newTotal,
            certificateGranted: s.certificateGranted || shouldGrant,
            certificateId: s.certificateId || (shouldGrant ? `SHM-2026-A1-${s.id.replace('std-', '00')}` : undefined),
            certificateDate: s.certificateDate || (shouldGrant ? new Date().toISOString().split('T')[0] : undefined),
          };
        }
        return s;
      })
    );
  };

  // If NOT Logged In, Render Unified Clean Login Screen
  if (!currentUser) {
    return (
      <LoginScreen
        students={students}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  const isAdmin = currentUser.role === 'admin';

  return (
    <div className="min-h-screen bg-[#FFFDFE] flex flex-col text-slate-800">
      {/* Top Header with User Info & Logout */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        activeStudentName={activeStudent?.fullName || 'O‘quvchi'}
      />

      {/* Sub-Bar / Course Context Banner */}
      <div className="bg-gradient-to-r from-rose-50/80 via-pink-50/50 to-rose-50/80 border-b border-rose-100 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-arabic text-rose-600 font-bold text-base">شمسية</span>
            <span className="font-bold text-slate-900">«Shamsiyya» Ayollar Arab Tili Markazi</span>
            <span className="text-slate-300">·</span>
            <span className="text-slate-600">
              Kurs: <strong className="text-rose-600">GROW UP A1</strong> (290 000 so‘m/oy)
            </span>
          </div>

          {/* If Student is Logged In: Strict Read-Only Notice */}
          {!isAdmin && activeStudent && (
            <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-xl border border-rose-200 text-slate-700 shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>O‘quvchi kabineti: <strong>{activeStudent.fullName}</strong></span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 font-medium">To‘lov va ballar faqat ko‘rish rejimida</span>
            </div>
          )}

          {/* If Admin is Logged In: Admin View Controls */}
          {isAdmin && (
            <div className="flex items-center gap-2 flex-wrap">
              <div className="flex items-center p-0.5 bg-white rounded-lg border border-rose-200 shadow-2xs">
                <button
                  onClick={() => setAdminViewMode('admin')}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    adminViewMode === 'admin'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Admin Boshqaruvi</span>
                </button>
                {students.length > 0 && (
                  <button
                    onClick={() => setAdminViewMode('student_preview')}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                      adminViewMode === 'student_preview'
                        ? 'bg-rose-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>O‘quvchi Ko‘rinishi (Test)</span>
                  </button>
                )}
              </div>

              {adminViewMode === 'student_preview' && students.length > 0 && (
                <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-xs">
                  <span className="text-slate-400">O‘quvchi:</span>
                  <select
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="font-semibold text-rose-700 bg-transparent focus:outline-hidden cursor-pointer"
                  >
                    {students.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.paymentStatus === 'paid' ? 'To‘langan' : 'Qarzdor'})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {isAdmin && adminViewMode === 'admin' ? (
          <AdminDashboard
            students={students}
            lessons={lessons}
            attendance={attendance}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onDeleteStudent={handleDeleteStudent}
            onUpdatePayment={handleUpdatePayment}
            onAddAttendance={handleAddAttendance}
            onAddPoints={handleAddPoints}
            onAddLesson={handleAddLesson}
            onUpdateLesson={handleUpdateLesson}
            onGrantCertificate={handleGrantCertificate}
            onViewCertificate={handleViewCertificate}
          />
        ) : activeStudent ? (
          <StudentDashboard
            currentStudent={activeStudent}
            allStudents={students}
            lessons={lessons}
            onQuizCompleted={handleQuizCompleted}
            onViewCertificate={handleViewCertificate}
          />
        ) : (
          <div className="bg-white rounded-3xl border border-rose-100 p-12 text-center shadow-xs max-w-md mx-auto my-12">
            <h3 className="font-bold text-slate-800 text-base mb-1">O‘quvchi ma'lumotlari topilmadi</h3>
            <p className="text-xs text-slate-500 mb-4">Hozircha tizimga o‘quvchilar kiritilmagan.</p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-rose-100 py-6 text-xs text-slate-400 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Shamsiyya CRM & LMS</span>
            <span>·</span>
            <span>«GROW UP A1» kursi dasturi: Manhaj A0, Manhaj A1, Grammatika</span>
          </div>

          <div className="text-slate-400">
            <span>Barcha huquqlar himoyalangan © 2026</span>
          </div>
        </div>
      </footer>

      {/* Certificate Modal */}
      <CertificateModal
        student={certificateStudent}
        isOpen={isCertModalOpen}
        onClose={() => setIsCertModalOpen(false)}
      />
    </div>
  );
}
