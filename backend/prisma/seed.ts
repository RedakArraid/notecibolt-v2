import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding NoteCibolt v2...');

  // Nettoyer les données existantes
  console.log('🗑️ Nettoyage des données...');
  await prisma.studentAchievement.deleteMany();
  await prisma.achievement.deleteMany();
  await prisma.behaviorRecord.deleteMany();
  await prisma.reportCard.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.fileAttachment.deleteMany();
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.attendanceRecord.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.message.deleteMany();
  await prisma.financialRecord.deleteMany();
  await prisma.learningResource.deleteMany();
  await prisma.virtualClass.deleteMany();
  await prisma.admissionApplication.deleteMany();
  await prisma.userSession.deleteMany();
  await prisma.classSubject.deleteMany();
  await prisma.assignmentClass.deleteMany();
  await prisma.teacherClass.deleteMany();
  await prisma.teacherSubject.deleteMany();
  await prisma.student.deleteMany();
  await prisma.teacher.deleteMany();
  await prisma.parent.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.class.deleteMany();
  await prisma.user.deleteMany();

  // ===========================
  // CRÉER L'ADMIN
  // ===========================
  
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@notecibolt.com',
      password: await bcrypt.hash('admin123', 12),
      name: 'Directrice Martin',
      role: 'ADMIN',
      isActive: true
    }
  });

  await prisma.admin.create({
    data: {
      userId: adminUser.id,
      permissions: ['ALL']
    }
  });

  console.log('✅ Admin créé:', adminUser.name);

  // ===========================
  // CRÉER LES CLASSES
  // ===========================
  
  const classNames = [
    'CP-A', 'CP-B', 'CE1-A', 'CE1-B', 'CE2-A', 'CE2-B',
    'CM1-A', 'CM1-B', 'CM2-A', 'CM2-B'
  ];

  const classes = [];
  for (let i = 0; i < 10; i++) {
    const className = classNames[i] || `Classe-${i + 1}`;
    const level = className.includes('CP') || className.includes('CE') || className.includes('CM') ? 'Primaire' : 'Collège';
    const classRecord = await prisma.class.create({
      data: {
        name: className,
        level: level,
        academicYear: '2024-2025',
        room: `Salle-${i + 1}`,
        maxStudents: 30
      }
    });
    classes.push(classRecord);
  }

  console.log('✅ Classes créées:', classes.length);

  // ===========================
  // CRÉER LES MATIÈRES
  // ===========================
  
  const subjects = await Promise.all([
    prisma.subject.create({
      data: {
        name: 'Mathématiques',
        code: 'MATH',
        department: 'Sciences',
        credits: 3,
        color: '#3B82F6'
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Français',
        code: 'FR',
        department: 'Lettres',
        credits: 3,
        color: '#10B981'
      }
    }),
    prisma.subject.create({
      data: {
        name: 'Anglais',
        code: 'EN',
        department: 'Langues',
        credits: 2,
        color: '#8B5CF6'
      }
    }),
    prisma.subject.create({
      data: {
        name: 'EPS',
        code: 'EPS',
        department: 'Arts & Sports',
        credits: 1,
        color: '#F97316'
      }
    })
  ]);

  console.log('✅ Matières créées:', subjects.length);

  // ===========================
  // CRÉER LES ENSEIGNANTS
  // ===========================
  
  const teachers = [];
  const teacherNames = [
    'M. Dupont', 'Mme Dubois', 'M. Martin', 'Mme Bernard', 'M. Moreau',
    'Mme Petit', 'M. Durand', 'Mme Leroy', 'M. Girard', 'Mme Fournier',
    'M. Bonnet', 'Mme Mercier', 'M. Boyer', 'Mme Blanchard', 'M. Joly',
    'Mme Garnier', 'M. Faure', 'Mme Lemaire', 'M. Bertrand', 'Mme Simon'
  ];

  const departments = ['Sciences', 'Lettres', 'Langues', 'Arts & Sports'];

  for (let i = 0; i < 20; i++) {
    const teacherUser = await prisma.user.create({
      data: {
        email: `teacher${i + 1}@notecibolt.com`,
        password: await bcrypt.hash('teacher123', 12),
        name: teacherNames[i] || `Enseignant ${i + 1}`,
        role: 'TEACHER',
        isActive: true
      }
    });

    const teacher = await prisma.teacher.create({
      data: {
        userId: teacherUser.id,
        employeeId: `T${String(i + 1).padStart(3, '0')}`,
        department: departments[i % departments.length],
        qualifications: ['Licence', 'Master'],
        hireDate: new Date(2020 + (i % 4), (i % 12), 1)
      }
    });

    teachers.push(teacher);
  }

  console.log('✅ Enseignants créés:', teachers.length);

  // ===========================
  // CRÉER LES PARENTS
  // ===========================
  
  const parents = [];
  const occupations = ['Ingénieur', 'Médecin', 'Enseignant', 'Commerçant', 'Fonctionnaire'];
  
  for (let i = 0; i < 50; i++) {
    const parentUser = await prisma.user.create({
      data: {
        email: `parent${i + 1}@notecibolt.com`,
        password: await bcrypt.hash('parent123', 12),
        name: `Parent ${i + 1}`,
        role: 'PARENT',
        isActive: true
      }
    });

    const parent = await prisma.parent.create({
      data: {
        userId: parentUser.id,
        occupation: occupations[i % occupations.length],
        preferredContactMethod: 'EMAIL'
      }
    });

    parents.push(parent);
  }

  console.log('✅ Parents créés:', parents.length);

  // ===========================
  // CRÉER LES ÉLÈVES
  // ===========================
  
  const students = [];
  const studentNames = [
    'Aicha Diallo', 'Amadou Sow', 'Fatou Ndiaye', 'Ousmane Fall', 'Aminata Ba',
    'Ibrahima Sarr', 'Khadija Sy', 'Moussa Cissé', 'Awa Diouf', 'Cheikh Gueye',
    'Marième Thiam', 'Abdoulaye Wade', 'Ndeye Faye', 'Mamadou Diop', 'Astou Kane',
    'Lamine Ndour', 'Coumba Seck', 'Bamba Niang', 'Dieynaba Tall', 'Serigne Mboup'
  ];

  for (let i = 0; i < 100; i++) {
    const studentUser = await prisma.user.create({
      data: {
        email: `student${i + 1}@notecibolt.com`,
        password: await bcrypt.hash('student123', 12),
        name: studentNames[i % studentNames.length] || `Élève ${i + 1}`,
        role: 'STUDENT',
        isActive: true
      }
    });

    const student = await prisma.student.create({
      data: {
        userId: studentUser.id,
        studentId: `S${String(i + 1).padStart(4, '0')}`,
        classId: classes[i % classes.length].id,
        parentIds: [parents[i % parents.length].id],
        admissionDate: new Date(2024, 8, 1),
        academicYear: '2024-2025',
        allergies: [],
        medications: []
      }
    });

    students.push(student);
  }

  console.log('✅ Élèves créés:', students.length);

  // ===========================
  // CRÉER QUELQUES PAIEMENTS AVEC RETARDS
  // ===========================
  
  const paymentTypes = ['TUITION', 'FEES', 'MATERIALS', 'TRANSPORT', 'MEALS'];
  const paymentStatuses = ['PENDING', 'PAID', 'OVERDUE'];
  
  for (let i = 0; i < 1000; i++) {
    const randomStudent = students[Math.floor(Math.random() * students.length)];
    const isOverdue = Math.random() > 0.85; // 15% de chance d'être en retard
    
    await prisma.financialRecord.create({
      data: {
        studentId: randomStudent.id,
        type: paymentTypes[Math.floor(Math.random() * paymentTypes.length)] as any,
        amount: Math.floor(Math.random() * 500000) + 100000,
        currency: 'FCFA',
        dueDate: isOverdue 
          ? new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000) // Date passée
          : new Date(Date.now() + Math.random() * 60 * 24 * 60 * 60 * 1000), // Date future
        status: isOverdue ? 'OVERDUE' : (paymentStatuses[Math.floor(Math.random() * 2)] as any), // PENDING ou PAID
        description: 'Frais de scolarité',
        invoiceNumber: `INV-${String(i + 1).padStart(6, '0')}`
      }
    });
  }

  console.log('✅ Paiements créés: 1000 (avec retards simulés)');

  // ===========================
  // EXEMPLES SUPPLÉMENTAIRES FINANCE
  // ===========================
  if (students.length > 0) {
    await prisma.financialRecord.create({
      data: {
        studentId: students[0].id,
        type: 'TUITION',
        amount: 350000,
        currency: 'FCFA',
        dueDate: new Date(2024, 8, 1),
        paidDate: new Date(2024, 8, 10),
        status: 'PAID',
        description: 'Frais de scolarité - Trimestre 1',
        paymentMethod: 'CARD',
        invoiceNumber: 'INV-EX-0001',
      }
    });
    await prisma.financialRecord.create({
      data: {
        studentId: students[0].id,
        type: 'TRANSPORT',
        amount: 50000,
        currency: 'FCFA',
        dueDate: new Date(2024, 8, 1),
        status: 'PENDING',
        description: 'Abonnement transport scolaire',
        invoiceNumber: 'INV-EX-0002',
      }
    });
    await prisma.financialRecord.create({
      data: {
        studentId: students[1].id,
        type: 'MATERIALS',
        amount: 25000,
        currency: 'FCFA',
        dueDate: new Date(2024, 8, 15),
        status: 'OVERDUE',
        description: 'Achat de manuels scolaires',
        invoiceNumber: 'INV-EX-0003',
      }
    });
  }

  // ===========================
  // EXEMPLES SUPPLÉMENTAIRES ADMISSIONS
  // ===========================
  if (parents.length > 0) {
    await prisma.admissionApplication.create({
      data: {
        applicationNumber: 'ADM-2024-0001',
        firstName: 'Lucas',
        lastName: 'Bernard',
        dateOfBirth: new Date(2012, 4, 12),
        gender: 'MALE',
        nationality: 'Française',
        previousSchool: 'École Sainte-Marie',
        desiredClass: '6ème',
        academicYear: '2024-2025',
        specialNeeds: 'Dyslexie légère',
        parentId: parents[0].id,
        fatherName: 'Michel Bernard',
        fatherEmail: 'michel.bernard@email.com',
        fatherPhone: '+33 6 12 34 56 78',
        fatherOccupation: 'Médecin',
        motherName: 'Anne Bernard',
        motherEmail: 'anne.bernard@email.com',
        motherPhone: '+33 6 87 65 43 21',
        motherOccupation: 'Avocate',
        familyAddress: '15 Rue des Lilas, 75012 Paris',
        status: 'UNDER_REVIEW',
        notes: 'Dossier complet, bon niveau académique',
        submittedAt: new Date(2024, 6, 10)
      }
    });
    await prisma.admissionApplication.create({
      data: {
        applicationNumber: 'ADM-2024-0002',
        firstName: 'Fatou',
        lastName: 'Ndiaye',
        dateOfBirth: new Date(2011, 10, 3),
        gender: 'FEMALE',
        nationality: 'Sénégalaise',
        previousSchool: 'École Les Petits Génies',
        desiredClass: '5ème',
        academicYear: '2024-2025',
        parentId: parents[1].id,
        fatherName: 'Mamadou Ndiaye',
        fatherEmail: 'mamadou.ndiaye@email.com',
        fatherPhone: '+221 77 123 45 67',
        motherName: 'Aminata Diop',
        motherEmail: 'aminata.diop@email.com',
        motherPhone: '+221 77 765 43 21',
        familyAddress: 'Dakar Plateau, Dakar',
        status: 'SUBMITTED',
        notes: 'Besoin d’un accompagnement pour l’intégration',
        submittedAt: new Date(2024, 6, 15)
      }
    });
  }

  // ===========================
  // STATISTIQUES FINALES
  // ===========================
  
  const finalStats = {
    users: await prisma.user.count(),
    students: await prisma.student.count(),
    teachers: await prisma.teacher.count(),
    parents: await prisma.parent.count(),
    classes: await prisma.class.count(),
    subjects: await prisma.subject.count(),
    financialRecords: await prisma.financialRecord.count()
  };

  console.log('\n🎯 Seeding terminé avec succès!');
  console.log('📊 Statistiques finales:');
  console.log(`- Utilisateurs: ${finalStats.users}`);
  console.log(`- Élèves: ${finalStats.students}`);
  console.log(`- Enseignants: ${finalStats.teachers}`);
  console.log(`- Parents: ${finalStats.parents}`);
  console.log(`- Classes: ${finalStats.classes}`);
  console.log(`- Matières: ${finalStats.subjects}`);
  console.log(`- Paiements: ${finalStats.financialRecords}`);

  console.log('\n✅ Base de données NoteCibolt v2 prête pour les tests!');
  console.log('👤 Compte admin: admin@notecibolt.com / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
