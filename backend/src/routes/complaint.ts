import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { analyzeComplaint } from '../services/aiService';

const router = Router();
const prisma = new PrismaClient();

// Fetch complaints
router.get('/', async (req: Request, res: Response) => {
  try {
    const complaints = await prisma.complaint.findMany({
      include: { citizen: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ complaints });
  } catch (error) {
    console.error('Fetch complaints error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Submit a new complaint
router.post('/submit', async (req: Request, res: Response): Promise<any> => {
  const { citizenId, text, language, location, evidenceUrls } = req.body;

  if (!citizenId || !text || !language) {
    return res.status(400).json({ error: 'Missing required fields: citizenId, text, language' });
  }

  try {
    // 1. Analyze text using AI (Mock)
    const aiResult = await analyzeComplaint(text, language);

    // 2. Validate if missing critical fields
    if (aiResult.missingFields.length > 0) {
      // Suggest AI prompt for the citizen to clarify
      return res.status(400).json({ 
        error: 'Incomplete complaint',
        missingFields: aiResult.missingFields,
        aiPrompt: `Please provide more details regarding: ${aiResult.missingFields.join(', ')}`
      });
    }

    // 3. Save complaint
    const complaint = await prisma.complaint.create({
      data: {
        citizenId,
        originalText: text,
        originalLanguage: language,
        translatedText: aiResult.translatedText,
        category: aiResult.category,
        priority: aiResult.priority,
        location: location || aiResult.extractedLocation,
        evidenceUrls: evidenceUrls ? JSON.stringify(evidenceUrls) : null,
        status: 'PENDING'
      }
    });

    res.status(201).json({ message: 'Complaint submitted successfully', complaint });

  } catch (error) {
    console.error('Submit complaint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update complaint status (Close Case)
router.put('/:id/status', async (req: Request, res: Response): Promise<any> => {
  const id = req.params.id as string;
  const status = req.body.status as string;
  
  if (!status) return res.status(400).json({ error: 'Status is required' });

  try {
    const complaint = await prisma.complaint.update({
      where: { id },
      data: { status }
    });
    res.json({ message: 'Status updated', complaint });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
