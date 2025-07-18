import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Interface pour les filtres
interface StudentFilters {
  search?: string;
  classId?: string;
  isActive?: boolean;
  enrollmentYear?: number;
  sortBy?: 'name' | 'enrollmentDate' | 'gpa' | 'attendance';
  sortOrder?: 'asc' | 'desc';
}

// GET /api/v1/students - Obtenir tous les étudiants avec pagination et filtres
router.get('/', async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const filters: StudentFilters = {
      search: req.query.search as string,
      classId: req.query.classId as string,
      isActive: req.query.isActive === 'true',
      enrollmentYear: req.query.enrollmentYear ? parseInt(req.query.enrollmentYear as string) : undefined,
      sortBy: req.query.sortBy as any || 'name',
      sortOrder: req.query.sortOrder as any || 'asc'
    };

    // Construction de la requête WHERE
    const whereClause: any = {};

    // Filtre de recherche
    if (filters.search) {
      whereClause.OR = [
        { user: { name: { contains: filters.search, mode: 'insensitive' } } },
        { user: { email: { contains: filters.search, mode: 'insensitive' } } },
        { studentId: { contains: filters.search, mode: 'insensitive' } }
      ];
    }

    // Filtre par statut actif
    if (filters.isActive !== undefined) {
      whereClause.user = {
        ...whereClause.user,
        isActive: filters.isActive
      };
    }

    // Filtre par classe
    if (filters.classId) {
      whereClause.classId = filters.classId;
    }

    // Filtre par année d'inscription
    if (filters.enrollmentYear) {
      const startDate = new Date(`${filters.enrollmentYear}-01-01`);
      const endDate = new Date(`${filters.enrollmentYear}-12-31`);
      whereClause.admissionDate = {
        gte: startDate,
        lte: endDate
      };
    }

    // Construction de l'ordre de tri
    let orderBy: any = {};
    switch (filters.sortBy) {
      case 'name':
        orderBy = { user: { name: filters.sortOrder } };
        break;
      case 'enrollmentDate':
        orderBy = { admissionDate: filters.sortOrder };
        break;
      default:
        orderBy = { user: { name: 'asc' } };
    }

    // Requête pour compter le total
    const totalCount = await prisma.student.count({ where: whereClause });

    // Requête principale avec pagination
    const students = await prisma.student.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            avatar: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
          }
        },
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        },
        parents: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        },
        grades: {
          select: {
            value: true,
            maxValue: true
          }
        },
        attendanceRecords: {
          where: {
            date: {
              gte: new Date(new Date().getFullYear(), 0, 1) // Début de l'année
            }
          },
          select: {
            status: true
          }
        }
      },
      orderBy,
      skip: (page - 1) * limit,
      take: limit
    });

    // Transformation des données pour correspondre au format attendu
    const transformedStudents = students.map(student => {
      // Calcul de la moyenne générale
      const totalGrades = student.grades.reduce((sum, grade) => sum + (grade.value / grade.maxValue * 20), 0);
      const averageGPA = student.grades.length > 0 ? totalGrades / student.grades.length : 0;

      // Calcul du taux de présence
      const totalRecords = student.attendanceRecords.length;
      const presentRecords = student.attendanceRecords.filter(record => 
        record.status === 'PRESENT' || record.status === 'LATE'
      ).length;
      const attendanceRate = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;

      // Parent principal (premier parent dans la liste)
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
      createdAt: student.user.createdAt.toISOString(),
      updatedAt: student.user.updatedAt.toISOString()
    }));

    res.json({
      success: true,
      data: transformedStudents,
      message: 'Étudiants récents récupérés avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération des étudiants récents:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des étudiants récents'
    });
  }
});

// GET /api/v1/students/:id - Obtenir un étudiant par ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    console.log('👤 API Student by ID:', id);

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            avatar: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
          }
        },
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        },
        parents: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          },
          take: 1
        },
        grades: {
          select: {
            value: true,
            maxValue: true
          }
        },
        attendanceRecords: {
          where: {
            date: {
              gte: new Date(new Date().getFullYear(), 0, 1)
            }
          },
          select: {
            status: true
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Étudiant non trouvé'
      });
    }

    // Calcul des métriques
    const totalGrades = student.grades.reduce((sum, grade) => sum + (grade.value / grade.maxValue * 20), 0);
    const averageGPA = student.grades.length > 0 ? totalGrades / student.grades.length : 0;

    const totalRecords = student.attendanceRecords.length;
    const presentRecords = student.attendanceRecords.filter(record => 
      record.status === 'PRESENT' || record.status === 'LATE'
    ).length;
    const attendanceRate = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;

    const primaryParent = student.parents.length > 0 ? student.parents[0] : null;

    const transformedStudent = {
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

    res.json({
      success: true,
      data: transformedStudent,
      message: 'Étudiant récupéré avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur lors de la récupération de l\'étudiant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de l\'étudiant'
    });
  }
});

