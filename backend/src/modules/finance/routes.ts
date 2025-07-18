import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
const router = Router();
const prisma = new PrismaClient();

// GET /api/v1/finance - Liste des enregistrements financiers
router.get('/', async (req: Request, res: Response) => {
  try {
    const records = await prisma.financialRecord.findMany({
      include: {
        student: {
          include: {
            user: true,
            class: true
          }
        }
      },
      orderBy: { dueDate: 'desc' }
    });
    res.json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur chargement finance', error });
  }
});

export default router;
