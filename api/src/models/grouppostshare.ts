import { Schema, Types, model } from "mongoose"

type IGroupPostShare = {
    group: Types.ObjectId,
    sharedBy: Types.ObjectId,
    postId: Types.ObjectId,
}

const GroupPostShareSchema = new Schema<IGroupPostShare>(
    {
        group: {
            type: Schema.Types.ObjectId,
            ref: "Group",
        },
        sharedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        postId: {
            type: Schema.Types.ObjectId,
            ref: "Post"
        }
    }, {
    timestamps: true
}
)

export const GroupPostShareModel = model<IGroupPostShare>("GroupPostShare", GroupPostShareSchema)