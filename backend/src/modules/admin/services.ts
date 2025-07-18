import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ===========================
// INTERFACES TYPESCRIPT
// ===========================

export interface SystemMetrics {
  totalStudents: number;
  totalTeachers: number;
  totalStaff: number;
  totalClasses: number;
  averageClassSize: number;
  attendanceRate: number;
  academicPerformance: number;
  financialHealth: number;
  parentSatisfaction: number;
  teacherRetention: number;
  lastUpdate: string;
}

export interface FinancialData {
  totalRevenue: number;
  pendingPayments: number;
  monthlyExpenses: number;
  profitMargin: number;
  budgetUtilization: number;
}

export interface Alert {
  id: string;
  type: 'financial' | 'academic' | 'staff' | 'infrastructure';
  severity: 'high' | 'medium' | 'low';
  title: string;
  message: string;
  count: number;
  action: string;
}

export interface Event {
  id: string;
  type: 'admission' | 'payment' | 'incident' | 'achievement';
  title: string;
  description: string;
  time: string;
  icon: string;
  color: string;
}

export interface DepartmentStat {
  name: string;
  teachers: number;
  students: number;
  averageGrade: number;
  satisfaction: number;
  color: string;
}

export interface AdminMetrics {
  systemMetrics: SystemMetrics;
  financialData: FinancialData;
  alerts: Alert[];
  events: Event[];
  departments: DepartmentStat[];
}

// ===========================
// SERVICES MÉTRIQUES SYSTÈME
// ===========================

export const getSystemMetrics = async (): Promise<SystemMetrics> => {
  try {
    const [
      studentsCount,
      teachersCount,
      classesCount,
      attendanceRate,
      academicPerformance,
      financialHealth,
      parentSatisfaction,
      teacherRetention
    ] = await Promise.all([
      prisma.student.count(),
      prisma.teacher.count(),
      prisma.class.count(),
      calculateAttendanceRate(),
      calculateAcademicPerformance(),
      calculateFinancialHealth(),
      calculateParentSatisfaction(),
      calculateTeacherRetention()
    ]);

    const averageClassSize = studentsCount > 0 && classesCount > 0 
      ? Math.round((studentsCount / classesCount) * 10) / 10 
      : 0;

    return {
      totalStudents: studentsCount,
      totalTeachers: teachersCount,
      totalStaff: teachersCount + 12, // +12 pour le staff administratif
      totalClasses: classesCount,
      averageClassSize,
      attendanceRate,
      academicPerformance,
      financialHealth,
      parentSatisfaction,
      teacherRetention,
      lastUpdate: new Date().toISOString()
    };
  } catch (error) {
    console.error('Erreur lors du calcul des métriques système:', error);
    throw error;
  }
};

export const calculateAttendanceRate = async (): Promise<number> => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalRecords, presentRecords] = await Promise.all([
      prisma.attendanceRecord.count({
        where: {
          date: { gte: thirtyDaysAgo }
        }
      }),
      prisma.attendanceRecord.count({
        where: {
          date: { gte: thirtyDaysAgo },
          status: 'PRESENT'
        }
      })
    ]);

    return totalRecords > 0 ? Math.round((presentRecords / totalRecords) * 1000) / 10 : 94.8;
  } catch (error) {
    console.error('Erreur calcul taux de présence:', error);
    return 94.8; // Valeur par défaut
  }
};

export const calculateAcademicPerformance = async (): Promise<number> => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const averageGrade = await prisma.grade.aggregate({
      where: {
        date: { gte: thirtyDaysAgo }
      },
      _avg: {
        value: true
      }
    });

    return averageGrade._avg.value ? Math.round(averageGrade._avg.value * 10) / 10 : 15.2;
  } catch (error) {
    console.error('Erreur calcul performance académique:', error);
    return 15.2; // Valeur par défaut
  }
};

export const calculateFinancialHealth = async (): Promise<number> => {
  try {
    const [totalRevenue, totalExpenses] = await Promise.all([
      prisma.financialRecord.aggregate({
        where: {
          status: 'PAID'
        },
        _sum: {
          amount: true
        }
      }),
      // Simulation des dépenses (salaires, infrastructure, etc.)
      Promise.resolve(42300000) // Valeur simulée
    ]);

    const revenue = totalRevenue._sum.amount || 0;
    const expenses = totalExpenses;
    const healthScore = revenue > 0 ? ((revenue - expenses) / revenue) * 100 : 87.5;

    return Math.round(healthScore * 10) / 10;
  } catch (error) {
    console.error('Erreur calcul santé financière:', error);
    return 87.5; // Valeur par défaut
  }
};

