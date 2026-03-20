"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
router.get('/dashboard', async (req, res) => {
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
    }
    catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
