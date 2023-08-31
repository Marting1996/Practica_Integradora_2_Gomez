import { Router } from "express";
import productModel from "../Dao/mongoManager/models/product.models.js";

const Productsrouter = Router();

Productsrouter.get("/", async (req, res) => {
    const message = req.query.message;
    const page = parseInt(req.query?.page || 1);
    const limit = parseInt(req.query?.limit || 10);
    const queryParams = req.query?.query || "";
    const category = req.query?.category || null;
    const sortField = req.query?.sort || null;

    const query = {};
    if (category) {
        query.category = category;
    }

    try {
        const products = await productModel.paginate(query, {
            page,
            limit,
            lean: true,
            sort: sortField,
        });

        products.prevLink = products.hasPrevPage ? `/?category=${category}&page=${products.prevPage}&limit=${limit}` : "";
        products.nextLink = products.hasNextPage ? `/?category=${category}&page=${products.nextPage}&limit=${limit}` : "";

        res.render("home", { ...products, category, message });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

Productsrouter.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        const product = await productModel.findById(productId).lean().exec();
        if (product) {
            res.render("products", { product });
        } else {               
            console.log("Product not found");
            return null;
        }
    } catch (error) {
        console.log(`Error al obtener el producto de la base de datos: ${error}`);
        return null;
    }
});
Productsrouter.put('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const updateFields = req.body; 
    try {
        const product = await productModel.findByIdAndUpdate(productId, updateFields, { new: true });
        if (product) {
            console.log("El producto se actualizó correctamente");
        } else {
            console.log("Producto a actualizar no encontrado");
        }
    } catch (error) {
        console.log(`Error al actualizar el producto en la base de datos: ${error}`);
    }

});

Productsrouter.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;
    try {
        const product = await productModel.findByIdAndRemove(productId);
        if (product) {
            console.log("El producto se eliminó correctamente");
        } else {
            console.log("Producto a eliminar no encontrado");
        }
    } catch (error) {
        console.log(`Error al eliminar el producto de la base de datos: ${error}`);
    }
});

export default Productsrouter 
