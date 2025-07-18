import { Router, Request, Response } from 'express';
const router = Router();
router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, data: [], message: 'Achievements endpoint' });
});
export default router;
