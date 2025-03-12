import { deleteFile, saveFile } from "@/lib/file-s3";
import { sendNotification } from "@/lib/firebase";
import { slugify } from "@/lib/utils";
import { LikeModel, PostModel, UserModel } from "@/models";
import { DraftModel } from "@/models/draftmodel";
import { GroupModel } from "@/models/group.model";
import { NotificationModel } from "@/models/notificationmodel";
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
      const { title, description, url, file, slug, draftId, imageUrl } = body;

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
        } else if (imageUrl) {
          fileUrl = imageUrl;
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
        if (draftId) {
          await DraftModel.findByIdAndDelete(draftId);
        }
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
          }),
        ),
        url: t.Optional(
          t.String({
            default: "",
          }),
        ),
        slug: t.String(),
        file: t.Optional(t.File()),
        imageUrl: t.Optional(t.String()),
        draftId: t.Optional(t.String()),
      }),
      detail: {
        description: "Create post",
        summary: "Create post",
      },
    },
  )
  .post(
    "/edit",
    async ({ body, set, store, query }) => {
      const { postId } = query;
      const { title, description, url, file, slug, deletedFile } = body;

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

        const existingPost = await PostModel.findById(postId);

        if (!existingPost) {
          return {
            message: "Post not found",
            ok: false,
          };
        }

        let fileUrl = "";

        if (file) {
          const { ok, filename } = await saveFile(file, "posts");

          if (existingPost.image) deleteFile(existingPost.image);

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

        if (deletedFile == "true") {
          deleteFile(existingPost.image);
          fileUrl = "";
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

        existingPost.title = title || existingPost.title;
        existingPost.description = description || existingPost.description;
        existingPost.url = url || existingPost.url;
        existingPost.slug = slugify(title) || existingPost.slug;
        existingPost.image = fileUrl;
        existingPost.subTopic = subtopic._id;

        await existingPost.save();

        set.status = 200;
        return { message: "Post updated successfully", ok: true };
      } catch (error: any) {
        set.status = 500;
        return {
          message: "An internal error occurred while processing the post.",
          ok: false,
        };
      }
    },
    {
      query: t.Object({
        postId: t.String(),
      }),
      body: t.Object({
        title: t.String(),
        description: t.Optional(
          t.String({
            default: "",
          }),
        ),
        url: t.Optional(
          t.String({
            default: "",
          }),
        ),
        slug: t.String(),
        file: t.Optional(t.Any()),
        deletedFile: t.String(),
      }),
      detail: {
        description: "Create post",
        summary: "Create post",
      },
    },
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

          const post = await PostModel.findById(postId).lean();

          if (post) {
            const author = await UserModel.findById(post.author).lean();

            if (author && author.fcmToken) {
              await sendNotification(
                author.fcmToken,
                "Someone Liked Your Post",
                "Your post has been liked.",
              );

              const newNotification = new NotificationModel({
                user: author._id,
                type: "like",
                content: "Your post has been liked.",
                from: userId,
                post: postId,
                title: "New Like",
              });
              await newNotification.save();
            }
          }

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
    },
  )
  .post(
    "/create-group-post",
    async ({ body, set, store }) => {
      const { title, description, url, file, selectedgroup } = body;

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
            message: "Title already exists! Please choose a different title.",
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
          }),
        ),
        url: t.Optional(
          t.String({
            default: "",
          }),
        ),
        file: t.Optional(t.File()),
        selectedgroup: t.String(),
      }),
      detail: {
        description: "Create post inside group!",
        summary: "Create post inside group!",
      },
    },
  )
  .post(
    "/edit-group-post",
    async ({ body, set, store, query }) => {
      const { title, description, url, file, selectedgroup, deletedFile } =
        body;
      const { postId } = query;

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

        const existingPost = await PostModel.findById(postId);

        if (!existingPost) {
          return {
            message: "Post not found",
            ok: false,
          };
        }

        let fileUrl = "";

        if (file) {
          const { ok, filename } = await saveFile(file, "group-posts");

          if (existingPost.image) deleteFile(existingPost.image);

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

        if (deletedFile == "true") {
          deleteFile(existingPost.image);
          fileUrl = "";
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

        existingPost.title = title || existingPost.title;
        existingPost.description = description || existingPost.description;
        existingPost.url = url || existingPost.url;
        existingPost.slug = slugify(title) || existingPost.slug;
        existingPost.image = fileUrl;
        existingPost.group = group.id;

        await existingPost.save();

        set.status = 200;
        return { message: "Post updated successfully", ok: true };
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
      query: t.Object({
        postId: t.String(),
      }),
      body: t.Object({
        title: t.String(),
        description: t.Optional(
          t.String({
            default: "",
          }),
        ),
        url: t.Optional(
          t.String({
            default: "",
          }),
        ),
        file: t.Optional(t.File()),
        selectedgroup: t.String(),
        deletedFile: t.String(),
      }),
      detail: {
        description: "Create post inside group!",
        summary: "Create post inside group!",
      },
    },
  )
  .get(
    "/getsingle",
    async ({ query, set, store }) => {
      const { postId } = query;

      try {
        const post = await PostModel.findById(postId)
          .populate("author")
          .populate("subTopic", "slug _id")
          .populate("group", "slug _id")
          .lean();

        if (!post) {
          set.status = 404;
          return {
            message: "Post not found",
            ok: false,
          };
        }

        set.status = 200;
        return { message: "Post found", ok: true, post };
      } catch (error: any) {
        console.error("Error getting post:", error);

        set.status = 500;
        return {
          message: "An internal error occurred while processing the post.",
          ok: false,
        };
      }
    },
    {
      query: t.Object({
        postId: t.String(),
      }),
      detail: {
        description: "Get single post",
        summary: "Get single post",
      },
    },
  );
