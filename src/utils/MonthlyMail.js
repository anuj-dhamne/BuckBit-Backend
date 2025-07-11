import { User } from '../models/user.model.js';
import { Expense } from '../models/expense.model.js'; // Update path as per your project
import { generateMonthlyPDF } from './generateMonthlyPDF.js'; // Path to your PDF function
import sendMonthlyReportEmail from './sendEmail.js'; // We’ll implement this next
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';
import fs from 'fs/promises'; 


const monthlyMail=( async (req,res) => {
    // console.log('📅 Running Monthly Report Job -', new Date().toISOString());
    const secret=req.query.secret;
    if(secret !== process.env.CRON_SECRET){
        return res.status(403).json({message :"Unauthorized"});
    }

    try {
        const users = await User.find({isMailAllow : true}); // You can add filters here

        for (const user of users) {
            const prevMonthStart = startOfMonth(subMonths(new Date(), 1));
            const prevMonthEnd = endOfMonth(subMonths(new Date(), 1));

            const expenses = await Expense.find({
                owner: user._id,
                date: { $gte: prevMonthStart, $lte: prevMonthEnd }
            });

            if (!expenses.length) {
                console.log(`⚠️ No expenses found for ${user.email} in last month.`);
                continue;
            }

            const monthName = prevMonthStart.toLocaleString('default', { month: 'long', year: 'numeric' });

            // pdf making 
            const pdfPath = await generateMonthlyPDF(user, expenses, monthName);

            // send Email 
            await sendMonthlyReportEmail(user.email, monthName, pdfPath);
            console.log(`✅ Sent report to ${user.email}`);

             try {
                await fs.unlink(pdfPath);
                console.log(`🗑️ Deleted report: ${pdfPath}`);
            } catch (unlinkErr) {
                console.error(`⚠️ Failed to delete report ${pdfPath}:`, unlinkErr.message);
            }
        }

        return res.status(200).json({msg:"All Mail send to the users ! "});
    } catch (err) {
        console.error("❌ Error in monthly report scheduler:", err.message);
    }
});

export default monthlyMail;
