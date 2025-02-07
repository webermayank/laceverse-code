import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { NextFunction, Request, Response } from "express";

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["authorization"];
  const token = header?.split(" ")[1];  
  console.log("Authorization Header:", header); // Debugging line
  console.log("Extracted Token:", token); // Debugging line
  console.log(req.route.path);
  console.log(token);

  if (!token) {
    res.status(403).json({ message: "Unauthorized not token" });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      role: string;
      userId: string;
    };
    req.userId = decoded.userId;
    console.log("Decoded User ID:", req.userId); // Debugging line

    next();
  } catch (e) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
