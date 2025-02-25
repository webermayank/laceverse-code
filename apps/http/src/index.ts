import express from 'express';
import { router } from './routes/v1';
import cors from'cors';
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173", // Allow requests from this origin
    methods: ["GET", "POST", "PUT", "DELETE"], // Specify allowed methods
    credentials: true, // Allow credentials if needed
  })
);

//creating the router that is going to handle the api/v1 reqeusts
app.use('/api/v1',router);

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is running on port 3000");
});