import { saveFile } from "@/lib/file-s3";
import { slugify } from "@/lib/utils";
import { EventModel } from "@/models/events.model";
import { GroupModel } from "@/models/group.model";
import { GroupPhotoModel } from "@/models/groupphotos.model";
import { SubTopicModel } from "@/models/subtopicmodel";
import Elysia, { t } from "elysia";

export const groupController = new Elysia({
  prefix: "/group",
  detail: {
    description: "Group controller",
    tags: ["User - Group"],
  },
}).post(
  "/create",
  async ({ body, set, store }) => {
    const {
      groupName,
      description,
      eventDate,
      location,
      eventName,
      eventRules,
      subtopicId,
      file,
    } = body;

    try {
      const userId = (store as any)["id"];

      if (!userId) {
        set.status = 401;
        return {
          message: "Unauthorized",
          ok: false,
        };
      }

      const existingGroup = await GroupModel.findOne({ name: groupName });

      if (existingGroup) {
        return {
          message: "Duplicate entry. Group already exists.",
          ok: false,
        };
      }

      const subTopic = await SubTopicModel.findOne({ slug: subtopicId });

      if (!subTopic) {
        return {
          message: "Invalid subtopic",
          ok: false,
        };
      }

      const newGroup = new GroupModel({
        name: groupName,
        description,
        location,
        subTopic: subTopic?._id,
        slug: slugify(groupName),
      });

      let eventRulesData = {
        total: 0,
        events: [],
      };

      if (eventRules) eventRulesData = JSON.parse(eventRules);

      newGroup.groupAdmin = userId;

      let filePromises = [];

      if (file && file.length > 0) {
        for (let i of file) {
          const { filename, ok } = await saveFile(i, "group-images");

          if (!ok) {
            return {
              message: "Error uploading file",
              ok: false,
            };
          }

          let newPic = new GroupPhotoModel({
            group: newGroup._id,
            photo: filename,
          });

          filePromises.push(newPic.save());
        }
      }

      await Promise.all(filePromises);

      if (eventName) {
        const newEvent = new EventModel({
          date: eventDate,
          name: eventName,
          rules: eventRulesData.events,
          eventName,
          location: location,
          group: newGroup._id,
        });
        newGroup.events.push(newEvent._id);
        await newEvent.save();
      }

      await newGroup.save();

      set.status = 200;
      return { message: "Group created successfully", ok: true };
    } catch (error: any) {
      set.status = 500;
      console.error(error);
      return {
        message: error,
        ok: false,
      };
    }
  },
  {
    body: t.Object({
      groupName: t.String(),
      description: t.String(),
      location: t.Optional(t.String()),
      eventName: t.Optional(t.String()),
      eventRules: t.Optional(t.String()),
      eventDate: t.Optional(t.String()),
      subtopicId: t.String(),
      file: t.Optional(
        t.Files({
          default: [],
        })
      ),
    }),
    detail: {
      summary: "Create a new group",
    },
  }
);
