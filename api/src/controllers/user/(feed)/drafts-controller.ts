import { DraftModel } from "@/models/draftmodel";
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
        const { title, description } = body;

        const newDraft = new DraftModel({
          title,
          description,
          user: userId,
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
        description: t.String(),
      }),
    }
  )
  .get(
    "/",
    async ({ store }) => {
      const userId = (store as StoreType)["id"] || "";

      try {
        const drafts = await DraftModel.find({ user: userId });

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
  );
