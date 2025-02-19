import { saveFile } from "@/lib/file-s3";
import { slugify } from "@/lib/utils";
import { LikeModel, PostModel } from "@/models";
import { GroupModel } from "@/models/group.model";
import { SubTopicModel } from "@/models/subtopicmodel";
import { UserSubTopicModel } from "@/models/usersubtopic.model";
import { StoreType } from "@/types";
import Elysia, { t } from "elysia";

export const authenticatedPostController = new Elysia({
  prefix: "/authenticated/post",
  detail: {
    description: "Post controller",
    tags: ["User - Post - (Auth)"],
  },
})
  .post(
    "/create",
    async ({ body, set, store }) => {
      const { title, description, url, file, slug } = body;

      try {
        const userId = (store as StoreType)["id"];

        if (!userId) {
          set.status = 401;
          return {
            message: "Unauthorized",
            ok: false,
          };
        }

        if (title.length > 100) {
          set.status = 400;
          return {
            message: "Title is too long. Max length is 100 characters.",
            ok: false,
          };
        }

        const existingPost = await PostModel.findOne({ title });

        if (existingPost) {
          return {
            message: "Duplicate entry. Title already exists.",
            ok: false,
          };
        }

        let fileUrl = "";

        if (file) {
          const { ok, filename } = await saveFile(file, "posts");

          if (ok) {
            fileUrl = filename;
          } else {
            set.status = 400;
            return {
              message: "File upload failed",
              ok: false,
            };
          }
        }

        const subtopic = await SubTopicModel.findOne({ slug });

        if (!subtopic) {
          set.status = 400;
          return {
            message: "SubTopic not found",
            ok: false,
          };
        }

        const userSubtopic = await UserSubTopicModel.findOne({
          userId,
          subTopicId: subtopic._id,
        });

        if (!userSubtopic) {
          set.status = 400;
          return {
            message: "Follow the topic to post",
            ok: false,
          };
        }

        const newPost = new PostModel({
          title,
          description,
          slug: slugify(title),
          author: userId,
          url,
          image: fileUrl,
          comments: [],
          likes: [],
          commentsCount: 0,
          likesCount: 0,
          subTopic: subtopic._id,
        });

        await newPost.save();

        set.status = 200;
        return { message: "Post created successfully", ok: true };
      } catch (error: any) {
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
        description: t.Optional(
          t.String({
            default: "",
          })
        ),
        url: t.Optional(
          t.String({
            default: "",
          })
        ),
        slug: t.String(),
        file: t.Optional(t.File()),
      }),
      detail: {
        description: "Create post",
        summary: "Create post",
      },
    }
  )
  .post(
    "/like",
    async ({ body, set, store }) => {
      const { postId } = body;

      try {
        const userId = (store as StoreType)["id"];

        try {
          const existingLike = await LikeModel.findOne({
            user: userId,
            post: postId,
          }).lean();

          if (existingLike) {
            await LikeModel.deleteOne({ _id: existingLike._id });
            await PostModel.findByIdAndUpdate(postId, {
              $inc: { likesCount: -1 },
            }).exec();

            set.status = 200;
            return { message: "Post unliked successfully", ok: true };
          }

          const newLike = new LikeModel({ user: userId, post: postId });
          await newLike.save();
          await PostModel.findByIdAndUpdate(postId, {
            $inc: { likesCount: 1 },
          }).exec();

          set.status = 200;
          return { message: "Post liked successfully", ok: true };
        } catch (error) {
          throw error;
        }
      } catch (error: any) {
        console.error("Error liking/unliking post:", error);

        set.status = 500;
        return {
          message:
            "An internal error occurred while processing the like/unlike.",
          ok: false,
        };
      }
    },
    {
      body: t.Object({
        postId: t.String(),
      }),
      detail: {
        description: "Like or unlike post",
        summary: "Like or unlike post",
      },
    }
  )
  .post(
    "/create-group-post",
    async ({ body, set, store }) => {
      const { title, description, url, file, selectedgroup } = body;

      console.log(body);

      try {
        const userId = (store as StoreType)["id"];

        if (!userId) {
          set.status = 401;
          return {
            message: "Unauthorized",
            ok: false,
          };
        }

        if (title.length > 100) {
          set.status = 400;
          return {
            message: "Title is too long. Max length is 100 characters.",
            ok: false,
          };
        }

        const existingPost = await PostModel.findOne({ title });

        if (existingPost) {
          return {
            message: "Duplicate entry. Title already exists.",
            ok: false,
          };
        }

        let fileUrl = "";

        if (file) {
          const { ok, filename } = await saveFile(file, "posts");

          if (ok) {
            fileUrl = filename;
          } else {
            set.status = 400;
            return {
              message: "File upload failed",
              ok: false,
            };
          }
        }

        const group = await GroupModel.findOne({
          slug: selectedgroup,
        });

        if (!group) {
          set.status = 400;
          return {
            message: "Group not found",
            ok: false,
          };
        }

        const newPost = new PostModel({
          title,
          description,
          slug: slugify(title),
          author: userId,
          url,
          image: fileUrl,
          comments: [],
          likes: [],
          commentsCount: 0,
          likesCount: 0,
          group: group.id,
          subTopic: null,
        });

        await newPost.save();

        set.status = 200;
        return { message: "Post created successfully", ok: true };
      } catch (error: any) {
        console.log(error);
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
        description: t.Optional(
          t.String({
            default: "",
          })
        ),
        url: t.Optional(
          t.String({
            default: "",
          })
        ),
        file: t.Optional(t.File()),
        selectedgroup: t.String(),
      }),
      detail: {
        description: "Create post inside group!",
        summary: "Create post inside group!",
      },
    }
  );
