
import { Router } from "express";
import { adminMiddleware } from "../../middleware/admin";
import {
  AddElementSchema,
  CreateAvatarSchema,
  CreateElementSchema,
  CreateMapSchema,
  UpdateElementSchema,
} from "../../types";
import client from "@laceverse/db/client";
export const adminRouter = Router();

//api/v1/space
adminRouter.post("/element", adminMiddleware, async (req, res) => {
  const parseData = CreateElementSchema.safeParse(req.body);
  if (!parseData.success) {
    res.status(400).json({ message: "validation failed" });

    return;
  }

  const element = await client.element.create({
    data: {
      width: parseData.data.width,
      height: parseData.data.height,
      static: parseData.data.static,
      imageurl: parseData.data.imageUrl,
    },
  });
  res.json({
    id: element.id,
  });
});

adminRouter.put("/element/:elementId", adminMiddleware, async (req, res) => {
  const parseData = UpdateElementSchema.safeParse(req.body);
  if (!parseData.success) {
    res.status(400).json({ message: "validation failed" });
    return;
  }
  await client.element.update({
    where: { id: req.params.elementId },
    data: { imageurl: parseData.data.imageUrl },
  });
  res.json({ message: "Element updated successfully" });
});
adminRouter.post("/avatar", adminMiddleware, async (req, res) => {
  const parseData = CreateAvatarSchema.safeParse(req.body);
  if (!parseData.success) {
    res.status(400).json({ message: "validation failed" });
    return;
  }
  const avatar = await client.avatar.create({
    data: {
      name: parseData.data.name,
      imageurl: parseData.data.imageUrl,
    },
  });
  // console.log("1-2-2-2-2-2-2-2", req.body.avatar)
  res.json({
    id: avatar.id,
  });
});
adminRouter.post("/map", adminMiddleware, async (req, res) => {
  const parseData = CreateMapSchema.safeParse(req.body);
  console.log("parseData")
  console.log(parseData)
  if (!parseData.success) {
    res.status(400).json({ message: "validation failed" });
            console.log(
  "-7-7-7-7-7--7-7-7-7-77--77-7-7-7-7--7-7-7-7-77--77-7-7-7-7--7-7-7-7-77--77-7-7-7-7--7-7-7-7-77--7")

    return;
  }


  const map = await client.map.create({
    data: {
      name: parseData.data.name,
      width: parseInt(parseData.data.dimensions.split("x")[0]),
      height: parseInt(parseData.data.dimensions.split("x")[1]),
      thumbnail: parseData.data.thumbnail,
      mapElements: {
        create: parseData.data.defaultElements.map((e) => ({
          elementId: e.elementId,
          x: e.x,
          y: e.y,
        })),
      },
    },
  });
  res.json({ 
    id :map.id 
  });
});
