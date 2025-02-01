import { Router } from "express";
import { userRouter } from "./user";
import { spaceRouter } from "./space";
import { adminRouter } from "./admin";
export const router = Router();

router.post("/signup", (req, res) => {
  res.json({
    message:"signup",
  })
});

router.post("/signin",(req,res)=>{
    res.json({
        message:"signin"
    })
})

//to see the all available elements , it works idependently
router.get("/elements",(req,res)=>{

})
router.get("/avatars",(req,res)=>{

})

router.use("/user",userRouter);
router.use("/space",spaceRouter);
router.use("/admin",adminRouter);