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
