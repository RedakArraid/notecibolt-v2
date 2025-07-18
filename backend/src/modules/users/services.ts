import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ===========================
// INTERFACES TYPESCRIPT
// ===========================

export interface UserFilters {
  search?: string;
  role?: 'student' | 'teacher' | 'parent' | 'admin' | 'staff';
  isActive?: boolean;
  sortBy?: 'name' | 'email' | 'role' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface UserStats {
  totalUsers: number;
  totalStudents: number;
  totalTeachers: number;
  totalParents: number;
  totalAdmins: number;
  activeUsers: number;
  inactiveUsers: number;
  newUsersThisMonth: number;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  role: 'student' | 'teacher' | 'parent' | 'admin' | 'staff';
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  isActive?: boolean;
  // Champs spécifiques selon le rôle
  studentData?: {
    studentId: string;
    classId?: string;
    admissionDate: string;
    academicYear: string;
    parentIds?: string[];
  };
  teacherData?: {
    employeeId: string;
    department: string;
    subjects: string[];
    hireDate: string;
    qualifications: string[];
  };
  parentData?: {
    occupation?: string;
    preferredContactMethod: 'email' | 'sms' | 'phone';
    childrenIds?: string[];
  };
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  isActive?: boolean;
  // Mise à jour des données spécifiques selon le rôle
  studentData?: Partial<CreateUserRequest['studentData']>;
  teacherData?: Partial<CreateUserRequest['teacherData']>;
  parentData?: Partial<CreateUserRequest['parentData']>;
}

// ===========================
// SERVICES UTILISATEURS
// ===========================

export const getUsersWithFilters = async (
  page = 1,
  limit = 20,
  filters: UserFilters = {}
): Promise<{
  users: any[];
  totalCount: number;
  totalPages: number;
  hasMore: boolean;
}> => {
  try {
    const offset = (page - 1) * limit;
    const { search, role, isActive, sortBy = 'name', sortOrder = 'asc' } = filters;

    // Construction de la clause WHERE
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (role) {
      whereClause.role = role;
    }

    if (typeof isActive === 'boolean') {
      whereClause.isActive = isActive;
    }

    // Construction de l'orderBy
    const orderBy: any = {};
    orderBy[sortBy] = sortOrder;

    // Requête avec comptage total
    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        orderBy,
        skip: offset,
        take: limit,
        include: {
          student: {
            include: {
              class: true,
              parents: {
                include: {
                  parent: {
                    include: {
                      user: true
                    }
                  }
                }
              }
            }
          },
          teacher: {
            include: {
              subjects: true,
              classes: true
            }
          },
          parent: {
            include: {
              children: {
                include: {
                  student: {
                    include: {
                      user: true
                    }
                  }
                }
              }
            }
          }
        }
      }),
      prisma.user.count({ where: whereClause })
    ]);

    const totalPages = Math.ceil(totalCount / limit);
    const hasMore = page < totalPages;

    return {
      users: users.map(formatUserResponse),
      totalCount,
      totalPages,
      hasMore
    };
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    throw error;
  }
};

