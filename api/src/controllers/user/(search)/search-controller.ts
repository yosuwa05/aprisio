import { PostModel } from "@/models";
import { SubTopicModel } from "@/models/subtopicmodel";
import Elysia, { t } from "elysia";

export const SearchController = new Elysia({
  prefix: "/search",
  detail: {
    summary: "Global Search",
    description: "Search for users by name, email, or username",
    tags: ["Posts - Search"],
  },
}).get(
  "/",
  async ({ query, set }) => {
    try {
      const { q, limit, page } = query;

      const posts = await PostModel.find(
        {
          $or: [
            { title: { $regex: q, $options: "i" } },
            { description: { $regex: q, $options: "i" } },
          ],
        },
        "title slug description",
      )
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec();

      const topics = await SubTopicModel.find(
        {
          $or: [
            { subTopicName: { $regex: q, $options: "i" } },
            // { description: { $regex: q, $options: "i" } },
          ],
        },
        "subTopicName slug description",
      )
        .skip((page - 1) * limit)
        .limit(limit)
        .lean()
        .exec();

      return { posts, topics, ok: true, message: "Users found successfully" };
    } catch (error) {
      console.error(error);
      return { error: "An error occurred while searching for users." };
    }
  },
  {
    query: t.Object({
      q: t.String(),
      limit: t.Number({ minimum: 1, maximum: 100 }),
      page: t.Number({ minimum: 1, maximum: 100 }),
    }),
  },
);
