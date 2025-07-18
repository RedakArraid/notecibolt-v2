import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const router = Router();
const prisma = new PrismaClient();

interface StudentFilters {
  search?: string;
  classId?: string;
  isActive?: boolean;
  enrollmentYear?: number;
  sortBy?: 'name' | 'enrollmentDate';
  sortOrder?: 'asc' | 'desc';
}

const transformStudent = (student: any) => {
  const totalGrades = student.grades.reduce((sum: number, grade: any) => sum + (grade.value / grade.maxValue * 20), 0);
  const averageGPA = student.grades.length > 0 ? totalGrades / student.grades.length : 0;

  const totalRecords = student.attendanceRecords.length;
  const presentRecords = student.attendanceRecords.filter((record: any) => ['PRESENT', 'LATE'].includes(record.status)).length;
  const attendanceRate = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;

  const primaryParent = student.parents.length > 0 ? student.parents[0] : null;

  return {
    id: student.id,
    name: student.user.name,
    email: student.user.email,
    phone: student.user.phone,
    address: student.user.address,
    avatar: student.user.avatar,
    role: 'student' as const,
    isActive: student.user.isActive,
    enrollmentDate: student.admissionDate.toISOString().split('T')[0],
    studentId: student.studentId,
    class: student.class ? {
      id: student.class.id,
      name: student.class.name,
      level: student.class.level
    } : null,
    parent: primaryParent ? {
      id: primaryParent.id,
      name: primaryParent.user.name,
      email: primaryParent.user.email,
      phone: primaryParent.user.phone
    } : null,
    academicInfo: {
      currentGPA: parseFloat(averageGPA.toFixed(1)),
      totalCredits: 120,
      completedCredits: Math.floor(averageGPA * 6),
      attendanceRate: parseFloat(attendanceRate.toFixed(1))
    },
    createdAt: student.user.createdAt.toISOString(),
    updatedAt: student.user.updatedAt.toISOString()
  };
};