// POST /api/v1/students - Créer un nouvel étudiant
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, dateOfBirth, classId, parentId } = req.body;
    console.log('➕ API Create Student:', { name, email, classId });

    // Validation basique
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nom et email requis'
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Générer un ID étudiant unique
    const studentCount = await prisma.student.count();
    const studentId = `STU${String(studentCount + 1).padStart(4, '0')}`;

    // Créer l'utilisateur et l'étudiant dans une transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Créer l'utilisateur
      const user = await prisma.user.create({
        data: {
          email,
          name,
          phone: phone || null,
          address: address || null,
          password: 'defaultPassword123', // Mot de passe par défaut
          role: 'STUDENT',
          isActive: true
        }
      });

      // Créer l'étudiant
      const student = await prisma.student.create({
        data: {
          studentId,
          userId: user.id,
          classId: classId || null,
          admissionDate: new Date(),
          academicYear: new Date().getFullYear().toString()
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
              avatar: true,
              isActive: true,
              createdAt: true,
              updatedAt: true
            }
          },
          class: {
            select: {
              id: true,
              name: true,
              level: true
            }
          }
        }
      });

      return student;
    });

    const transformedStudent = {
      id: result.id,
      name: result.user.name,
      email: result.user.email,
      phone: result.user.phone,
      address: result.user.address,
      avatar: result.user.avatar,
      role: 'student' as const,
      isActive: result.user.isActive,
      enrollmentDate: result.admissionDate.toISOString().split('T')[0],
      studentId: result.studentId,
      class: result.class ? {
        id: result.class.id,
        name: result.class.name,
        level: result.class.level
      } : null,
      academicInfo: {
        currentGPA: 0,
        totalCredits: 0,
        completedCredits: 0,
        attendanceRate: 0
      },
      createdAt: result.user.createdAt.toISOString(),
      updatedAt: result.user.updatedAt.toISOString()
    };

    res.status(201).json({
      success: true,
      data: transformedStudent,
      message: 'Étudiant créé avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'étudiant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de l\'étudiant'
    });
  }
});

// Routes CRUD restantes (stubs pour l'instant)
router.patch('/:id', async (req: Request, res: Response) => {
  res.json({ success: true, message: 'Mise à jour non implémentée' });
});

router.delete('/:id', async (req: Request, res: Response) => {
  res.json({ success: true, message: 'Suppression non implémentée' });
});

router.get('/:id/history', async (req: Request, res: Response) => {
  res.json({ success: true, data: [], message: 'Historique non implémenté' });
});

router.post('/import', async (req: Request, res: Response) => {
  res.json({ success: true, message: 'Import non implémenté' });
});

router.get('/export', async (req: Request, res: Response) => {
  res.json({ success: true, message: 'Export non implémenté' });
});

export default router;
        role: 'student' as const,
        isActive: student.user.isActive,
        dateOfBirth: null, // Non mappé dans ce schéma
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
          totalCredits: 120, // Valeur par défaut
          completedCredits: Math.floor(averageGPA * 6), // Estimation
          attendanceRate: parseFloat(attendanceRate.toFixed(1))
        },
        createdAt: student.user.createdAt.toISOString(),
        updatedAt: student.user.updatedAt.toISOString()
      };
    });

    // Calcul de la pagination
    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    res.json({
      success: true,
      data: {
        students: transformedStudents,
        totalCount,
        totalPages,
        currentPage: page,
        hasMore
      },
      message: 'Étudiants récupérés avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des étudiants'
    });
  }
});

