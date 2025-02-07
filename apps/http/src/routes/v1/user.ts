// import { UpdateMetaData } from './../../types/index';
import { UpdateMetaData } from "../../types";
import { Router } from "express";
import client from "@laceverse/db/client";
import { userMiddleware } from "../../middleware/user";
export const userRouter = Router();

userRouter.post("/metadata", userMiddleware, async (req, res) => {
  const parsedData = UpdateMetaData.safeParse(req.body);
  if (!parsedData.success) {
    console.log("parsed data incorrect");
    res.status(400).json({ message: "Validation failed" });
    return;
  }
  try {
    await client.user.update({
      where: {
        id: req.userId,
      },
      data: {
        avatarId: parsedData.data.avatarId,
      },
    });
    res.json({ message: "Metadata updated" });
  } catch (e) {
    console.log("error");
    res.status(400).json({ message: "Internal server error" });
  }
});

//getting others avatar id , to show on map
userRouter.get("/metadata/bulk", async (req, res) => {
  const userIdString = (req.query.ids ?? "[]") as string;
  const userIds = userIdString.slice(1, userIdString?.length - 1).split(",");
  console.log(userIds);
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