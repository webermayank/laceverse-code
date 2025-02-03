import { Router } from "express";
import { AddElementSchema, CreateElementSchema, CreateSpaceSchema, DeleteElementSchema } from "../../types";
import client from "@laceverse/db/client";
import { userMiddleware } from "../../middleware/admin";
export const spaceRouter = Router();

//api/v1/space

spaceRouter.post("/", userMiddleware, async (req, res) => {
  const parseData = CreateSpaceSchema.safeParse(req.body);
  if (!parseData.success) {
    res.status(400).json({ message: parseData.error.message });
    return;
  }
  if (!parseData.data.mapId) {
    const space = await client.space.create({
      data: {
        name: parseData.data.name,
        width: parseInt(parseData.data.dimensions.split("x")[0]),
        height: parseInt(parseData.data.dimensions.split("x")[1]),
        creatorId: req.userId!,
      },
    });
    res.json({ spaceId: space.id });
  }
  const map = await client.map.findUnique({
    where: {
      id: parseData.data.mapId,
    },
    select: {
      mapElements: true,
      width: true,
      height: true,
    },
  });
  if (!map) {
    res.status(400).json({ message: "map not found" });
    return;
  }

  //locking the database
  //the transaction will be rolled back if any of the queries fail taht means either both of the function inside transaction works or neither of them
  let space = await client.$transaction(async () => {
    const space = await client.space.create({
      data: {
        name: parseData.data.name,
        width: map.width,
        height: map.height,
        creatorId: req.userId!,
      },
    });

    await client.spaceElements.createMany({
      data: map.mapElements.map((element) => ({
        spaceId: space.id,
        elementId: element.id,
        x: element.x!,
        y: element.y!,
      })),
    });
    return space;
  });
  res.json({ spaceId: space.id });
});

spaceRouter.delete("/:spaceId", async (req, res) => {
  const space = await client.space.findUnique({
    where: {
      id: req.params.spaceId,
    },
    select: {
      creatorId: true,
    },
  });
  if (!space) {
    res.status(400).json({ message: "space not found" });
    return;
  }
  if (space.creatorId !== req.userId) {
    res.status(403).json({ message: "you dont have acces to the spaces" });
    return;
  }
  await client.space.delete({
    where: {
      id: req.params.spaceId,
    },
  });
  res.json({ message: "space deleted" });
});
spaceRouter.get("/all", userMiddleware, async (req, res) => {
  const spaces = await client.space.findMany({
    where: {
      creatorId: req.userId,
    },
  });
  res.json({
    spaces: spaces.map((s) => ({
      id: s.id,
      name: s.name,
      thumbnail: s.thumbnail,
      dimensions: `${s.width}x${s.height}`,
    })),
  });
});

spaceRouter.post("/element", async (req, res) => {
  const parseData = AddElementSchema.safeParse(req.body);
  if (!parseData.success) {
    res.status(400).json({ message:"failed getting data" });
    return;
  }

  const space = await client.space.findUnique({
    where: {
      id: req.body.spaceId,
      creatorId: req.userId,
    },
    select: {
      width: true,
      height: true,
    },
  });
    if (!space) {
        res.status(400).json({ message: "space not found" });
        return;
    }
  await client.spaceElements.create({
    data: {
      spaceId: req.body.spaceId,
      elementId: req.body.elementID,
      x: req.body.x,
      y: req.body.y,
    },
  });
    res.json({ message: "element added" });
  
});
spaceRouter.delete("/element",userMiddleware,async (req, res) => {
    const parseData = DeleteElementSchema.safeParse(req.body);
    if (!parseData.success) {
        res.status(400).json({ message: "validation failed" });
        return;
    }

 const spaceElement =await client.spaceElements.findFirst({
    where: {
        id: parseData.data.id,
        },include: {
            space:true
        }
    })  
    if (!spaceElement?.space.creatorId || spaceElement.space.creatorId !== req.userId) {
        res.status(400).json({ message: "Unauthorized" });
        return;
    }
    //delte the element
    await client.spaceElements.delete({
        where: {
            id: parseData.data.id,
        },
    });
    res.json({ message: "element deleted" });
});

spaceRouter.get("/:spaceId", async (req, res) => {
    const space = await client.space.findUnique({
        where: {
            id: req.params.spaceId,
        },include:{
            elements:{
                include: {
                    element: true,
                }
            }

        }
    })
    if (!space) {
        res.status(400).json({ message: "space not found" });
        return;
    }
    res.json({
        dimensions: `${space.width}x${space.height}`,
        id: space.id,
        name: space.name,
        elements: space.elements.map(e => ({
            id: e.id,
            element : {
                id: e.id,
                imageUrl: e.element.imageurl,
                width: e.element.width,
                height: e.element.height,
                static: e.element.static,
            },
            x: e.x,
            y: e.y
        }))
    })
});