// GET /api/v1/students/stats - Statistiques des étudiants
router.get('/stats', async (req: Request, res: Response) => {
  try {
    // Statistiques de base
    const totalStudents = await prisma.student.count();
    const activeStudents = await prisma.student.count({
      where: {
        user: {
          isActive: true
        }
      }
    });

    // Nouveaux étudiants ce mois
    const currentDate = new Date();
    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const newStudentsThisMonth = await prisma.student.count({
      where: {
        admissionDate: {
          gte: startOfMonth
        }
      }
    });

    // Moyenne générale et taux de présence
    const studentsWithGrades = await prisma.student.findMany({
      include: {
        grades: {
          select: {
            value: true,
            maxValue: true
          }
        },
        attendanceRecords: {
          where: {
            date: {
              gte: new Date(new Date().getFullYear(), 0, 1) // Début de l'année
            }
          },
          select: {
            status: true
          }
        }
      }
    });

    let totalGPA = 0;
    let totalAttendance = 0;
    let studentsWithGradesCount = 0;
    let studentsWithAttendanceCount = 0;

    studentsWithGrades.forEach(student => {
      // Calcul GPA
      if (student.grades.length > 0) {
        const studentGPA = student.grades.reduce((sum, grade) => 
          sum + (grade.value / grade.maxValue * 20), 0) / student.grades.length;
        totalGPA += studentGPA;
        studentsWithGradesCount++;
      }

      // Calcul présence
      if (student.attendanceRecords.length > 0) {
        const presentRecords = student.attendanceRecords.filter(record => 
          record.status === 'PRESENT' || record.status === 'LATE'
        ).length;
        const attendanceRate = (presentRecords / student.attendanceRecords.length) * 100;
        totalAttendance += attendanceRate;
        studentsWithAttendanceCount++;
      }
    });

    const averageGPA = studentsWithGradesCount > 0 ? totalGPA / studentsWithGradesCount : 0;
    const averageAttendance = studentsWithAttendanceCount > 0 ? totalAttendance / studentsWithAttendanceCount : 0;

    const stats = {
      totalStudents,
      activeStudents,
      newStudentsThisMonth,
      averageAttendance: parseFloat(averageAttendance.toFixed(1)),
      averageGPA: parseFloat(averageGPA.toFixed(1))
    };

    res.json({
      success: true,
      data: stats,
      message: 'Statistiques récupérées avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des statistiques'
    });
  }
});

// GET /api/v1/students/search - Recherche d'étudiants
router.get('/search', async (req: Request, res: Response) => {
  try {
    const query = req.query.q as string;
    const classId = req.query.classId as string;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Paramètre de recherche requis'
      });
    }

    const whereClause: any = {
      OR: [
        { user: { name: { contains: query, mode: 'insensitive' } } },
        { user: { email: { contains: query, mode: 'insensitive' } } },
        { studentId: { contains: query, mode: 'insensitive' } }
      ]
    };

    // Filtre par classe si spécifié
    if (classId) {
      whereClause.classId = classId;
    }

    const students = await prisma.student.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            avatar: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
          }
        },
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        }
      },
      take: 10 // Limiter à 10 résultats pour la recherche
    });

    const transformedStudents = students.map(student => ({
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
      createdAt: student.user.createdAt.toISOString(),
      updatedAt: student.user.updatedAt.toISOString()
    }));

    res.json({
      success: true,
      data: transformedStudents,
      message: `${transformedStudents.length} résultat(s) trouvé(s)`
    });
  } catch (error) {
    console.error('Erreur lors de la recherche:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la recherche'
    });
  }
});

// GET /api/v1/students/classes - Classes disponibles
router.get('/classes', async (req: Request, res: Response) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        students: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    const transformedClasses = classes.map(cls => ({
      id: cls.id,
      name: cls.name,
      level: cls.level,
      capacity: cls.maxStudents,
      currentCount: cls.students.length
    }));

    res.json({
      success: true,
      data: transformedClasses,
      message: 'Classes récupérées avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des classes:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des classes'
    });
  }
});

// GET /api/v1/students/parents - Parents disponibles
router.get('/parents', async (req: Request, res: Response) => {
  try {
    const search = req.query.search as string;
    
    const whereClause: any = {};
    
    if (search) {
      whereClause.user = {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } }
        ]
      };
    }

    const parents = await prisma.parent.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      },
      take: 20
    });

    const transformedParents = parents.map(parent => ({
      id: parent.id,
      name: parent.user.name,
      email: parent.user.email,
      phone: parent.user.phone
    }));

    res.json({
      success: true,
      data: transformedParents,
      message: 'Parents récupérés avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des parents:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des parents'
    });
  }
});

// GET /api/v1/students/by-class/:classId - Étudiants par classe
router.get('/by-class/:classId', async (req: Request, res: Response) => {
  try {
    const { classId } = req.params;

    const students = await prisma.student.findMany({
      where: {
        classId: classId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            avatar: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
          }
        },
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        }
      }
    });

    const transformedStudents = students.map(student => ({
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
      createdAt: student.user.createdAt.toISOString(),
      updatedAt: student.user.updatedAt.toISOString()
    }));

    res.json({
      success: true,
      data: transformedStudents,
      message: `${transformedStudents.length} étudiant(s) trouvé(s) dans la classe`
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants de la classe:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des étudiants de la classe'
    });
  }
});

// GET /api/v1/students/recent - Étudiants récemment inscrits
router.get('/recent', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 5;

    const students = await prisma.student.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            avatar: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
          }
        },
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        }
      },
      orderBy: {
        admissionDate: 'desc'
      },
      take: limit
    });

    const transformedStudents = students.map(student => ({
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
      createdAt: student.user.createdAt.toISOString(),
      updatedAt: student.user.updatedAt.toISOString()
    }));

    res.json({
      success: true,
      data: transformedStudents,
      message: 'Étudiants récents récupérés avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants récents:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération des étudiants récents'
    });
  }
});

