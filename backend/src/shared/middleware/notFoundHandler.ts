import { Request, Response } from 'express';

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} non trouvée`,
    code: 'ROUTE_NOT_FOUND',
    timestamp: new Date().toISOString(),
    availableEndpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      students: '/api/v1/students',
      teachers: '/api/v1/teachers',
      parents: '/api/v1/parents',
      classes: '/api/v1/classes',
      subjects: '/api/v1/subjects',
      grades: '/api/v1/grades',
      assignments: '/api/v1/assignments',
      attendance: '/api/v1/attendance',
      schedule: '/api/v1/schedule',
      admissions: '/api/v1/admissions',
      finance: '/api/v1/finance',
      messages: '/api/v1/messages',
      achievements: '/api/v1/achievements',
      reports: '/api/v1/reports',
      resources: '/api/v1/resources',
      virtualClasses: '/api/v1/virtual-classes',
      notifications: '/api/v1/notifications',
      docs: '/api/docs',
      health: '/health',
    },
  });
};
