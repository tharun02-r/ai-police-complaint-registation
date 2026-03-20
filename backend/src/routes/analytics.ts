import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/dashboard', async (req: Request, res: Response) => {
  try {
    const totalComplaints = await prisma.complaint.count();
    
    // Complaints by priority
    const urgentComplaints = await prisma.complaint.count({
      where: { priority: 'URGENT' }
    });
    const highComplaints = await prisma.complaint.count({
      where: { priority: 'HIGH' }
    });

    // Group by category
    const categoryStats = await prisma.complaint.groupBy({
      by: ['category'],
      _count: { category: true }
    });

    res.json({
      totalComplaints,
      urgentComplaints,
      highComplaints,
      categoryStats
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
