import express from 'express';
import { router } from './routes/v1';
const app = express();
app.use(express.json());

//creating the router that is going to handle the api/v1 reqeusts
app.use('/api/v1',router);

app.listen(process.env.PORT || 3000,()=>{
    console.log("Server is running on port 3000");
});