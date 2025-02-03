import { UpdateMetaData } from "../../types";
import { Router } from "express";
import client from "@laceverse/db/client";
import { userMiddleware } from "../../middleware/user";
export const userRouter = Router();

userRouter.post("/metadata", userMiddleware, async (req, res) => {
  const parseData = UpdateMetaData.safeParse(req.body);
  if (!parseData.success) {
    console.log("parsed data not correctt")
    res.status(400).json({ message: "invalid data" });
    return;
  }
    console.log("13-13666666666-1", req.body);

  try {
    await client.user.update({
      where: {
        id: req.userId,
      },
      data: {
        avatarId: parseData.data.avatarId,
      }
    });
    res.json({ message: "Metadata has been updated" });
  } catch (error) {
    console.error("error while updating metadata", error);
    res.status(400).json({message: "Internal server error"})
    
  }
});

//getting others avatar id , to show on map
userRouter.get("/metadata/bulk", userMiddleware, async (req, res) => {
  const userIdsString = (req.query.userIds ?? "[]") as string;
  const userIds = (userIdsString).slice(1, userIdsString?.length - 1).split(","); //convert to array
  console.log(userIds)
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
  });
  res.json({
    avatars: metadata.map((m) => ({
      userId: m.id,
      avatarId: m.avatar?.imageurl,
    })),
  });
});
