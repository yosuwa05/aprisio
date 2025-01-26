import { slugify } from "@/lib/utils";
import { PostModel } from "@/models/postmodel";
import { StoreType } from "@/types";
import Elysia, { t } from "elysia";

export const postController = new Elysia({
  prefix: "/post",
  detail: {
    description: "Post controller",
    tags: ["User - Post"],
    summary: "User Post Management",
  },
}).post(
  "/create",
  async ({ body, set, store }) => {
    const { title, description } = body;
    try {
      const userId = (store as StoreType)["id"];

      const existingPost = await PostModel.findOne({ title });

      if (existingPost) {
        return { message: "Duplicate entry. Title already exists.", ok: false };
      }

      const newPost = new PostModel({
        title,
        description,
        slug: slugify(title),
        author: userId,
      });

      await newPost.save();
      set.status = 200;
      return { message: "Post created successfully", ok: true };
    } catch (error: any) {
      console.error("Error saving post data:", error);

      set.status = 500;
      return {
        message: "An internal error occurred while processing the post.",
        ok: false,
      };
    }
  },
  {
    body: t.Object({
      title: t.String(),
      description: t.String(),
    }),
    detail: {
      description: "Create post",
      summary: "Create post",
    },
  }
);
