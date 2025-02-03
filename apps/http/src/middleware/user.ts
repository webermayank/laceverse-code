

import jwt  from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../config";



export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const token = header?.split(" ")[1]; //this converts "Bearer token" to [Bearer, token] AND GET 1st element
    console.log(req.route.path)
    if(req.route.path ==="/api/v1/space"){
        console.log(token)
    }
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
    }
}