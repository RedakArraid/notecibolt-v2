import { Router, Request, Response } from 'express';
const router = Router();
router.get('/', (req: Request, res: Response) => {
  res.json({ success: true, data: [], message: 'Parents endpoint' });
});
export default router;
