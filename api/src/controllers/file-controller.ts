import { getAsBlob } from "@/lib/file-s3";
import Elysia, { t } from "elysia";
// @ts-ignore
import mime from "mime-types";

export const fileController = new Elysia({
  prefix: "/user/file",
  detail: {
    tags: ["User - File"],
  },
}).get(
  "/",
  async ({ query, set }) => {
    try {
      const { key } = query;

      if (!key) {
        set.status = 404;
        return {
          message: "File not found",
          status: false,
        };
      }

      const { data, ok } = await getAsBlob(key);

      if (!ok) {
        set.status = 404;
        return {
          message: "File not found",
          status: false,
        };
      }

      const mimeType = mime.lookup(key) || "application/octet-stream";

      set.headers = {
        "content-type": mimeType,
        "content-disposition": `attachment; filename=${key}`,
      };

      // @ts-ignore
      return Buffer.from(data);
    } catch (error) {
      console.error(error);
      return {
        error,
        status: false,
      };
    }
  },
  {
    query: t.Object({
      key: t.String(),
    }),
    detail: {
      summary: "Get a file from s3 bucket",
    },
  }
);
