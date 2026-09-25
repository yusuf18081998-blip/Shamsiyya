import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'data', 'db.json');

// Ensure database file exists
function readDatabase() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      const initial = {
        admin: {
          id: "admin-master",
          role: "admin",
          fullName: "Bosh ustoz A.Xo‘jayeva",
          username: "admin",
          title: "Bosh Ustoz va Markaz Rahbari"
        },
        course: {
          title: "GROW UP A1",
          price: 290000,
          currency: "UZS"
        },
        students: [],
        attendance: []
      };
      fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
      fs.writeFileSync(DB_PATH, JSON.stringify(initial, null, 2), 'utf-8');
      return initial;
    }
    const data = fs.readFileSync(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database:', err);
    return { students: [], attendance: [] };
  }
}

function writeDatabase(data: any) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database:', err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // ==========================================
  // API ROUTES
  // ==========================================

  // 1. Check Server Status
  app.get('/api/status', (req: Request, res: Response) => {
    const db = readDatabase();
    res.json({
      status: 'online',
      server: 'Shamsiyya CRM & LMS Server',
      chiefTeacher: "Bosh ustoz A.Xo‘jayeva",
      course: "GROW UP A1 (290 000 so‘m)",
      studentsCount: db.students.length,
      uptime: process.uptime(),
    });
  });

  // 2. Authentication Route
  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { login, password } = req.body;
    const cleanLogin = (login || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    // Admin Authentication: Bosh ustoz A.Xo'jayeva
    if (cleanLogin === 'admin' && cleanPass === 'admin') {
      return res.json({
        success: true,
        user: {
          id: 'admin-master',
          role: 'admin',
          fullName: 'Bosh ustoz A.Xo‘jayeva',
          username: 'admin',
          title: 'Bosh Ustoz va Markaz Rahbari'
        },
        token: `shm_jwt_admin_${Date.now()}`
      });
    }

    // Student Authentication
    const db = readDatabase();
    const student = db.students.find((s: any) => {
      const matchUsername = s.username && s.username.toLowerCase() === cleanLogin;
      const matchPhone = s.phone && s.phone.replace(/\D/g, '') === cleanLogin.replace(/\D/g, '');
      const matchEmail = s.email && s.email.toLowerCase() === cleanLogin;
      return matchUsername || matchPhone || matchEmail;
    });

    if (student) {
      const studentPass = student.password || '123456';
      if (cleanPass === studentPass) {
        return res.json({
          success: true,
          user: {
            id: student.id,
            role: 'student',
            fullName: student.fullName,
            username: student.username || student.phone,
            phone: student.phone,
            studentId: student.id
          },
          token: `shm_jwt_student_${Date.now()}`
        });
      }
    }

    return res.status(401).json({
      success: false,
      message: 'Login yoki parol noto‘g‘ri kiritildi!'
    });
  });

  // 3. Students CRUD
  app.get('/api/students', (req: Request, res: Response) => {
    const db = readDatabase();
    res.json(db.students);
  });

  app.post('/api/students', (req: Request, res: Response) => {
    const db = readDatabase();
    const newStudent = {
      ...req.body,
      id: req.body.id || `std-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    db.students.unshift(newStudent);
    writeDatabase(db);
    res.status(201).json(newStudent);
  });

  app.put('/api/students/:id', (req: Request, res: Response) => {
    const db = readDatabase();
    const { id } = req.params;
    const index = db.students.findIndex((s: any) => s.id === id);
    if (index !== -1) {
      db.students[index] = { ...db.students[index], ...req.body };
      writeDatabase(db);
      return res.json(db.students[index]);
    }
    return res.status(404).json({ error: 'O‘quvchi topilmadi' });
  });

  app.delete('/api/students/:id', (req: Request, res: Response) => {
    const db = readDatabase();
    const { id } = req.params;
    db.students = db.students.filter((s: any) => s.id !== id);
    db.attendance = db.attendance.filter((a: any) => a.studentId !== id);
    writeDatabase(db);
    res.json({ success: true, message: 'O‘quvchi o‘chirildi' });
  });

  // 4. Update Payment Status (Admin Only)
  app.patch('/api/payments/:studentId', (req: Request, res: Response) => {
    const db = readDatabase();
    const { studentId } = req.params;
    const { status, method, note } = req.body;

    const student = db.students.find((s: any) => s.id === studentId);
    if (student) {
      student.paymentStatus = status;
      if (method) student.paymentMethod = method;
      if (note !== undefined) student.paymentNote = note;
      if (status === 'paid') student.paymentDate = new Date().toISOString().split('T')[0];
      writeDatabase(db);
      return res.json({ success: true, student });
    }
    return res.status(404).json({ error: 'O‘quvchi topilmadi' });
  });

  // 5. Attendance CRUD
  app.get('/api/attendance', (req: Request, res: Response) => {
    const db = readDatabase();
    res.json(db.attendance);
  });

  app.post('/api/attendance', (req: Request, res: Response) => {
    const db = readDatabase();
    const record = {
      ...req.body,
      id: `att-${Date.now()}`
    };
    db.attendance.unshift(record);

    // Update student's attendance rate
    const studentRecords = db.attendance.filter((a: any) => a.studentId === record.studentId);
    const presentRecords = studentRecords.filter((a: any) => a.status === 'present' || a.status === 'late');
    const rate = Math.round((presentRecords.length / Math.max(studentRecords.length, 1)) * 100);

    const student = db.students.find((s: any) => s.id === record.studentId);
    if (student) {
      student.attendanceRate = rate;
    }

    writeDatabase(db);
    res.status(201).json({ record, attendanceRate: rate });
  });

  // 6. Give Activity Points
  app.post('/api/points', (req: Request, res: Response) => {
    const db = readDatabase();
    const { studentId, points } = req.body;
    const student = db.students.find((s: any) => s.id === studentId);
    if (student) {
      student.activityPoints = (student.activityPoints || 0) + points;
      student.totalPoints = student.activityPoints + (student.quizPoints || 0);
      if (student.totalPoints >= 90) {
        student.certificateGranted = true;
        student.certificateId = student.certificateId || `SHM-2026-A1-${student.id.replace('std-', '00')}`;
        student.certificateDate = student.certificateDate || new Date().toISOString().split('T')[0];
      }
      writeDatabase(db);
      return res.json({ success: true, student });
    }
    return res.status(404).json({ error: 'O‘quvchi topilmadi' });
  });

  // ==========================================
  // VITE DEV MIDDLEWARE OR PRODUCTION SERVE
  // ==========================================
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌸 «Shamsiyya» Serveri http://localhost:${PORT} portida muvaffaqiyatli ishga tushdi.`);
    console.log(`👑 Bosh Ustoz: A. Xo‘jayeva`);
  });
}

startServer();
