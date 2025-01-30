import { SubTopicModel } from "@/models/subtopicmodel";
import Elysia, { t } from "elysia";
import { Types } from "mongoose";

export const subtopicController = new Elysia({
  prefix: "/subtopic",
  detail: {
    description: "Admin - SubTopics",
    summary: "Admin - SubTopics",
    tags: ["Admin - SubTopics"],
  },
})
  .post(
    "/create",
    async ({ body, set, store }) => {
      const { subTopicName, topic, description } = body;

      try {
        const existing = await SubTopicModel.findOne({
          subTopicName,
          topic,
        });

        if (existing) {
          return {
            message: "SubTopic already exists",
          };
        }

        const newSubTopic = new SubTopicModel({
          subTopicName,
          topic,
          description,
          active: true,
          isDeleted: false,
        });

        await newSubTopic.save();

        set.status = 200;
        return { message: "SubTopic created successfully", ok: true };
      } catch (error: any) {
        set.status = 500;
        return {
          message: "An internal error occurred while creating subtopic.",
          ok: false,
        };
      }
    },
    {
      body: t.Object({
        subTopicName: t.String(),
        topic: t.String(),
        description: t.String(),
      }),
      detail: {
        description: "Create subtopic",
        summary: "Create subtopic",
      },
    }
  )
  .get(
    "/all",
    async ({ query, set }) => {
      const { page = 1, limit = 10, q } = query;

      try {
        const subtopics = await SubTopicModel.find({
          isDeleted: false,
          subTopicName: {
            $regex: q,
            $options: "i",
          },
        })
          .populate({
            path: "topic",
            select: "topicName",
          })
          .sort({ createdAt: -1 })
          .skip((page - 1) * limit)
          .limit(limit)
          .lean();

        const totalSubtopics = await SubTopicModel.countDocuments({
          isDeleted: false,
          subTopicName: {
            $regex: q,
            $options: "i",
          },
        });

        return {
          subtopics,
          total: totalSubtopics,
          ok: true,
        };
      } catch (error: any) {
        console.log(error);
        set.status = 500;
        return {
          message: "An internal error occurred while fetching subtopics.",
          ok: false,
        };
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.Number()),
        limit: t.Optional(t.Number()),
        q: t.Optional(t.String()),
      }),
      detail: {
        description: "Get subtopics",
        summary: "Get subtopics",
      },
    }
  )
  .put(
    "/:id",
    async ({ body, set, store, params }) => {
      const { subTopicName, topic, description } = body;
      const { id } = params;

      try {
        const subtopic = await SubTopicModel.findById(id);

        if (!subtopic) {
          return {
            message: "SubTopic not found",
          };
        }

        subtopic.subTopicName = subTopicName;
        subtopic.topic = new Types.ObjectId(topic);
        subtopic.description = description;

        await subtopic.save();

        set.status = 200;
        return { message: "SubTopic updated successfully", ok: true };
      } catch (error: any) {
        set.status = 500;
        return {
          message: "An internal error occurred while updating subtopic.",
          ok: false,
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        subTopicName: t.String(),
        topic: t.String(),
        description: t.String(),
      }),
      detail: {
        description: "Update subtopic",
        summary: "Update subtopic",
      },
    }
  )
  .delete(
    "/:id",
    async ({ query, set, store, params }) => {
      const { permanent } = query;
      const { id } = params;

      try {
        const subtopic = await SubTopicModel.findById(id);

        if (!subtopic) {
          return {
            message: "SubTopic not found",
          };
        }

        if (permanent) {
          subtopic.active = false;
          subtopic.isDeleted = true;
          await subtopic.save();

          return {
            message: "SubTopic deleted permanently",
            ok: true,
          };
        }

        subtopic.active = !subtopic.active;
        await subtopic.save();

        set.status = 200;
        return {
          message: "SubTopic Deactivated Successfully",
          ok: true,
        };
      } catch (error: any) {
        set.status = 500;
        return {
          message: "An internal error occurred while deleting subtopic.",
          ok: false,
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      query: t.Object({
        permanent: t.Optional(t.Boolean()),
      }),
      detail: {
        description: "Delete subtopic",
        summary: "Delete subtopic",
      },
    }
  );
