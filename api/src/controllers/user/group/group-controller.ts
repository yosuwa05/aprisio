import { saveFile } from "@/lib/file-s3";
import { slugify } from "@/lib/utils";
import { EventModel } from "@/models/events.model";
import { GroupModel } from "@/models/group.model";
import { GroupPhotoModel } from "@/models/groupphotos.model";
import { GroupPostShareModel } from "@/models/grouppostshare";
import { SubTopicModel } from "@/models/subtopicmodel";
import { UserGroupsModel } from "@/models/usergroup.model";
import Elysia, { t } from "elysia";
import { Types } from "mongoose";

export const groupController = new Elysia({
  prefix: "/group",
  detail: {
    description: "Group controller",
    tags: ["User - Group"],
  },
})
  .post(
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

        const newGroupEntry = new UserGroupsModel({
          userId,
          group: newGroup._id,
          role: "admin",
        });

        await newGroupEntry.save();

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
            managedBy: userId,
            attendees: [userId],
            isEventEnded: false,
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
  )
  .put("/edit", async ({ body, set, store }) => {
    try {
      const userId = (store as any)["id"];
      const { groupId, name, description, subTopic } = body;

      const group = await GroupModel.findById(groupId)

      if (!group) {
        set.status = 400
        return {
          message: "Group not found",
          ok: false,
        };
      }

      if (group.groupAdmin.toString() !== userId) {
        set.status = 400
        return {
          message: "You are not authorized to edit this group",
          ok: false,
        };
      }

      let updateFields: any = {}
      if (name) updateFields.name = name;
      if (description) updateFields.description = description;


      if (subTopic) {
        const subTopicExist = await SubTopicModel.findOne({ slug: subTopic })
        if (!subTopicExist) {
          return {
            message: "Topic not found",
            ok: false,
          };
        }
        updateFields.subTopic = subTopicExist._id
      }

      await GroupModel.findByIdAndUpdate(groupId, updateFields, { new: true })

      return {
        message: "Group updated successfully",
        ok: true,
      };

    } catch (error: any) {
      console.log(error)
      set.status = 500
      return {
        message: error
      }
    }
  }, {
    body: t.Object({
      name: t.String(),
      description: t.String(),
      subTopic: t.String(),
      groupId: t.String()
    }),
    detail: {
      summary: "Edit a group",
      description: "Edit a group"
    }
  })
  .post(
    "/join",
    async ({ body, set, store }) => {
      const { groupId } = body;

      try {
        const userId = (store as any)["id"];

        const group = await GroupModel.findById(groupId);

        if (!group) {
          return {
            message: "Group not found",
            ok: false,
          };
        }

        const alreadyJoined = await UserGroupsModel.findOne({
          userId,
          group: group._id,
        });

        if (alreadyJoined) {
          return {
            message: "You are already a member of this group",
            ok: false,
          };
        }

        const newGroup = new UserGroupsModel({
          userId,
          group: group._id,
        });

        group.memberCount += 1;

        await group.save();
        await newGroup.save();

        set.status = 200;
        return {
          message: "You have successfully joined the group",
          ok: true,
        };
      } catch (error) {
        return {
          error,
          ok: false,
        };
      }
    },
    {
      body: t.Object({
        groupId: t.String(),
      }),
    }
  )
  .post(
    "/share-post-group",
    async ({ set, body }) => {
      try {
        const { groupIds, sharedBy, postId } = body;

        if (!Array.isArray(groupIds) || groupIds.length === 0) {
          set.status = 400;
          return { message: "Invalid group IDs" };
        }

        const sharePosts = groupIds.map((groupId) => ({
          group: groupId,
          sharedBy,
          postId,
        }));

        await GroupPostShareModel.insertMany(sharePosts);

        set.status = 200;
        return {
          message: "Post shared successfully ",
          ok: true,
        };
      } catch (error: any) {
        console.log(error);
        set.status = 500;
        return { message: error.message };
      }
    },
    {
      detail: {
        summary: "Share Post to Multiple Groups",
        description:
          "Allows sharing a post to multiple groups at once using group IDs.",
      },
      body: t.Object({
        groupIds: t.Array(t.String()),
        sharedBy: t.String(),
        postId: t.String(),
      }),
    }
  )
  .get(
    "/sharedpost",
    async ({ query, set }) => {
      try {
        const { page, limit, group, userId } = query;

        const _page = Number(page) || 1;
        const _limit = Number(limit) || 10;

        const isGroupExist = await GroupModel.findOne({ slug: group });
        if (!isGroupExist) {
          set.status = 400;
          return { message: "Group not found" };
        }

        const sharedPosts = await GroupPostShareModel.aggregate([
          {
            $match: { group: isGroupExist._id },
          },
          {
            $lookup: {
              from: "posts",
              localField: "postId",
              foreignField: "_id",
              as: "post",
            },
          },
          { $unwind: "$post" },
          {
            $lookup: {
              from: "users",
              localField: "post.author",
              foreignField: "_id",
              as: "author",
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "sharedBy",
              foreignField: "_id",
              as: "sharedByUser",
            },
          },
          {
            $lookup: {
              from: "likes",
              localField: "post._id",
              foreignField: "post",
              as: "likes",
            },
          },
          {
            $lookup: {
              from: "comments",
              localField: "post._id",
              foreignField: "post",
              as: "comments",
            },
          },
          ...(userId
            ? [
              {
                $lookup: {
                  from: "likes",
                  let: {
                    postId: "$post._id",
                    userId: new Types.ObjectId(userId),
                  },
                  pipeline: [
                    {
                      $match: {
                        $expr: {
                          $and: [
                            { $eq: ["$post", "$$postId"] },
                            { $eq: ["$user", "$$userId"] },
                          ],
                        },
                      },
                    },
                  ],
                  as: "likedByMe",
                },
              },
            ]
            : []),
          {
            $sort: { "post.createdAt": -1, "post._id": -1 },
          },
          {
            $skip: (_page - 1) * _limit,
          },
          {
            $limit: _limit,
          },
          {
            $project: {
              title: "$post.title",
              description: "$post.description",
              authorName: { $arrayElemAt: ["$author.name", 0] },
              sharedBy: { $arrayElemAt: ["$sharedByUser.name", 0] },
              createdAt: "$post.createdAt",
              likesCount: { $size: "$likes" },
              commentsCount: { $size: "$comments" },
              url: "$post.url",
              image: "$post.image",
              likedByMe: {
                $cond: {
                  if: { $eq: [userId, null] },
                  then: false,
                  else: {
                    $gt: [{ $size: { $ifNull: ["$likedByMe", []] } }, 0],
                  },
                },
              },
            },
          },
        ]);

        return {
          sharedPosts,
          ok: true,
        };
      } catch (error: any) {
        console.error("Error fetching shared posts:", error.message || error);

        set.status = 500;
        return {
          message: "An internal error occurred while fetching shared posts.",
          ok: false,
        };
      }
    },
    {
      query: t.Object({
        page: t.Optional(t.String()),
        limit: t.Optional(t.String()),
        group: t.String(),
        userId: t.Optional(t.String()),
      }),
      detail: {
        summary: "Get all shared posts",
        description: "Retrieve all shared posts within a group.",
      },
    }
  );

// .get("/sharedpost", async ({ query, set }) => {
//   try {
//     const { page, limit, group } = query

//     const _page = Number(page) || 1
//     const _limit = Number(limit) || 10
//     console.log(group)
//     const isGropuExist = await GroupModel.findOne({ slug: group })
//     console.log(isGropuExist)
//     if (!isGropuExist) {
//       set.status = 400
//       return {
//         message: "Group not found"
//       }
//     }

//     const sharedPosts = await GroupPostShareModel.find({
//       group: isGropuExist._id
//     }).populate({
//       path: "postId",
//       populate: {
//         path: "author",
//         model: "User",
//         select: "name"
//       }
//     }).skip(((_page - 1) * _limit)).limit(_limit).sort({ createdAt: -1, _id: -1 }).lean()

//     return {
//       sharedPosts,
//       message: "Shared Post fetched successfully",
//     }

//   } catch (error: any) {
//     console.log(error)
//     set.status = 500
//     return {
//       message: error
//     }
//   }
// }, {
//   query: t.Object({
//     page: t.Optional(t.String()),
//     limit: t.Optional(t.String()),
//     group: t.String()
//   }),
//   detail: {
//     summary: "Get all shared post",
//     description: "Get all shared post"
//   }
// })