export const getUserById = async (id: string): Promise<any> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        student: {
          include: {
            class: true,
            parents: {
              include: {
                parent: {
                  include: {
                    user: true
                  }
                }
              }
            },
            grades: {
              take: 10,
              orderBy: { date: 'desc' }
            },
            attendanceRecords: {
              take: 20,
              orderBy: { date: 'desc' }
            }
          }
        },
        teacher: {
          include: {
            subjects: true,
            classes: {
              include: {
                class: true
              }
            }
          }
        },
        parent: {
          include: {
            children: {
              include: {
                student: {
                  include: {
                    user: true,
                    class: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!user) {
      throw new Error('Utilisateur non trouvé');
    }

    return formatUserResponse(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    throw error;
  }
};

export const createUser = async (userData: CreateUserRequest): Promise<any> => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Vérifier que l'email n'existe pas déjà
      const existingUser = await tx.user.findUnique({
        where: { email: userData.email }
      });

      if (existingUser) {
        throw new Error('Un utilisateur avec cet email existe déjà');
      }

      // Créer l'utilisateur de base
      const user = await tx.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          role: userData.role,
          phone: userData.phone,
          address: userData.address,
          dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : null,
          isActive: userData.isActive ?? true,
          lastLoginAt: null
        }
      });

      // Créer les données spécifiques selon le rôle
      switch (userData.role) {
        case 'student':
          if (userData.studentData) {
            await tx.student.create({
              data: {
                userId: user.id,
                studentId: userData.studentData.studentId,
                classId: userData.studentData.classId || null,
                admissionDate: new Date(userData.studentData.admissionDate),
                academicYear: userData.studentData.academicYear
              }
            });

            // Créer les relations parent-enfant si spécifiées
            if (userData.studentData.parentIds && userData.studentData.parentIds.length > 0) {
              for (const parentId of userData.studentData.parentIds) {
                await tx.parentStudent.create({
                  data: {
                    parentId,
                    studentId: user.id
                  }
                });
              }
            }
          }
          break;

        case 'teacher':
          if (userData.teacherData) {
            await tx.teacher.create({
              data: {
                userId: user.id,
                employeeId: userData.teacherData.employeeId,
                department: userData.teacherData.department,
                hireDate: new Date(userData.teacherData.hireDate),
                qualifications: userData.teacherData.qualifications
              }
            });
          }
          break;

        case 'parent':
          if (userData.parentData) {
            await tx.parent.create({
              data: {
                userId: user.id,
                occupation: userData.parentData.occupation,
                preferredContactMethod: userData.parentData.preferredContactMethod
              }
            });

            // Créer les relations parent-enfant si spécifiées
            if (userData.parentData.childrenIds && userData.parentData.childrenIds.length > 0) {
              for (const childId of userData.parentData.childrenIds) {
                await tx.parentStudent.create({
                  data: {
                    parentId: user.id,
                    studentId: childId
                  }
                });
              }
            }
          }
          break;
      }

      return user;
    });

    // Récupérer l'utilisateur complet créé
    return await getUserById(result.id);
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur:', error);
    throw error;
  }
};

export const updateUser = async (id: string, userData: UpdateUserRequest): Promise<any> => {
  try {
    const result = await prisma.$transaction(async (tx) => {
      // Vérifier que l'utilisateur existe
      const existingUser = await tx.user.findUnique({
        where: { id },
        include: { student: true, teacher: true, parent: true }
      });

      if (!existingUser) {
        throw new Error('Utilisateur non trouvé');
      }

      // Vérifier l'email si changé
      if (userData.email && userData.email !== existingUser.email) {
        const emailExists = await tx.user.findUnique({
          where: { email: userData.email }
        });

        if (emailExists) {
          throw new Error('Un utilisateur avec cet email existe déjà');
        }
      }

      // Mettre à jour l'utilisateur de base
      const updatedUser = await tx.user.update({
        where: { id },
        data: {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          address: userData.address,
          dateOfBirth: userData.dateOfBirth ? new Date(userData.dateOfBirth) : undefined,
          isActive: userData.isActive,
          updatedAt: new Date()
        }
      });

      // Mettre à jour les données spécifiques selon le rôle
      if (existingUser.role === 'student' && userData.studentData) {
        await tx.student.update({
          where: { userId: id },
          data: {
            classId: userData.studentData.classId,
            academicYear: userData.studentData.academicYear
          }
        });
      }

      if (existingUser.role === 'teacher' && userData.teacherData) {
        await tx.teacher.update({
          where: { userId: id },
          data: {
            department: userData.teacherData.department,
            qualifications: userData.teacherData.qualifications
          }
        });
      }

      if (existingUser.role === 'parent' && userData.parentData) {
        await tx.parent.update({
          where: { userId: id },
          data: {
            occupation: userData.parentData.occupation,
            preferredContactMethod: userData.parentData.preferredContactMethod
          }
        });
      }

      return updatedUser;
    });

    // Récupérer l'utilisateur complet mis à jour
    return await getUserById(result.id);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
    throw error;
  }
};

