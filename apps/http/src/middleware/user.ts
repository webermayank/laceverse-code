

import jwt  from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../config";



export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    const token = header?.split(" ")[1]; //this converts "Bearer token" to [Bearer, token] AND GET 1st element
    //   console.log("4444444=4=4=4=4==4=4=4=4");
    //   console.log(token);
    if (!token) {
        res.status(403).json({ message: "invalid token" });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { role: string, userId : string };
        req.userId = decoded.userId;
        
        next();
    }
     catch (error) {
        res.status(403).json({ message: "invalid token" });
        return;
    }
}