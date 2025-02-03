

import jwt  from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECRET } from "../config";



export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];
    const token = header?.split(" ")[1]; //this converts "Bearer token" to [Bearer, token] AND GET 1st element
   
    if (!token) {
        res.status(403).json({ message: "unauthorized token" });
        return;
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { role: string, userId : string };
        if (decoded.role !== "Admin") {
            res.status(403).json({ message: "Unauthorized" });
            return;
        }
        req.userId = decoded.userId;
        next();
    }
     catch (error) {
        res.status(403).json({ message: "invalid token" });
        return;
    }
}