export const deleteUser = async (id: string): Promise<void> => {
  try {
    await prisma.$transaction(async (tx) => {
      // Vérifier que l'utilisateur existe
      const user = await tx.user.findUnique({
        where: { id },
        include: { student: true, teacher: true, parent: true }
      });

      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }

      // Supprimer les données spécifiques selon le rôle
      if (user.student) {
        // Supprimer les relations parent-enfant
        await tx.parentStudent.deleteMany({
          where: { studentId: id }
        });
        
        // Supprimer les données étudiant
        await tx.student.delete({
          where: { userId: id }
        });
      }

      if (user.teacher) {
        await tx.teacher.delete({
          where: { userId: id }
        });
      }

      if (user.parent) {
        // Supprimer les relations parent-enfant
        await tx.parentStudent.deleteMany({
          where: { parentId: id }
        });
        
        await tx.parent.delete({
          where: { userId: id }
        });
      }

      // Supprimer l'utilisateur (soft delete en mettant isActive = false)
      await tx.user.update({
        where: { id },
        data: {
          isActive: false,
          updatedAt: new Date()
        }
      });
    });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    throw error;
  }
};

export const getUserStats = async (): Promise<UserStats> => {
  try {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    const [
      totalUsers,
      totalStudents,
      totalTeachers,
      totalParents,
      totalAdmins,
      activeUsers,
      inactiveUsers,
      newUsersThisMonth
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'student' } }),
      prisma.user.count({ where: { role: 'teacher' } }),
      prisma.user.count({ where: { role: 'parent' } }),
      prisma.user.count({ where: { role: 'admin' } }),
      prisma.user.count({ where: { isActive: true } }),
      prisma.user.count({ where: { isActive: false } }),
      prisma.user.count({
        where: {
          createdAt: { gte: oneMonthAgo }
        }
      })
    ]);

    return {
      totalUsers,
      totalStudents,
      totalTeachers,
      totalParents,
      totalAdmins,
      activeUsers,
      inactiveUsers,
      newUsersThisMonth
    };
  } catch (error) {
    console.error('Erreur lors du calcul des statistiques:', error);
    throw error;
  }
};

export const searchUsers = async (
  query: string,
  filters: Omit<UserFilters, 'search'> = {}
): Promise<any[]> => {
  try {
    const whereClause: any = {
      OR: [
        { name: { contains: query, mode: 'insensitive' } },
        { email: { contains: query, mode: 'insensitive' } }
      ]
    };

    if (filters.role) {
      whereClause.role = filters.role;
    }

    if (typeof filters.isActive === 'boolean') {
      whereClause.isActive = filters.isActive;
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      take: 20,
      orderBy: { name: 'asc' },
      include: {
        student: { include: { class: true } },
        teacher: { include: { subjects: true } },
        parent: true
      }
    });

    return users.map(formatUserResponse);
  } catch (error) {
    console.error('Erreur lors de la recherche d\'utilisateurs:', error);
    throw error;
  }
};

// ===========================
// FONCTIONS UTILITAIRES
// ===========================

const formatUserResponse = (user: any) => {
  const baseUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    address: user.address,
    dateOfBirth: user.dateOfBirth,
    isActive: user.isActive,
    avatar: user.avatar || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };

  // Ajouter les données spécifiques selon le rôle
  if (user.student) {
    return {
      ...baseUser,
      studentId: user.student.studentId,
      classId: user.student.classId,
      className: user.student.class?.name || null,
      admissionDate: user.student.admissionDate,
      academicYear: user.student.academicYear,
      parents: user.student.parents?.map((p: any) => ({
        id: p.parent.user.id,
        name: p.parent.user.name,
        email: p.parent.user.email,
        phone: p.parent.user.phone
      })) || []
    };
  }

  if (user.teacher) {
    return {
      ...baseUser,
      employeeId: user.teacher.employeeId,
      department: user.teacher.department,
      hireDate: user.teacher.hireDate,
      qualifications: user.teacher.qualifications,
      subjects: user.teacher.subjects?.map((s: any) => s.name) || [],
      classes: user.teacher.classes?.map((c: any) => c.class.name) || []
    };
  }

  if (user.parent) {
    return {
      ...baseUser,
      occupation: user.parent.occupation,
      preferredContactMethod: user.parent.preferredContactMethod,
      children: user.parent.children?.map((c: any) => ({
        id: c.student.user.id,
        name: c.student.user.name,
        studentId: c.student.studentId,
        className: c.student.class?.name || null
      })) || []
    };
  }

  return baseUser;
};
