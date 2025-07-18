// Import des types
import { Student, Teacher, Parent } from '../types';

// Données existantes (préservées)
export const recentGrades = [
  {
    id: '1',
    studentId: '1',
    subject: 'Mathématiques',
    value: 18,
    maxValue: 20,
    date: '2025-01-15',
    type: 'test',
    comment: 'Excellent travail sur les équations différentielles'
  },
  {
    id: '2',
    studentId: '1',
    subject: 'Français',
    value: 15,
    maxValue: 20,
    date: '2025-01-14',
    type: 'homework',
    comment: 'Bonne analyse littéraire, développer l\'argumentation'
  },
  {
    id: '3',
    studentId: '1',
    subject: 'Physique',
    value: 16.5,
    maxValue: 20,
    date: '2025-01-12',
    type: 'quiz',
    comment: 'Très bonne compréhension des concepts'
  },
  {
    id: '4',
    studentId: '1',
    subject: 'Anglais',
    value: 14,
    maxValue: 20,
    date: '2025-01-10',
    type: 'homework',
    comment: 'Effort notable, continuer le travail sur la grammaire'
  }
];

export const subjects = [
  { 
    id: 'mathematics', 
    name: 'Mathématiques', 
    color: '#EF4444', 
    average: 17.5,
    teacher: 'M. Martin'
  },
  { 
    id: 'french', 
    name: 'Français', 
    color: '#10B981', 
    average: 15.2,
    teacher: 'Mme Leroy'
  },
  { 
    id: 'physics', 
    name: 'Physique-Chimie', 
    color: '#3B82F6', 
    average: 16.8,
    teacher: 'M. Martin'
  },
  { 
    id: 'english', 
    name: 'Anglais', 
    color: '#8B5CF6', 
    average: 14.7,
    teacher: 'Mrs. Johnson'
  }
];

export const assignments = [
  {
    id: '1',
    title: 'Dissertation sur Voltaire',
    subject: 'Français',
    dueDate: '2025-01-25',
    description: 'Analyser les thèmes principaux dans Candide',
    priority: 'high',
    completed: false
  },
  {
    id: '2',
    title: 'Contrôle Intégrales',
    subject: 'Mathématiques',
    dueDate: '2025-01-22',
    description: 'Évaluation sur le calcul intégral',
    priority: 'high',
    completed: false
  },
  {
    id: '3',
    title: 'Exercices de physique',
    subject: 'Physique-Chimie',
    dueDate: '2025-01-18',
    description: 'Série d\'exercices sur les ondes',
    priority: 'medium',
    completed: true
  },
  {
    id: '4',
    title: 'Oral d\'anglais',
    subject: 'Anglais',
    dueDate: '2025-01-30',
    description: 'Présentation de 10 minutes sur un sujet libre',
    priority: 'medium',
    completed: false
  },
  {
    id: '5',
    title: 'TP Chimie',
    subject: 'Physique-Chimie',
    dueDate: '2025-01-20',
    description: 'Synthèse de l\'aspirine',
    priority: 'low',
    completed: false
  }
];

export const messages = [
  {
    id: '1',
    senderName: 'M. Martin',
    senderRole: 'Professeur de Mathématiques',
    subject: 'Félicitations',
    content: 'Félicitations pour votre excellent résultat au dernier contrôle ! Continuez ainsi.',
    timestamp: '2025-01-15T14:30:00Z',
    read: false,
    priority: 'medium'
  },
  {
    id: '2',
    senderName: 'Administration',
    senderRole: 'Secrétariat',
    subject: 'Réunion parents-professeurs',
    content: 'Rappel : Réunion parents-professeurs le 25 janvier à 18h00 en salle polyvalente.',
    timestamp: '2025-01-15T09:00:00Z',
    read: true,
    priority: 'high'
  },
  {
    id: '3',
    senderName: 'Mme Leroy',
    senderRole: 'Professeur de Français',
    subject: 'Dissertation à rendre',
    content: 'N\'oubliez pas de rendre votre dissertation sur Voltaire avant le 25 janvier.',
    timestamp: '2025-01-14T16:00:00Z',
    read: false,
    priority: 'medium'
  }
];

export const achievements = [
  {
    id: '1',
    title: 'Mathématicien prodige',
    description: 'Obtenir plus de 17/20 en mathématiques pendant 3 évaluations consécutives',
    icon: 'Calculator',
    category: 'academic',
    points: 50,
    rarity: 'rare',
    earned: true,
    earnedDate: '2025-01-15'
  },
  {
    id: '2',
    title: 'Présence exemplaire',
    description: 'Aucune absence non justifiée pendant un trimestre',
    icon: 'Calendar',
    category: 'behavior',
    points: 30,
    rarity: 'uncommon',
    earned: false
  },
  {
    id: '3',
    title: 'Participation active',
    description: 'Participer activement en classe pendant un mois',
    icon: 'MessageCircle',
    category: 'participation',
    points: 25,
    rarity: 'common',
    earned: true,
    earnedDate: '2025-01-10'
  },
  {
    id: '4',
    title: 'Esprit d\'équipe',
    description: 'Aider ses camarades et collaborer efficacement',
    icon: 'Users',
    category: 'leadership',
    points: 40,
    rarity: 'uncommon',
    earned: false
  }
];

