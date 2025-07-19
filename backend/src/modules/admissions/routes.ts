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

router.post('/', async (req: Request, res: Response) => {
  try {
    const {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      nationality,
      previousSchool,
      desiredClass,
      academicYear,
      specialNeeds,
      fatherName,
      fatherEmail,
      fatherPhone,
      fatherOccupation,
      motherName,
      motherEmail,
      motherPhone,
      motherOccupation,
      guardianName,
      guardianEmail,
      guardianPhone,
      familyAddress,
      notes
    } = req.body;

    // Générer un numéro de dossier unique (exemple simple)
    const applicationNumber = `ADM-${Date.now()}`;

    const newApplication = await prisma.admissionApplication.create({
      data: {
        applicationNumber,
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        nationality,
        previousSchool,
        desiredClass,
        academicYear,
        specialNeeds,
        fatherName,
        fatherEmail,
        fatherPhone,
        fatherOccupation,
        motherName,
        motherEmail,
        motherPhone,
        motherOccupation,
        guardianName,
        guardianEmail,
        guardianPhone,
        familyAddress,
        notes,
        status: 'SUBMITTED',
        submittedAt: new Date()
      }
    });
    res.status(201).json({ success: true, data: newApplication });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur création candidature', error });
  }
});

router.patch('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const data = req.body;
    const updated = await prisma.admissionApplication.update({
      where: { id },
      data: {
        ...data,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        updatedAt: new Date()
      }
    });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Erreur modification candidature', error });
  }
});

export default router;
