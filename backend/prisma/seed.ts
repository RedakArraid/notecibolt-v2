import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding de la base de données...');

  // Nettoyer les données existantes
  await prisma.userSession.deleteMany();
  await prisma.studentAchievement.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.message.deleteMany();
  await prisma.financialRecord.deleteMany();
  await prisma.admissionApplication.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();
  await prisma.class.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.achievement.deleteMany();

  // Hasher les mots de passe
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Créer les matières
  const mathSubject = await prisma.subject.create({
    data: {
      name: 'Mathématiques',
      code: 'MATH',
      description: 'Mathématiques niveau lycée',
      department: 'Sciences',
      credits: 6,
      color: '#EF4444'
    }
  });

  const frenchSubject = await prisma.subject.create({
    data: {
      name: 'Français',
      code: 'FR',
      description: 'Français niveau lycée',
      department: 'Lettres',
      credits: 4,
      color: '#10B981'
    }
  });

  // Créer les classes
  const terminaleS = await prisma.class.create({
    data: {
      name: 'Terminale S1',
      level: 'Terminale',
      academicYear: '2024-2025',
      room: 'Salle 201',
      maxStudents: 35
    }
  });

  // Créer l'administrateur
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@notecibolt.com',
      name: 'Administrateur',
      role: 'ADMIN',
      isActive: true,
      emailVerifiedAt: new Date(),
      password: hashedPassword
    }
  });

  await prisma.admin.create({
    data: {
      userId: adminUser.id,
      permissions: ['ALL']
    }
  });

  // Créer un enseignant
  const teacherUser = await prisma.user.create({
    data: {
      email: 'teacher@notecibolt.com',
      name: 'Jean Martin',
      role: 'TEACHER',
      isActive: true,
      emailVerifiedAt: new Date(),
      phone: '+33 1 23 45 67 89',
      password: hashedPassword
    }
  });

  const teacher = await prisma.teacher.create({
    data: {
      userId: teacherUser.id,
      employeeId: 'TEA001',
      department: 'Sciences',
      qualifications: ['Agrégation de Mathématiques'],
      hireDate: new Date('2020-09-01')
    }
  });

  // Créer un parent
  const parentUser = await prisma.user.create({
    data: {
      email: 'parent@notecibolt.com',
      name: 'Pierre Dubois',
      role: 'PARENT',
      isActive: true,
      emailVerifiedAt: new Date(),
      phone: '+33 6 12 34 56 78',
      password: hashedPassword
    }
  });

  const parent = await prisma.parent.create({
    data: {
      userId: parentUser.id,
      occupation: 'Ingénieur',
      preferredContactMethod: 'EMAIL'
    }
  });

  // Créer un élève
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@notecibolt.com',
      name: 'Marie Dubois',
      role: 'STUDENT',
      isActive: true,
      emailVerifiedAt: new Date(),
      dateOfBirth: new Date('2007-03-15'),
      password: hashedPassword
    }
  });

  const student = await prisma.student.create({
    data: {
      userId: studentUser.id,
      studentId: 'STU001',
      classId: terminaleS.id,
      parentIds: [parent.id],
      admissionDate: new Date('2023-09-01'),
      academicYear: '2024-2025',
      allergies: ['Arachides'],
      medications: [],
      emergencyMedicalContact: 'Dr. Martin - 01 42 34 56 78'
    }
  });

  // Créer des achievements
  const achievement1 = await prisma.achievement.create({
    data: {
      title: 'Mathématicien prodige',
      description: 'Obtenir plus de 17/20 en mathématiques pendant 3 évaluations consécutives',
      icon: 'Calculator',
      category: 'ACADEMIC',
      points: 50,
      criteria: ['Note > 17/20', 'Trois évaluations consécutives'],
      rarity: 'RARE'
    }
  });

  // Créer quelques notes
  await prisma.grade.create({
    data: {
      studentId: student.id,
      subjectId: mathSubject.id,
      teacherId: teacher.id,
      value: 18,
      maxValue: 20,
      type: 'TEST',
      comment: 'Excellent travail sur les équations différentielles',
      date: new Date()
    }
  });

  await prisma.grade.create({
    data: {
      studentId: student.id,
      subjectId: frenchSubject.id,
      teacherId: teacher.id,
      value: 15,
      maxValue: 20,
      type: 'HOMEWORK',
      comment: 'Bonne analyse littéraire',
      date: new Date()
    }
  });

  // Créer un enregistrement de présence
  await prisma.attendanceRecord.create({
    data: {
      studentId: student.id,
      teacherId: teacher.id,
      classId: terminaleS.id,
      date: new Date(),
      status: 'PRESENT',
      period: '08:00-09:00'
    }
  });

  // Créer un message
  await prisma.message.create({
    data: {
      senderId: teacherUser.id,
      recipientIds: [studentUser.id],
      subject: 'Félicitations',
      content: 'Félicitations pour votre excellent résultat !',
      type: 'MESSAGE',
      priority: 'MEDIUM'
    }
  });

  console.log('✅ Seeding terminé avec succès !');
  console.log('\n📊 Données créées :');
  console.log('- 1 Administrateur (admin@notecibolt.com / password123)');
  console.log('- 1 Enseignant (teacher@notecibolt.com / password123)');
  console.log('- 1 Parent (parent@notecibolt.com / password123)');
  console.log('- 1 Élève (student@notecibolt.com / password123)');
  console.log('- 2 Matières (Mathématiques, Français)');
  console.log('- 1 Classe (Terminale S1)');
  console.log('- 2 Notes de test');
  console.log('- 1 Enregistrement de présence');
  console.log('- 1 Message');
  console.log('- 1 Achievement');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding :', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