export const calculateParentSatisfaction = async (): Promise<number> => {
  try {
    // Simulation basée sur les messages/notifications positives
    const recentMessages = await prisma.message.count({
      where: {
        createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        type: 'MESSAGE'
      }
    });

    // Algorithme de satisfaction basé sur l'activité
    const satisfactionScore = Math.min(95, 85 + (recentMessages / 10));
    return Math.round(satisfactionScore * 10) / 10;
  } catch (error) {
    console.error('Erreur calcul satisfaction parents:', error);
    return 92.3; // Valeur par défaut
  }
};

export const calculateTeacherRetention = async (): Promise<number> => {
  try {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const [currentTeachers, teachersOneYearAgo] = await Promise.all([
      prisma.teacher.count(),
      prisma.teacher.count({
        where: {
          createdAt: { lte: oneYearAgo }
        }
      })
    ]);

    const retentionRate = teachersOneYearAgo > 0 
      ? (teachersOneYearAgo / currentTeachers) * 100 
      : 96.7;

    return Math.round(retentionRate * 10) / 10;
  } catch (error) {
    console.error('Erreur calcul rétention enseignants:', error);
    return 96.7; // Valeur par défaut
  }
};

// ===========================
// SERVICES DONNÉES FINANCIÈRES
// ===========================

export const getFinancialMetrics = async (): Promise<FinancialData> => {
  try {
    const [paidPayments, pendingPayments] = await Promise.all([
      prisma.financialRecord.aggregate({
        where: {
          status: 'PAID'
        },
        _sum: {
          amount: true
        }
      }),
      prisma.financialRecord.aggregate({
        where: {
          status: 'PENDING'
        },
        _sum: {
          amount: true
        }
      })
    ]);

    const totalRevenue = paidPayments._sum.amount || 0;
    const pendingAmount = pendingPayments._sum.amount || 0;
    const monthlyExpenses = 42300000; // Simulation
    const profitMargin = totalRevenue > 0 ? ((totalRevenue - monthlyExpenses) / totalRevenue) * 100 : 23.5;
    const budgetUtilization = 78.2; // Simulation

    return {
      totalRevenue,
      pendingPayments: pendingAmount,
      monthlyExpenses,
      profitMargin: Math.round(profitMargin * 10) / 10,
      budgetUtilization
    };
  } catch (error) {
    console.error('Erreur lors du calcul des métriques financières:', error);
    throw error;
  }
};

// ===========================
// SERVICES ALERTES CRITIQUES
// ===========================

export const getCriticalAlerts = async (): Promise<Alert[]> => {
  const alerts: Alert[] = [];

  try {
    // Alerte 1: Retards de paiement
    const overduePayments = await prisma.financialRecord.count({
      where: {
        status: 'PENDING',
        dueDate: { lt: new Date() }
      }
    });

    if (overduePayments > 0) {
      alerts.push({
        id: 'payment-overdue',
        type: 'financial',
        severity: overduePayments > 20 ? 'high' : 'medium',
        title: 'Retards de paiement',
        message: `${overduePayments} familles ont des impayés de plus de 30 jours`,
        count: overduePayments,
        action: 'Voir les détails'
      });
    }

    // Alerte 2: Performance académique
    const lowPerformanceClasses = await findLowPerformanceClasses();
    if (lowPerformanceClasses.length > 0) {
      alerts.push({
        id: 'academic-performance',
        type: 'academic',
        severity: 'medium',
        title: 'Résultats en baisse',
        message: `${lowPerformanceClasses.length} classes sous la moyenne générale`,
        count: lowPerformanceClasses.length,
        action: 'Analyser'
      });
    }

    // Alerte 3: Absences enseignants
    const absentTeachers = await findAbsentTeachers();
    if (absentTeachers.length > 0) {
      alerts.push({
        id: 'teacher-absence',
        type: 'staff',
        severity: 'high',
        title: 'Absence enseignant',
        message: `${absentTeachers.length} enseignants absents sans justificatif`,
        count: absentTeachers.length,
        action: 'Contacter'
      });
    }

    // Alerte 4: Maintenance infrastructure
    alerts.push({
      id: 'infrastructure-maintenance',
      type: 'infrastructure',
      severity: 'low',
      title: 'Maintenance requise',
      message: 'Laboratoire de chimie: équipement à réviser',
      count: 3,
      action: 'Planifier'
    });

    return alerts;
  } catch (error) {
    console.error('Erreur lors de la récupération des alertes:', error);
    throw error;
  }
};