router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const filters: StudentFilters = {
      search: req.query.search as string,
      classId: req.query.classId as string,
      isActive: req.query.isActive !== undefined ? req.query.isActive === 'true' : undefined,
      enrollmentYear: req.query.enrollmentYear ? parseInt(req.query.enrollmentYear as string) : undefined,
      sortBy: req.query.sortBy as 'name' | 'enrollmentDate' || 'name',
      sortOrder: req.query.sortOrder as 'asc' | 'desc' || 'asc'
    };

    const whereClause: any = {};

    if (filters.search) {
      whereClause.OR = [
        { user: { name: { contains: filters.search, mode: 'insensitive' } } },
        { user: { email: { contains: filters.search, mode: 'insensitive' } } },
        { studentId: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    if (filters.isActive !== undefined) {
      whereClause.user = { ...whereClause.user, isActive: filters.isActive };
    }

    if (filters.classId) {
      whereClause.classId = filters.classId;
    }

    if (filters.enrollmentYear) {
      const startDate = new Date(`${filters.enrollmentYear}-01-01`);
      const endDate = new Date(`${filters.enrollmentYear}-12-31`);
      whereClause.admissionDate = { gte: startDate, lte: endDate };
    }

    const orderBy = filters.sortBy === 'name'
      ? { user: { name: filters.sortOrder } }
      : { admissionDate: filters.sortOrder };

    const totalCount = await prisma.student.count({ where: whereClause });

    const students = await prisma.student.findMany({
      where: whereClause,
      include: {
        user: true,
        class: true,
        parents: { include: { user: true } },
        grades: true,
        attendanceRecords: {
          where: { date: { gte: new Date(new Date().getFullYear(), 0, 1) } },
          select: { status: true }
        }
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit
    });

    const transformed = students.map(transformStudent);
    const totalPages = Math.max(1, Math.ceil(totalCount / limit));
    const hasMore = page < totalPages;

    res.json({
      success: true,
      data: transformed,
      totalCount,
      totalPages,
      hasMore,
      message: 'Étudiants récupérés avec succès'
    });
  } catch (error) {
    console.error('Erreur récupération étudiants :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const totalStudents = await prisma.student.count();
    const activeStudents = await prisma.student.count({
      where: { user: { isActive: true } }
    });
    const now = new Date();
    const newStudentsThisMonth = await prisma.student.count({
      where: {
        admissionDate: {
          gte: new Date(now.getFullYear(), now.getMonth(), 1)
        }
      }
    });
    res.json({
      success: true,
      data: {
        totalStudents,
        activeStudents,
        newStudentsThisMonth,
        averageAttendance: 0,
        averageGPA: 0
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors du chargement des statistiques' });
  }
});

// Liste des classes pour le filtre (à placer avant /:id)
router.get('/classes', async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      select: {
        id: true,
        name: true,
        level: true,
        academicYear: true,
        maxStudents: true,
        students: { select: { id: true } }
      }
    });
    const data = classes.map(cls => ({
      ...cls,
      currentCount: cls.students.length,
      capacity: cls.maxStudents
    }));
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur lors du chargement des classes' });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Recherche par id OU par studentId
    const student = await prisma.student.findFirst({
      where: {
        OR: [
          { id },
          { studentId: id }
        ]
      },
      include: {
        user: true,
        class: true,
        parents: { include: { user: true }, take: 1 },
        grades: true,
        attendanceRecords: {
          where: { date: { gte: new Date(new Date().getFullYear(), 0, 1) } },
          select: { status: true }
        }
      }
    });

    if (!student) {
      return res.status(404).json({ success: false, message: 'Étudiant non trouvé' });
    }

    res.json({ success: true, data: transformStudent(student), message: 'Étudiant récupéré' });
  } catch (error) {
    console.error('Erreur récupération étudiant :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, classId } = req.body;
    if (!name || !email) return res.status(400).json({ success: false, message: 'Nom et email requis' });

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(409).json({ success: false, message: 'Email déjà utilisé' });

    const studentCount = await prisma.student.count();
    const studentId = `STU${String(studentCount + 1).padStart(4, '0')}`;
    const hashedPassword = await bcrypt.hash('defaultPassword123', 10);

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, name, phone, address, password: hashedPassword, role: 'STUDENT', isActive: true }
      });
      return tx.student.create({
        data: {
          studentId,
          userId: user.id,
          classId: classId || null,
          admissionDate: new Date(),
          academicYear: new Date().getFullYear().toString()
        },
        include: { user: true, class: true }
      });
    });

    res.status(201).json({
      success: true,
      data: transformStudent({ ...result, grades: [], attendanceRecords: [], parents: [] }),
      message: 'Étudiant créé avec succès'
    });
  } catch (error) {
    console.error('Erreur création étudiant :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// PATCH /:id - Modifier un élève
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, address, classId, isActive } = req.body;

    // Trouver l'élève
    const student = await prisma.student.findFirst({
      where: {
        OR: [
          { id },
          { studentId: id }
        ]
      },
      include: { user: true }
    });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Étudiant non trouvé' });
    }

    // Vérifier l'unicité de l'email si modifié
    if (email && email !== student.user.email) {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'Email déjà utilisé' });
      }
    }

    // Mettre à jour l'utilisateur et l'élève
    const updatedUser = await prisma.user.update({
      where: { id: student.userId },
      data: {
        name: name ?? student.user.name,
        email: email ?? student.user.email,
        phone: phone ?? student.user.phone,
        address: address ?? student.user.address,
        isActive: typeof isActive === 'boolean' ? isActive : student.user.isActive
      }
    });
    const updatedStudent = await prisma.student.update({
      where: { id: student.id },
      data: {
        classId: classId ?? student.classId
      },
      include: {
        user: true,
        class: true,
        parents: { include: { user: true }, take: 1 },
        grades: true,
        attendanceRecords: {
          where: { date: { gte: new Date(new Date().getFullYear(), 0, 1) } },
          select: { status: true }
        }
      }
    });
    res.json({ success: true, data: transformStudent(updatedStudent), message: 'Étudiant modifié avec succès' });
  } catch (error) {
    console.error('Erreur modification étudiant :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});

// DELETE /:id - Archiver (soft delete) un élève
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Trouver l'élève
    const student = await prisma.student.findFirst({
      where: {
        OR: [
          { id },
          { studentId: id }
        ]
      },
      include: { user: true }
    });
    if (!student) {
      return res.status(404).json({ success: false, message: 'Étudiant non trouvé' });
    }
    // Soft delete: désactiver le compte utilisateur
    await prisma.user.update({
      where: { id: student.userId },
      data: { isActive: false }
    });
    res.json({ success: true, message: 'Étudiant archivé (désactivé)' });
  } catch (error) {
    console.error('Erreur suppression étudiant :', error);
    res.status(500).json({ success: false, message: 'Erreur serveur' });
  }
});
router.get('/:id/history', (req, res) => res.json({ success: true, data: [], message: 'Historique non implémenté' }));
router.post('/import', (req, res) => res.json({ success: true, message: 'Import non implémenté' }));
router.get('/export', (req, res) => res.json({ success: true, message: 'Export non implémenté' }));

export default router;
 