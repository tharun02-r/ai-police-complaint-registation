import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-hackathon';

// --- CITIZEN AUTH ---

router.post('/citizen/register', async (req: Request, res: Response): Promise<any> => {
  const { email, password, name } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const existing = await prisma.citizen.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });

    const passwordHash = await bcrypt.hash(password, 10);
    const citizen = await prisma.citizen.create({
      data: { email, passwordHash, name }
    });

    const token = jwt.sign({ id: citizen.id, role: 'CITIZEN' }, JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ token, user: { id: citizen.id, email, name } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/citizen/login', async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const citizen = await prisma.citizen.findUnique({ where: { email } });
    if (!citizen) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, citizen.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: citizen.id, role: 'CITIZEN' }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, user: { id: citizen.id, email: citizen.email, name: citizen.name } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- POLICE AUTH ---

router.post('/police/login', async (req: Request, res: Response): Promise<any> => {
  const { policeId, password } = req.body;
  
  if (!policeId || !password) return res.status(400).json({ error: 'Police ID and password required' });

  // Explicitly validate Policy ID length and alphanumeric via JS
  const alphanumericRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/;
  if (policeId.length < 6 || !alphanumericRegex.test(policeId)) {
    return res.status(400).json({ error: 'Police ID must be at least 6 characters and contain both letters and numbers' });
  }

  try {
    // Upsert stub user for Hackathon testing purposes if they don't exist
    let officer = await prisma.policeOfficer.findUnique({ where: { policeId } });
    
    if (!officer) {
      if (password === 'admin123') { // Backdoor to auto-create for demo
        const passwordHash = await bcrypt.hash(password, 10);
        officer = await prisma.policeOfficer.create({
          data: { policeId, passwordHash, stationName: 'Central HQ' }
        });
      } else {
        return res.status(400).json({ error: 'Invalid credentials' });
      }
    }

    const isMatch = await bcrypt.compare(password, officer.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: officer.id, role: 'POLICE', station: officer.stationName }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, officer: { id: officer.id, policeId: officer.policeId, station: officer.stationName } });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
