import connectDB from "./db/index.js";
import dotenv from "dotenv"
dotenv.config({
    path:"./.env"
})

import { app } from "./app.js";

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 7000,()=>{
        console.log("Server is running on ",process.env.PORT)
    })
})
.catch((err)=>{
console.log("MongoDb connection get failed",err);
})