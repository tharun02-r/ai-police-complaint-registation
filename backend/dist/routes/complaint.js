"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const aiService_1 = require("../services/aiService");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Fetch complaints
router.get('/', async (req, res) => {
    try {
        const complaints = await prisma.complaint.findMany({
            include: { citizen: true },
            orderBy: { createdAt: 'desc' },
        });
        res.json({ complaints });
    }
    catch (error) {
        console.error('Fetch complaints error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
// Submit a new complaint
router.post('/submit', async (req, res) => {
    const { citizenId, text, language, location, evidenceUrls } = req.body;
    if (!citizenId || !text || !language) {
        return res.status(400).json({ error: 'Missing required fields: citizenId, text, language' });
    }
    try {
        // 1. Analyze text using AI (Mock)
        const aiResult = await (0, aiService_1.analyzeComplaint)(text, language);
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
    }
    catch (error) {
        console.error('Submit complaint error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
