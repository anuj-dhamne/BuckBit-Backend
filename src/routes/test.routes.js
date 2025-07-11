import express from 'express';
import { testMonthlyReport } from '../controllers/reminder.controller.js';
import monthlyMail from '../utils/MonthlyMail.js';

const router = express.Router();

router.get('/test-report', testMonthlyReport);

router.get('/monthly-mail-send',monthlyMail);

export default router;