// ===========================
// DONNÉES POUR GESTION DES UTILISATEURS (Ajoutées de la v1)
// ===========================

export const currentUser: Student = {
  id: '1',
  name: 'Marie Dubois',
  email: 'marie.dubois@student.notecibolt.com',
  role: 'student',
  avatar: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?w=200&h=200&fit=crop&crop=face',
  phone: '+33 6 12 34 56 78',
  address: '123 Rue de la République, 75001 Paris',
  dateOfBirth: '2007-03-15',
  emergencyContact: {
    name: 'Pierre Dubois',
    phone: '+33 6 98 76 54 32',
    relationship: 'Père'
  },
  createdAt: '2023-09-01T08:00:00Z',
  updatedAt: '2025-01-15T10:30:00Z',
  isActive: true,
  studentId: 'STU2024001',
  parentIds: ['parent-1', 'parent-2'],
  classId: 'class-terminale-s',
  admissionDate: '2023-09-01',
  academicYear: '2024-2025',
  medicalInfo: {
    allergies: ['Arachides'],
    medications: [],
    emergencyMedicalContact: 'Dr. Martin - 01 42 34 56 78'
  },
  academicHistory: []
};

export const teachers: Teacher[] = [
  {
    id: 'teacher-1',
    name: 'M. Jean Martin',
    email: 'j.martin@notecibolt.com',
    role: 'teacher',
    avatar: 'https://images.pexels.com/photos/5212324/pexels-photo-5212324.jpeg?w=200&h=200&fit=crop&crop=face',
    phone: '+33 1 23 45 67 89',
    address: '45 Avenue des Écoles, 75005 Paris',
    dateOfBirth: '1980-07-22',
    createdAt: '2020-09-01T08:00:00Z',
    updatedAt: '2025-01-15T09:00:00Z',
    isActive: true,
    employeeId: 'EMP2020001',
    subjects: ['mathematics', 'physics'],
    classes: ['class-terminale-s', 'class-premiere-s'],
    qualifications: ['Agrégation de Mathématiques', 'Master en Physique'],
    hireDate: '2020-09-01',
    department: 'Sciences'
  },
  {
    id: 'teacher-2',
    name: 'Mme Sophie Leroy',
    email: 's.leroy@notecibolt.com',
    role: 'teacher',
    avatar: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?w=200&h=200&fit=crop&crop=face',
    phone: '+33 1 34 56 78 90',
    address: '78 Rue Victor Hugo, 75016 Paris',
    dateOfBirth: '1985-11-10',
    createdAt: '2021-09-01T08:00:00Z',
    updatedAt: '2025-01-15T09:00:00Z',
    isActive: true,
    employeeId: 'EMP2021002',
    subjects: ['french', 'literature'],
    classes: ['class-terminale-s', 'class-seconde-a'],
    qualifications: ['CAPES de Lettres Modernes', 'Master en Littérature'],
    hireDate: '2021-09-01',
    department: 'Lettres'
  },
  {
    id: 'teacher-3',
    name: 'Mme Catherine Dubois',
    email: 'c.dubois@notecibolt.com',
    role: 'teacher',
    avatar: 'https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?w=200&h=200&fit=crop&crop=face',
    phone: '+33 1 45 67 89 01',
    address: '32 Boulevard Saint-Germain, 75006 Paris',
    dateOfBirth: '1982-04-18',
    createdAt: '2019-09-01T08:00:00Z',
    updatedAt: '2025-01-15T09:00:00Z',
    isActive: true,
    employeeId: 'EMP2019003',
    subjects: ['english'],
    classes: ['class-terminale-s', 'class-premiere-s', 'class-seconde-a'],
    qualifications: ['Master en Anglais', 'CAPES d\'Anglais'],
    hireDate: '2019-09-01',
    department: 'Langues'
  }
];

export const parents: Parent[] = [
  {
    id: 'parent-1',
    name: 'Pierre Dubois',
    email: 'pierre.dubois@email.com',
    role: 'parent',
    phone: '+33 6 98 76 54 32',
    address: '123 Rue de la République, 75001 Paris',
    dateOfBirth: '1975-05-20',
    createdAt: '2023-09-01T08:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    isActive: true,
    childrenIds: ['1'],
    occupation: 'Ingénieur',
    preferredContactMethod: 'email'
  },
  {
    id: 'parent-2',
    name: 'Claire Martin',
    email: 'claire.martin@email.com',
    role: 'parent',
    avatar: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?w=200&h=200&fit=crop&crop=face',
    phone: '+33 6 87 65 43 21',
    address: '67 Avenue Montaigne, 75008 Paris',
    dateOfBirth: '1978-12-03',
    createdAt: '2023-08-15T08:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    isActive: true,
    childrenIds: ['student-2'],
    occupation: 'Médecin',
    preferredContactMethod: 'phone'
  },
  {
    id: 'parent-3',
    name: 'Ahmed Benali',
    email: 'ahmed.benali@email.com',
    role: 'parent',
    phone: '+33 6 76 54 32 10',
    address: '156 Rue de Rivoli, 75001 Paris',
    dateOfBirth: '1972-09-14',
    createdAt: '2023-07-20T08:00:00Z',
    updatedAt: '2025-01-15T10:00:00Z',
    isActive: true,
    childrenIds: ['student-3'],
    occupation: 'Architecte',
    preferredContactMethod: 'sms'
  }
];
