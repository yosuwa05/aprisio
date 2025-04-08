import { deleteFile, saveFile } from "@/lib/file-s3";
import { slugify } from "@/lib/utils";
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
      let { subTopicName, topic, description, file, popularity } = body;

      topic = topic.split(" -&- ")[0];

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

        let fileUrl = "";

        if (file) {
          const { filename, ok } = await saveFile(file, "subtopicimage");

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

        const newSubTopic = new SubTopicModel({
          subTopicName,
          topic,
          description,
          active: true,
          isDeleted: false,
          image: fileUrl,
          slug: slugify(subTopicName),
          popularity
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
        popularity: t.String(),
        topic: t.String(),
        description: t.String(),
        file: t.File(),
      }),
      detail: {
        description: "Create subtopic",
        summary: "Create subtopic",
      },
    }
  )
  // .get(
  //   "/all",
  //   async ({ query, set }) => {
  //     const { page = 1, limit = 10, q } = query;

  //     try {
  //       const subtopics = await SubTopicModel.find({
  //         isDeleted: false,
  //         subTopicName: {
  //           $regex: q,
  //           $options: "i",
  //         },
  //       })
  //         .populate({
  //           path: "topic",
  //           select: "topicName",
  //         })
  //         .sort({ createdAt: -1 })
  //         .skip((page - 1) * limit)
  //         .limit(limit)
  //         .lean();

  //       const totalSubtopics = await SubTopicModel.countDocuments({
  //         isDeleted: false,
  //         subTopicName: {
  //           $regex: q,
  //           $options: "i",
  //         },
  //       });

  //       return {
  //         subtopics,
  //         total: totalSubtopics,
  //         ok: true,
  //       };
  //     } catch (error: any) {
  //       console.log(error);
  //       set.status = 500;
  //       return {
  //         message: "An internal error occurred while fetching subtopics.",
  //         ok: false,
  //       };
  //     }
  //   },
  //   {
  //     query: t.Object({
  //       page: t.Optional(t.Number()),
  //       limit: t.Optional(t.Number()),
  //       q: t.Optional(t.String()),
  //     }),
  //     detail: {
  //       description: "Get subtopics",
  //       summary: "Get subtopics",
  //     },
  //   }
  // )


  // .get(
  //   "/all",
  //   async ({ query, set }) => {
  //     const { page = 1, limit = 10, q } = query;

  //     try {
  //       const subtopics = await SubTopicModel.aggregate([
  //         {
  //           $match: { isDeleted: false },
  //         },
  //         {
  //           $lookup: {
  //             from: "topics",
  //             localField: "topic",
  //             foreignField: "_id",
  //             as: "topicData",
  //           },
  //         },
  //         {
  //           $unwind: "$topicData",
  //         },
  //         {
  //           $match: {
  //             $or: [
  //               ...(q
  //                 ? [
  //                   { subTopicName: { $regex: q, $options: "i" } },
  //                   { "topicData.topicName": { $regex: q, $options: "i" } },
  //                 ]
  //                 : []),
  //             ],
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: "usersubtopics",
  //             localField: "_id",
  //             foreignField: "subTopicId",
  //             as: "joinedUsers",
  //           },
  //         },
  //         {
  //           $addFields: {
  //             joinedUserCount: { $size: "$joinedUsers" },
  //           },
  //         },
  //         {
  //           $project: {
  //             _id: 1,
  //             subTopicName: 1,
  //             topicName: "$topicData.topicName",
  //             joinedUserCount: 1,
  //             createdAt: 1,
  //             updatedAt: 1,
  //             active: 1,
  //             topicId: "$topicData._id",
  //             description: 1

  //           },
  //         },
  //         { $sort: { createdAt: -1 } },
  //         { $skip: (page - 1) * limit },
  //         { $limit: limit },
  //       ]);

  //       const totalSubtopics = await SubTopicModel.countDocuments({
  //         isDeleted: false,
  //         ...(q && { subTopicName: { $regex: q, $options: "i" } }),
  //       });

  //       return {
  //         subtopics,
  //         total: totalSubtopics,
  //         ok: true,
  //       };
  //     } catch (error: any) {
  //       console.log(error);
  //       set.status = 500;
  //       return {
  //         message: "An internal error occurred while fetching subtopics.",
  //         ok: false,
  //       };
  //     }
  //   },
  //   {
  //     query: t.Object({
  //       page: t.Optional(t.Number()),
  //       limit: t.Optional(t.Number()),
  //       q: t.Optional(t.String()),
  //     }),
  //     detail: {
  //       description: "Get subtopics with user join count",
  //       summary: "Get subtopics with user join count",
  //     },
  //   }
  // )

  .get(
    "/all",
    async ({ query, set }) => {
      const { page = 1, limit = 10, q } = query;

      try {
        const baseMatch = { isDeleted: false };

        const searchMatch = q
          ? {
            $or: [
              { subTopicName: { $regex: q, $options: "i" } },
              { "topicData.topicName": { $regex: q, $options: "i" } },
            ],
          }
          : {};

        const subtopics = await SubTopicModel.aggregate([
          { $match: baseMatch },
          {
            $lookup: {
              from: "topics",
              localField: "topic",
              foreignField: "_id",
              as: "topicData",
            },
          },
          { $unwind: "$topicData" },
          { $match: searchMatch },
          {
            $lookup: {
              from: "usersubtopics",
              localField: "_id",
              foreignField: "subTopicId",
              as: "joinedUsers",
            },
          },
          {
            $addFields: {
              joinedUserCount: { $size: "$joinedUsers" },
            },
          },
          {
            $project: {
              _id: 1,
              subTopicName: 1,
              topicName: "$topicData.topicName",
              joinedUserCount: 1,
              createdAt: 1,
              updatedAt: 1,
              active: 1,
              topicId: "$topicData._id",
              description: 1,
              popularity: 1
            },
          },
          // { $sort: { popularity: 1, createdAt: -1, _id: -1 } },
          { $sort: { createdAt: -1, _id: -1 } },
          { $skip: (page - 1) * limit },
          { $limit: limit },
        ]);

        // Fix for correct total count
        const totalAgg = await SubTopicModel.aggregate([
          { $match: baseMatch },
          {
            $lookup: {
              from: "topics",
              localField: "topic",
              foreignField: "_id",
              as: "topicData",
            },
          },
          { $unwind: "$topicData" },
          { $match: searchMatch },
          { $count: "total" },
        ]);

        const totalSubtopics = totalAgg[0]?.total || 0;

        return {
          subtopics,
          total: totalSubtopics,
          ok: true,
        };
      } catch (error: any) {
        console.error(error);
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
        description: "Get subtopics with user join count",
        summary: "Get subtopics with user join count",
      },
    }
  )


  // .put(
  //   "/:id",
  //   async ({ body, set, params }) => {
  //     let { subTopicName, topic, description, file } = body;
  //     const { id } = params;

  //     topic = topic.split(" -&- ")[0];

  //     try {
  //       const subtopic = await SubTopicModel.findById(id);

  //       if (!subtopic) {
  //         return {
  //           message: "SubTopic not found",
  //         };
  //       }

  //       let fileUrl = "";

  //       if (file) {
  //         const { filename, ok } = await saveFile(file, "subtopicimage");

  //         if (ok) {
  //           fileUrl = filename;

  //           deleteFile(subtopic.image);
  //         } else {
  //           return {
  //             message: "Failed to save file",
  //             ok: false,
  //           };
  //         }
  //       }

  //       subtopic.image = fileUrl;
  //       subtopic.subTopicName = subTopicName;
  //       subtopic.topic = new Types.ObjectId(topic);
  //       subtopic.description = description;

  //       await subtopic.save();

  //       set.status = 200;
  //       return { message: "SubTopic updated successfully", ok: true };
  //     } catch (error: any) {
  //       console.error(error);
  //       set.status = 500;
  //       return {
  //         message: "An internal error occurred while updating subtopic.",
  //         ok: false,
  //       };
  //     }
  //   },
  //   {
  //     params: t.Object({
  //       id: t.String(),
  //     }),
  //     body: t.Object({
  //       subTopicName: t.String(),
  //       topic: t.String(),
  //       description: t.String(),
  //       file: t.Optional(t.File()),
  //     }),
  //     detail: {
  //       description: "Update subtopic",
  //       summary: "Update subtopic",
  //     },
  //   }
  // )
  .put(
    "/:id",
    async ({ body, set, params }) => {
      let { subTopicName, topic, description, file, popularity } = body;
      const { id } = params;

      topic = topic.split(" -&- ")[0];

      try {
        const subtopic = await SubTopicModel.findById(id);

        if (!subtopic) {
          return {
            message: "SubTopic not found",
            ok: false,
          };
        }

        let fileUrl = subtopic.image; // Keep existing image if no new file is provided

        if (file) {
          const { filename, ok } = await saveFile(file, "subtopicimage");

          if (ok) {
            // Only delete old file after confirming the new file is saved successfully
            if (subtopic.image) {
              await deleteFile(subtopic.image);
            }
            fileUrl = filename;
          } else {
            return {
              message: "Failed to save file",
              ok: false,
            };
          }
        }

        // Update fields
        subtopic.image = fileUrl;
        subtopic.subTopicName = subTopicName;
        subtopic.topic = new Types.ObjectId(topic);
        subtopic.description = description;
        subtopic.popularity = Number(popularity)

        await subtopic.save();

        set.status = 200;
        return { message: "SubTopic updated successfully", ok: true };
      } catch (error: any) {
        console.error(error);
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
        popularity: t.String(),
        topic: t.String(),
        description: t.String(),
        file: t.Optional(t.File()), // Optional file
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
