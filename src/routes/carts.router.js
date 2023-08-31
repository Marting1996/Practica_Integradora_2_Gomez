import express from "express";
import { Router } from "express";
import cartModel from "../Dao/mongoManager/models/cart.models.js";
import productModel from "../Dao/mongoManager/models/product.models.js"

const app = express();
const cartRouter = Router();
//Obtener todos los carritos
cartRouter.get("/", async(req, res) => {
  try {
    const carts = await cartModel.find().lean().exec();
    console.log(JSON.stringify(carts));
    res.render("carts", { carts });
  } catch (error) {
    console.error("Error al obtener los carritos:", error);
    res.status(500).json({ error: "Error al obtener los carritos" });
  }
});
//Crear un carrito
cartRouter.post("/", async (req, res) => {
  try {
    const result = await cartModel.create({products: []})
    console.log("Carrito creado");
    res.send(result)
  } catch (error) {
    console.log("Error:", error);
  }
});
//Obtener un carrito
cartRouter.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;

    if (!cartId) {
      const newCart = await cartModel.create({ products: [] });
      res.json(newCart);
    } else {
      const cart = await cartModel.findById(cartId).lean().exec();
      res.render("cart", { cart }); 
    }
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});
//Agregar productos al carrito
cartRouter.get("/:cid/product/:pid", async (req, res) => {
  const cid = req.params.cid;
  const pid = req.params.pid;
  const quantity = parseInt(req.query.quantity) || 1;

  try {
    const product = await productModel.findById(pid);

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }
    
    const cart = await cartModel.findById(cid);
    const existingProduct = cart.products.find((product) => product.product.toString() === pid);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      cart.products.push({
        product: pid,
        quantity,
        title: product.title,
      });
    }
    
    const result = await cart.save();
    
    const populatedCart = await cartModel
      .findById(cid)
      .populate("products.product")
      .lean()
      .exec();

    res.json(populatedCart);
  } catch (error) {
    res.status(500).send("Error al agregar el producto al carrito");
  }
});
//Borrar carrito
cartRouter.delete('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  try {
      const cart = await cartModel.findByIdAndRemove(cartId);
      if (cart) {
          console.log("El carrito se eliminó correctamente");
      } else {
          console.log("carrito a eliminar no encontrado");
      }
  } catch (error) {
      console.log(`Error al eliminar el carrito de la base de datos: ${error}`);
  }
});
//Borrar productos del carrito
cartRouter.delete("/:cid/products/:pid", async (req, res) => {
  const cartID = req.params.cid;
  const productID = req.params.pid;
  try {
    const cart = await cartModel.findById(cartID);
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    const productIndex = cart.products.findIndex(
      (product) => product._id.toString() === productID
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Producto no encontrado en el carrito" });
    }

    cart.products.splice(productIndex, 1);

    const updatedCart = await cart.save();

    res.json({ message: "Producto eliminado del carrito correctamente", cart: updatedCart });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto del carrito", error: error.message });
  }
});

export default cartRouter;
