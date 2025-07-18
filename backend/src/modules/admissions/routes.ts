import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req: Request, res: Response) => {
  try {
    const applications = await prisma.admissionApplication.findMany({
      include: {
        parent: {
          include: { user: true }
        },
        documents: true,
        stepProgress: true
      },
      orderBy: { submittedAt: 'desc' }
    });
    res.json({ success: true, data: applications });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur chargement admissions', error });
  }
});

export default router;
