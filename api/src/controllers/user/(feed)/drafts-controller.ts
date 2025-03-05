import { saveFile } from "@/lib/file-s3";
import { DraftModel } from "@/models/draftmodel";
import { SubTopicModel } from "@/models/subtopicmodel";
import { StoreType } from "@/types";
import Elysia, { t } from "elysia";

export const draftsController = new Elysia({
  prefix: "/drafts",
  detail: {
    description: "Drafts controller",
    tags: ["Drafts"],
  },
})
  .post(
    "/create",
    async ({ body, set, store }) => {
      try {
        const userId = (store as StoreType)["id"];
        const { title, description, link, file, selectedTopic } = body;

        const existing = await DraftModel.countDocuments({
          user: userId,
        });

        if (existing > 5) {
          return {
            message: "You can only have 5 drafts",
            ok: false,
          };
        }

        let fileUrl = "";

        if (file) {
          const { ok, filename } = await saveFile(file, "drafts");

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

        const subtopic = await SubTopicModel.findOne({ slug: selectedTopic });

        if (!subtopic) {
          return {
            message: "SubTopic not found",
            ok: false,
          };
        }

        const newDraft = new DraftModel({
          title,
          description,
          user: userId,
          url: link,
          image: fileUrl,
          selectedTopic: subtopic._id,
        });

        await newDraft.save();

        set.status = 200;
        return { message: "Draft created successfully", ok: true };
      } catch (error) {
        set.status = 400;
        return {
          error,
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
        link: t.Optional(
          t.String({
            default: "",
          })
        ),
        file: t.Optional(t.File()),
        selectedTopic: t.String(),
      }),
    }
  )
  .put(
    "/:id",
    async ({ body, params, set, store }) => {
      try {
        const userId = (store as StoreType)["id"];
        const draftId = params.id;
        const { title, description, link, file, selectedTopic } = body;
  
        const draft = await DraftModel.findOne({ _id: draftId, user: userId });
  
        if (!draft) {
          set.status = 404;
          return {
            message: "Draft not found",
            ok: false,
          };
        }
  
        if (selectedTopic) {
          const subtopic = await SubTopicModel.findOne({ slug: selectedTopic });
          if (!subtopic) {
            return {
              message: "SubTopic not found",
              ok: false,
            };
          }
          draft.selectedTopic = subtopic._id;
        }
  
        if (file) {
          const { ok, filename } = await saveFile(file, "drafts");
          if (ok) {
            draft.image = filename;
          } else {
            set.status = 400;
            return {
              message: "File upload failed",
              ok: false,
            };
          }
        }
  
        draft.title = title;
        draft.description = description??'';
        draft.url = link??'';
  
        await draft.save();
  
        set.status = 200;
        return { message: "Draft updated successfully", ok: true };
      } catch (error) {
        console.log(error);
        set.status = 400;
        return {
          error,
          ok: false,
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
      body: t.Object({
        title: t.String(),
        description: t.Optional(t.String({ default: "" })),
        link: t.Optional(t.String({ default: "" })),
        file: t.Optional(t.File()),
        selectedTopic: t.String(),
      }),
    }
  )  
  .get(
    "/",
    async ({ store }) => {
      const userId = (store as StoreType)["id"] || "";

      try {
        const drafts = await DraftModel.find({ user: userId })
        .populate({
          path: "selectedTopic", 
          model: "subtopic", 
        });
        return {
          drafts,
          ok: true,
          message: "Drafts fetched successfully",
        };
      } catch (error) {
        console.log(error);
        return {
          error,
          status: "error",
          ok: false,
        };
      }
    },
    {
      query: t.Object({
        userId: t.Optional(
          t.String({
            default: "",
          })
        ),
      }),
      detail: {
        description: "Get Drafts",
        summary: "Get Drafts",
      },
    }
  )
  .delete(
    "/:id",
    async ({ params }) => {
      try {
        const { id } = params;
        await DraftModel.findByIdAndDelete(id);
        return {
          message: "Draft deleted successfully",
          ok: true,
        };
      } catch (error) {
        console.log(error);
        return {
          error,
          status: "error",
          ok: false,
        };
      }
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
