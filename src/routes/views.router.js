import { Router } from "express";
import productModel from "../Dao/mongoManager/models/product.models.js";

const router = Router()

router.get("/", (req, res) => {
    res.render("index", {})
})
router.get("/realtimeproducts", async(req, res)=> {
    try {
        const products = await productModel.find().lean().exec()
        res.render("realTimeProducts", { products });
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
})
router.post("/realtimeproducts", async(req, res)=> {
    const productNew = req.body
    console.log("Received product data:", productNew);
    console.log({productNew});
    
    try {
        const productExists = await productModel.exists({ code: productNew.code });
        
        if (productExists) {
            console.log("El producto ya existe");
            return res.status(400).json({ error: "El producto ya existe" });
        }
        const productGenerated = new productModel(productNew);
        await productGenerated.save();
        
        console.log("Producto agregado a la BD correctamente");
        res.redirect("/api/products");
    } catch (error) {
        console.log("Error al agregar el producto a la BD:", error);
        res.status(500).json({ error: "Error al agregar el producto" });
    }
})
router.get('/form-products', async (req, res) => {
    try {
        res.render("form", {});
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

router.post('/form-products', async (req, res) => {
    const productNew = req.body;
    console.log({ productNew });

    try {
        const productExists = await productModel.exists({ code: productNew.code });

        if (productExists) {
            console.log("El producto ya existe");
            return res.redirect("/form-products");
        }
        const productGenerated = new productModel(productNew);
        await productGenerated.save();

        console.log("Producto agregado a la BD correctamente");
        res.redirect("/products");
    } catch (error) {
        console.log("Error al agregar el producto a la BD:", error);
        res.status(500).json({ error: "Error al agregar el producto" });
    }
}); 

router.get("/chat", (req, res) =>{
    res.render("chat", {})
})

/* router.get("/api/session/login", (req, res) => {
    if(req.session?.user) {
        res.redirect("/profile")
    }
    res.render("login" , {})
})

router.get("/api/session/register", (req, res) => {
    if(req.session?.user) {
        res.redirect("profile")
    }
    res.render("register", {})
})

function auth (req, res, next) {
    if(req.session?.user) return next()
    res.redirect("/")
}

router.get("/api/session/profile", auth, (req, res) => {
    const user = req.session.user
    res.render("profile", user)
}) */

export default router