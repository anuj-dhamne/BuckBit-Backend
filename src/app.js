import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import './utils/reminderCron.js'
import testRoutes from './routes/test.routes.js';
const app= express();

app.use(cors({
    origin:["https://buckbit.vercel.app"],
    // origin:"http://localhost:5173",
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static("public"))
app.use(cookieParser())

// ping route -> to awake the server
app.get('/', (req, res) => {
  res.send('Backend is alive!');
});

// test mail routes : 
app.use('/api', testRoutes);
//user route imports 
import userRouter from "./routes/user.routes.js"
app.use("/api/v1/users",userRouter)

//expenses route imports
import expenseRoute from "./routes/expense.routes.js"
app.use("/api/v1/users/expenses",expenseRoute)


export{app};