const findLowPerformanceClasses = async (): Promise<string[]> => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const classPerformances = await prisma.class.findMany({
      include: {
        students: {
          include: {
            grades: {
              where: {
                date: { gte: thirtyDaysAgo }
              }
            }
          }
        }
      }
    });

    const lowPerformanceClasses = classPerformances.filter(classItem => {
      const allGrades = classItem.students.flatMap(student => student.grades);
      if (allGrades.length === 0) return false;

      const average = allGrades.reduce((sum, grade) => sum + grade.value, 0) / allGrades.length;
      return average < 10; // Moyenne sous 10/20
    });

    return lowPerformanceClasses.map(c => c.name);
  } catch (error) {
    console.error('Erreur lors de la recherche des classes en difficulté:', error);
    return [];
  }
};

const findAbsentTeachers = async (): Promise<string[]> => {
  try {
    // Simulation d'absences non justifiées
    const teachers = await prisma.teacher.findMany({
      include: {
        user: true
      }
    });

    // Logique de détection des absences basée sur les connexions récentes
    const absentTeachers = teachers.filter(teacher => {
      const lastLogin = teacher.user.lastLoginAt;
      if (!lastLogin) return true;

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      
      return lastLogin < threeDaysAgo;
    });

    return absentTeachers.map(t => t.user.name);
  } catch (error) {
    console.error('Erreur lors de la recherche des enseignants absents:', error);
    return [];
  }
};

// ===========================
// SERVICES ÉVÉNEMENTS RÉCENTS
// ===========================

