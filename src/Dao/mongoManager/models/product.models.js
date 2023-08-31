import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    stock: Number,
    category: {
        type: String,
        enum: ["frutas", "verduras"],
        default: "frutas"
    },
    thumbnail: String
})
productSchema.plugin(mongoosePaginate)

const productModel = mongoose.model("products", productSchema)

export default productModel