// GET /api/v1/students/:id - Obtenir un étudiant par ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const student = await prisma.student.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            avatar: true,
            isActive: true,
            createdAt: true,
            updatedAt: true
          }
        },
        class: {
          select: {
            id: true,
            name: true,
            level: true
          }
        },
        parents: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true
              }
            }
          }
        },
        grades: {
          select: {
            value: true,
            maxValue: true
          }
        },
        attendanceRecords: {
          where: {
            date: {
              gte: new Date(new Date().getFullYear(), 0, 1)
            }
          },
          select: {
            status: true
          }
        }
      }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Étudiant non trouvé'
      });
    }

    // Calcul des métriques
    const totalGrades = student.grades.reduce((sum, grade) => sum + (grade.value / grade.maxValue * 20), 0);
    const averageGPA = student.grades.length > 0 ? totalGrades / student.grades.length : 0;

    const totalRecords = student.attendanceRecords.length;
    const presentRecords = student.attendanceRecords.filter(record => 
      record.status === 'PRESENT' || record.status === 'LATE'
    ).length;
    const attendanceRate = totalRecords > 0 ? (presentRecords / totalRecords) * 100 : 0;

    const primaryParent = student.parents.length > 0 ? student.parents[0] : null;

    const transformedStudent = {
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

    res.json({
      success: true,
      data: transformedStudent,
      message: 'Étudiant récupéré avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'étudiant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la récupération de l\'étudiant'
    });
  }
});

// POST /api/v1/students - Créer un nouvel étudiant
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, address, dateOfBirth, classId, parentId } = req.body;

    // Validation basique
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Nom et email requis'
      });
    }

    // Vérifier si l'email existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Un utilisateur avec cet email existe déjà'
      });
    }

    // Générer un ID étudiant unique
    const studentCount = await prisma.student.count();
    const studentId = `STU${String(studentCount + 1).padStart(4, '0')}`;

    // Créer l'utilisateur et l'étudiant dans une transaction
    const result = await prisma.$transaction(async (prisma) => {
      // Créer l'utilisateur
      const user = await prisma.user.create({
        data: {
          email,
          name,
          phone: phone || null,
          address: address || null,
          password: 'defaultPassword123', // Mot de passe par défaut
          role: 'STUDENT',
          isActive: true
        }
      });

      // Créer l'étudiant
      const student = await prisma.student.create({
        data: {
          studentId,
          userId: user.id,
          classId: classId || null,
          admissionDate: new Date(),
          academicYear: new Date().getFullYear().toString()
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              address: true,
              avatar: true,
              isActive: true,
              createdAt: true,
              updatedAt: true
            }
          },
          class: {
            select: {
              id: true,
              name: true,
              level: true
            }
          }
        }
      });

      return student;
    });

    const transformedStudent = {
      id: result.id,
      name: result.user.name,
      email: result.user.email,
      phone: result.user.phone,
      address: result.user.address,
      avatar: result.user.avatar,
      role: 'student' as const,
      isActive: result.user.isActive,
      enrollmentDate: result.admissionDate.toISOString().split('T')[0],
      studentId: result.studentId,
      class: result.class ? {
        id: result.class.id,
        name: result.class.name,
        level: result.class.level
      } : null,
      academicInfo: {
        currentGPA: 0,
        totalCredits: 0,
        completedCredits: 0,
        attendanceRate: 0
      },
      createdAt: result.user.createdAt.toISOString(),
      updatedAt: result.user.updatedAt.toISOString()
    };

    res.status(201).json({
      success: true,
      data: transformedStudent,
      message: 'Étudiant créé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la création de l\'étudiant:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur serveur lors de la création de l\'étudiant'
    });
  }
});

// Routes CRUD restantes avec stubs pour l'instant
router.patch('/:id', async (req: Request, res: Response) => {
  res.json({ success: true, message: 'Mise à jour non implémentée' });
});

router.delete('/:id', async (req: Request, res: Response) => {
  res.json({ success: true, message: 'Suppression non implémentée' });
});

router.get('/:id/history', async (req: Request, res: Response) => {
  res.json({ success: true, data: [], message: 'Historique non implémenté' });
});

router.post('/import', async (req: Request, res: Response) => {
  res.json({ success: true, message: 'Import non implémenté' });
});

router.get('/export', async (req: Request, res: Response) => {
  res.json({ success: true, message: 'Export non implémenté' });
});

export default router;