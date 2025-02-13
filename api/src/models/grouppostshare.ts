import { Schema, Types, model } from "mongoose"

type IGroupPostShare = {
    group: Types.ObjectId,
    sharedBy: Types.ObjectId,
    postId: Types.ObjectId,
}

const GroupPostShareSchema = new Schema<IGroupPostShare>(
    {

    }
)