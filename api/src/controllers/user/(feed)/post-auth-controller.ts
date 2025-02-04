import { saveFile } from "@/lib/file-s3";
import { slugify } from "@/lib/utils";
import { LikeModel, PostModel } from "@/models";
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
      const { title, description, url, file } = body;

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
          console.log(ok, filename);
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

        const session = await LikeModel.startSession();
        session.startTransaction();

        try {
          const existingLike = await LikeModel.findOne({
            user: userId,
            post: postId,
          }).session(session);

          if (existingLike) {
            await LikeModel.deleteOne({ _id: existingLike._id }).session(
              session
            );
            await PostModel.findByIdAndUpdate(
              postId,
              { $inc: { likesCount: -1 } },
              { session }
            ).exec();
            await session.commitTransaction();
            session.endSession();

            set.status = 200;
            return { message: "Post unliked successfully", ok: true };
          }

          const newLike = new LikeModel({ user: userId, post: postId });
          await newLike.save({ session });
          await PostModel.findByIdAndUpdate(
            postId,
            { $inc: { likesCount: 1 } },
            { session }
          ).exec();
          await session.commitTransaction();
          session.endSession();

          set.status = 200;
          return { message: "Post liked successfully", ok: true };
        } catch (error) {
          await session.abortTransaction();
          session.endSession();
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
  );
