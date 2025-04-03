import { TopicModel } from "@/models/topicsmodel";
import Elysia, { t } from "elysia";

export const topicsController = new Elysia({
  prefix: "/topics",
  detail: {
    description: "Admin - Topics",
    summary: "Admin - Topics",
    tags: ["Admin - Topics"],
  },
})
  .post(
    "/create",
    async ({ body, set, store }) => {
      const { topicName, popularity } = body;

      try {
        const newTopic = new TopicModel({
          topicName,
          popularity
        });

        await newTopic.save();

        set.status = 200;
        return { message: "Topic created successfully", ok: true };
      } catch (error: any) {
        set.status = 500;
        return {
          message: "An internal error occurred while creating topic.",
          ok: false,
        };
      }
    },
    {
      body: t.Object({
        topicName: t.String(),
        popularity: t.String(),
      }),
      detail: {
        description: "Create topic",
        summary: "Create topic",
      },
    }
  )
  .get(
    "/all",
    async ({ query, set, store }) => {
      const { page = 1, limit = 10, q } = query;

      try {
        const topics = await TopicModel.find({
          isDeleted: false,
          topicName: {
            $regex: q,
            $options: "i",
          },
        })
          .sort({ popularity: 1, topicName: 1, _id: -1 })
          .skip((page - 1) * limit)
          .limit(limit);

        const totalTopics = await TopicModel.countDocuments({
          isDeleted: false,
          topicName: {
            $regex: q,
            $options: "i",
          },
        });

        return {
          topics,
          total: totalTopics,
          ok: true,
        };
      } catch (error: any) {
        set.status = 500;
        return {
          message: "An internal error occurred while fetching topics.",
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
        description: "Get topics",
        summary: "Get topics",
      },
    }
  )
  .put(
    "/:id",
    async ({ body, set, store, params }) => {
      const { topicName, popularity } = body;
      const { id } = params;

      try {
        const topic = await TopicModel.findById(id);

        if (!topic) {
          return {
            message: "Topic not found",
          };
        }

        topic.topicName = topicName;
        topic.popularity = Number(popularity);
        await topic.save();

        set.status = 200;
        return { message: "Topic updated successfully", ok: true };
      } catch (error: any) {
        set.status = 500;
        return {
          message: "An internal error occurred while updating topic.",
          ok: false,
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        topicName: t.String(),
        popularity: t.String(),
      }),
      detail: {
        description: "Update topic",
        summary: "Update topic",
      },
    }
  )
  .delete(
    "/:id",
    async ({ query, set, store, params }) => {
      const { permanent } = query;
      const { id } = params;

      try {
        const topic = await TopicModel.findById(id);

        if (!topic) {
          return {
            message: "Topic not found",
          };
        }

        if (permanent) {
          topic.active = false;
          topic.isDeleted = true;
          await topic.save();

          return {
            message: "Topic deleted ",
            ok: true,
          };
        }

        topic.active = !topic.active;
        await topic.save();

        set.status = 200;
        return {
          message: "Topic Updated Successfully",
          ok: true,
        };
      } catch (error: any) {
        set.status = 500;
        return {
          message: "An internal error occurred while deleting topic.",
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
        description: "Delete topic",
        summary: "Delete topic",
      },
    }
  )
  .get(
    "/select",
    async ({ query, set }) => {
      try {
        const topics = await TopicModel.find(
          {
            isDeleted: false,
            active: true,
          },
          "_id topicName"
        ).sort({ createdAt: -1 });

        return {
          topics,
          ok: true,
        };
      } catch (error: any) {
        set.status = 500;
        return {
          message: "An internal error occurred while fetching topics.",
          ok: false,
        };
      }
    },
    {
      detail: {
        description: "Get topics",
        summary: "Get topics",
      },
    }
  );
