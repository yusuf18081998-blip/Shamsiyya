import { Student, AttendanceRecord, PaymentStatus, AuthUser } from '../types';

export const api = {
  // Check server health
  async checkStatus() {
    try {
      const res = await fetch('/api/status');
      return await res.json();
    } catch {
      return { status: 'offline' };
    }
  },

  // Auth
  async login(login: string, password: string): Promise<{ success: boolean; user?: AuthUser; token?: string; message?: string }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
      });
      return await res.json();
    } catch (e) {
      // Fallback
      if (login.trim().toLowerCase() === 'admin' && password === 'admin') {
        return {
          success: true,
          user: {
            id: 'admin-master',
            role: 'admin',
            fullName: 'Bosh ustoz A.Xo‘jayeva',
            username: 'admin',
          },
          token: 'fallback_admin_token',
        };
      }
      return { success: false, message: 'Serverga ulanishda xatolik yuz berdi' };
    }
  },

  // Students
  async getStudents(): Promise<Student[]> {
    try {
      const res = await fetch('/api/students');
      if (res.ok) return await res.json();
      return [];
    } catch {
      return [];
    }
  },

  async addStudent(studentData: any): Promise<Student | null> {
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentData),
      });
      if (res.ok) return await res.json();
      return null;
    } catch {
      return null;
    }
  },

  async updateStudent(student: Student): Promise<Student | null> {
    try {
      const res = await fetch(`/api/students/${student.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
      });
      if (res.ok) return await res.json();
      return null;
    } catch {
      return null;
    }
  },

  async deleteStudent(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Payments
  async updatePayment(studentId: string, status: PaymentStatus, method?: string, note?: string) {
    try {
      const res = await fetch(`/api/payments/${studentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, method, note }),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Attendance
  async getAttendance(): Promise<AttendanceRecord[]> {
    try {
      const res = await fetch('/api/attendance');
      if (res.ok) return await res.json();
      return [];
    } catch {
      return [];
    }
  },

  async addAttendance(record: Omit<AttendanceRecord, 'id'>) {
    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });
      return await res.json();
    } catch {
      return null;
    }
  },

  // Points
  async givePoints(studentId: string, points: number, reason: string) {
    try {
      const res = await fetch('/api/points', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, points, reason }),
      });
      return await res.json();
    } catch {
      return null;
    }
  },
};
