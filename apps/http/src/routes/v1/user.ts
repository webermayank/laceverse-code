import { UpdateMetaData } from "../../types";
import { Router } from "express";
import client from "@laceverse/db/client";
import { userMiddleware } from "../../middleware/admin";
export const userRouter = Router();

userRouter.post("/metadata", userMiddleware, async(req, res) => {
  const parseData = UpdateMetaData.safeParse(req.body);
  if (!parseData.success) {
    res.status(400).json({ message: "invalid data" });
    return;
  }
 await client.user.update({
    where: {
      id: req.userId,
    },
    data: {
        avatarId: parseData.data.avatarId,
  
    },
  });
  res.json({ message: "Metadata has been updated" });
});

//getting others avatar id , to show on map
userRouter.get("/metadata/bulk",userMiddleware, async(req, res) => {
    const userIdsString = (req.query.userIds ??"[]") as string;
    const userIds = (userIdsString).slice(1,userIdsString?.length-2).split(","); //convert to array
   
    const metadata = await client.user.findMany({
        where: {
            id: {
                in: userIds,
            },
        },
        select: {
            avatar: true,
            id: true,
        },
    })
    res.json({
        avatars: metadata.map(m =>({
            userId :m.id,
            avatarId : m.avatar?.imageurl
        }))
    });
    
});
