import Elysia from "elysia";

export const CommentController = new Elysia({
  prefix: "/comment",
  detail: {
    tags: ["User Comment"],
    summary: "Post Comments",
  },
});
