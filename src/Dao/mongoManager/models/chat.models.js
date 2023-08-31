import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"


const chatCollection = "messages"
const chatSchema = new mongoose.Schema({
    user: String,
    message: String
})
chatSchema.plugin(mongoosePaginate)

const chatModel = mongoose.model(chatCollection, chatSchema)

export default chatModel