export const getRecentEvents = async (): Promise<Event[]> => {
  const events: Event[] = [];

  try {
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setDate(twentyFourHoursAgo.getDate() - 1);

    // Événements d'admission
    const recentAdmissions = await prisma.student.findMany({
      where: {
        createdAt: { gte: twentyFourHoursAgo }
      },
      include: {
        user: true,
        class: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    recentAdmissions.forEach(student => {
      events.push({
        id: `admission-${student.id}`,
        type: 'admission',
        title: 'Nouvelle inscription',
        description: `${student.user.name} - ${student.class?.name || 'Classe non assignée'}`,
        time: formatTimeAgo(student.createdAt),
        icon: 'Users',
        color: 'blue'
      });
    });

    // Événements de paiement
    const recentPayments = await prisma.financialRecord.findMany({
      where: {
        createdAt: { gte: twentyFourHoursAgo },
        status: 'PAID'
      },
      include: {
        student: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    recentPayments.forEach(payment => {
      events.push({
        id: `payment-${payment.id}`,
        type: 'payment',
        title: 'Paiement reçu',
        description: `${new Intl.NumberFormat('fr-FR').format(payment.amount)} FCFA - ${payment.student.user.name}`,
        time: formatTimeAgo(payment.createdAt),
        icon: 'DollarSign',
        color: 'green'
      });
    });

    // Événements d'achievements
    const recentAchievements = await prisma.studentAchievement.findMany({
      where: {
        earnedDate: { gte: twentyFourHoursAgo }
      },
      include: {
        student: {
          include: {
            user: true
          }
        },
        achievement: true
      },
      orderBy: {
        earnedDate: 'desc'
      },
      take: 3
    });

    recentAchievements.forEach(achievement => {
      events.push({
        id: `achievement-${achievement.id}`,
        type: 'achievement',
        title: 'Résultat exceptionnel',
        description: `${achievement.student.user.name} - ${achievement.achievement.title}`,
        time: formatTimeAgo(achievement.earnedDate),
        icon: 'Award',
        color: 'purple'
      });
    });

    // Événements d'incidents
    const recentIncidents = await prisma.behaviorRecord.findMany({
      where: {
        date: { gte: twentyFourHoursAgo },
        type: 'NEGATIVE'
      },
      include: {
        student: {
          include: {
            user: true
          }
        }
      },
      orderBy: {
        date: 'desc'
      },
      take: 2
    });

    recentIncidents.forEach(incident => {
      events.push({
        id: `incident-${incident.id}`,
        type: 'incident',
        title: 'Incident disciplinaire',
        description: incident.description,
        time: formatTimeAgo(incident.date),
        icon: 'AlertTriangle',
        color: 'orange'
      });
    });

    return events.sort((a, b) => {
      const timeA = parseTimeAgo(a.time);
      const timeB = parseTimeAgo(b.time);
      return timeA - timeB;
    }).slice(0, 10);

  } catch (error) {
    console.error('Erreur lors de la récupération des événements récents:', error);
    throw error;
  }
};

// ===========================
// SERVICES STATISTIQUES DÉPARTEMENTS
// ===========================

export const getDepartmentStats = async (): Promise<DepartmentStat[]> => {
  try {
    const departments = ['Sciences', 'Lettres', 'Langues', 'Arts & Sports'];
    const stats: DepartmentStat[] = [];

    for (const deptName of departments) {
      const [teachers, subjects, grades] = await Promise.all([
        prisma.teacher.count({
          where: {
            department: deptName
          }
        }),
        prisma.subject.findMany({
          where: {
            department: deptName
          },
          include: {
            grades: {
              where: {
                date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
              }
            },
            classes: {
              include: {
                class: {
                  include: {
                    students: true
                  }
                }
              }
            }
          }
        }),
        prisma.grade.findMany({
          where: {
            date: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
            subject: {
              department: deptName
            }
          }
        })
      ]);

      // Calculer le nombre total d'élèves dans ce département
      const uniqueStudents = new Set();
      subjects.forEach(subject => {
        subject.classes.forEach(classSubject => {
          classSubject.class.students.forEach(student => {
            uniqueStudents.add(student.id);
          });
        });
      });

      // Calculer la moyenne des notes
      const averageGrade = grades.length > 0 
        ? grades.reduce((sum, grade) => sum + grade.value, 0) / grades.length 
        : getDepartmentFallbackGrade(deptName);

      // Calculer la satisfaction (simulée)
      const satisfaction = calculateDepartmentSatisfaction(deptName, averageGrade);

      stats.push({
        name: deptName,
        teachers: teachers || getDepartmentFallbackTeachers(deptName),
        students: uniqueStudents.size || getDepartmentFallbackStudents(deptName),
        averageGrade: Math.round(averageGrade * 10) / 10,
        satisfaction: Math.round(satisfaction * 10) / 10,
        color: getDepartmentColor(deptName)
      });
    }

    return stats;
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques départements:', error);
    throw error;
  }
};

// ===========================
// FONCTIONS UTILITAIRES
// ===========================

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMinutes < 60) {
    return `${diffMinutes}min`;
  } else if (diffHours < 24) {
    return `${diffHours}h`;
  } else {
    return `${diffDays}j`;
  }
};

const parseTimeAgo = (timeStr: string): number => {
  const value = parseInt(timeStr);
  if (timeStr.includes('min')) return value;
  if (timeStr.includes('h')) return value * 60;
  if (timeStr.includes('j')) return value * 60 * 24;
  return 0;
};

const getDepartmentColor = (deptName: string): string => {
  const colors = {
    'Sciences': 'blue',
    'Lettres': 'green',
    'Langues': 'purple',
    'Arts & Sports': 'orange'
  };
  return colors[deptName as keyof typeof colors] || 'blue';
};

const getDepartmentFallbackGrade = (deptName: string): number => {
  const grades = {
    'Sciences': 14.8,
    'Lettres': 15.1,
    'Langues': 14.2,
    'Arts & Sports': 16.3
  };
  return grades[deptName as keyof typeof grades] || 15.0;
};

const getDepartmentFallbackTeachers = (deptName: string): number => {
  const teachers = {
    'Sciences': 12,
    'Lettres': 10,
    'Langues': 8,
    'Arts & Sports': 6
  };
  return teachers[deptName as keyof typeof teachers] || 5;
};

const getDepartmentFallbackStudents = (deptName: string): number => {
  const students = {
    'Sciences': 245,
    'Lettres': 298,
    'Langues': 856,
    'Arts & Sports': 412
  };
  return students[deptName as keyof typeof students] || 200;
};

const calculateDepartmentSatisfaction = (deptName: string, averageGrade: number): number => {
  // Formule basée sur la performance académique
  const baseScore = 85;
  const gradeBonus = (averageGrade - 10) * 2; // +2 points par point au-dessus de 10
  const randomVariation = Math.random() * 5; // Variation aléatoire ±2.5
  
  return Math.min(100, Math.max(70, baseScore + gradeBonus + randomVariation));
};

// ===========================
// EXPORT PRINCIPAL
// ===========================

export const getAllAdminMetrics = async (period: string = 'current_month'): Promise<AdminMetrics> => {
  try {
    const [systemMetrics, financialData, alerts, events, departments] = await Promise.all([
      getSystemMetrics(),
      getFinancialMetrics(),
      getCriticalAlerts(),
      getRecentEvents(),
      getDepartmentStats()
    ]);

    return {
      systemMetrics,
      financialData,
      alerts,
      events,
      departments
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des métriques admin:', error);
    throw error;
  }
};
