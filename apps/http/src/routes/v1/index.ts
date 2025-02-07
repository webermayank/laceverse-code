import { Router } from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
import { SigninSchema, SignupSchema } from "../../types";
import jwt from "jsonwebtoken";
export const router = Router();
import client from "@laceverse/db/client";
import { JWT_SECRET } from "../../config";
import { compare, hash } from "../../s_crypt";

router.post("/signup", async (req, res) => {
  const paresdData = SignupSchema.safeParse(req.body);
  if (!paresdData.success) {
    // console.log("parsed data is incorrect")
    res.status(400).json({ message: "invalid data"});
    return;
  }

  const hashedPassword = await hash(paresdData.data.password);

  try {
    const user = await client.user.create({
      data: {
        username: paresdData.data.username,
        password: hashedPassword,
        role: paresdData.data.type === "admin" ? "Admin" : "User",
      },
    });
    res.json({
      userId: user.id,
    });
  } catch (error) {
    // console.log("-r-r-rr--r-r-rr-ror",error);
    res.status(400).json({ message: "User already exists" });
  }
});

router.post("/signin", async (req, res) => {
  const parsedData = SigninSchema.safeParse(req.body);
  if (!parsedData.success) {
    res.status(403).json({ message: "invalid data" });
    return;
  }
  try {
    const user = await client.user.findUnique({
      where: {
        username: parsedData.data.username,
      },
    });
    // console.log(user);
    if (!user) {
      res.status(403).json({ message: "user not found" });
      return;
    }
    const isPasswordValid = await compare(
      parsedData.data.password,
      user.password
    );
    if (!isPasswordValid) {
      res.status(403).json({ message: "invalid password" });
      return;
    }
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_SECRET
    );
    res.json({
      token
    });
    // console.log(token);
  } catch (error) {
    res.status(400).json({ message: "internal server error" });
  }
});

//to see the all available elements , it works idependently
router.get("/elements",async (req, res) => {
  const elements = await client.element.findMany();
  res.json({ elements: elements.map(e=>({
    id:e.id,
    imagerrl: e.imageurl,
    static:e.static,
    width: e.width,
    height: e.height,
  }))});
});
router.get("/avatars", async (req, res) => {
  const avatars =await client.avatar.findMany();
  res.json({avatars:avatars.map(e=>({
    id:e.id,
    name:e.name,
    imageurl:e.imageurl,
  }))});
  // console.log("avavvvvvvvvvvaaaaaaaaaaaaattttttttaaaaaarrrrrrrrr",avatars); 
});

router.use("/user", userRouter);
router.use("/space", spaceRouter);
router.use("/admin", adminRouter);
