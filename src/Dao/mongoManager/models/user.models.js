import mongoose from "mongoose";

const userCollection = "users"
const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
    },
    age: Number,
    password: String,
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "carts", 
      title: String,
      quantity: Number,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    }
})
userSchema.pre("save", async function (next) {
  if (!this.cart) {
      try {
          // Crea un nuevo carrito
          const CartModel = mongoose.model("carts");
          const newCart = new CartModel();
          await newCart.save();

          // Asocia el carrito al usuario
          this.cart = newCart._id;
          next();
      } catch (error) {
          next(error);
      }
  } else {
      next();
  }
});

userSchema.pre("find", function () {
    this.populate("carts.cart");
});

const UserModel = mongoose.model(userCollection, userSchema)

export default UserModel