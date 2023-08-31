import fs from "fs";
//import { productsRouter } from "../routes/products.router.js";

class ProductManager {
    constructor(filename) {
        this.filename = filename;
        this.format = "utf-8";
        this.nextId = null;
        this.archivo = "../products.json";
        this.products = [];
    }

    archivo = async () => {
        try {
            await fs.promises.access(this.filename);
        } catch (error) {
            await fs.promises.writeFile(this.filename, "[]");
        }
    };
      
    getNextId(products) {
        const maxId = products.reduce((max, product) => (product.id > max ? product.id : max), 0);
        return maxId + 1;
      }

      addProduct = async (product) => {
        if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
          console.log("Todos los campos son obligatorios");
          return;
        } 
      
        const products = await this.getProducts();
      
        const productoRepetido = products.find((p) => p.code === product.code);
        if (productoRepetido) {
          console.log("El producto ya existe");
          return;
        }
      
        const newProduct = {
          id: this.nextId || this.getNextId(products),
          ...product,
        };
      
        this.products.push(newProduct);
        products.push(newProduct);
        await fs.promises.writeFile(this.filename, JSON.stringify(products));
      
        if (!this.nextId) {
          this.nextId = newProduct.id + 1;
        }
      };
  
    getProducts = async () => {
        try {
            const data = await fs.promises.readFile(this.filename, this.format);
            const dataObj = JSON.parse(data);
            return dataObj;
        } catch (error) {
            console.log(`Error: ${error}`);
            return [];
        }
    };

    getProductById = async (id) => {
        try {
            const products = await this.getProducts();
            const product = products.find((product) => product.id === id);
            if (product) {
                return product;
            } else {               
                console.log("Product not found");
                return null;
            }
        } catch (error) {
            console.log(`Error: ${error}`);
            return null;
        }
    };
    
    deleteProduct = async (id) => {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex((product) => product.id === id);
            if (productIndex !== -1) {
                products.splice(productIndex, 1);
                await fs.promises.writeFile(this.filename, JSON.stringify(products));
                console.log("El producto se eliminó correctamente");
            } else {
                console.log("Producto a eliminar no encontrado");
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }

    updateProduct = async (id, updateFields) => {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex((product) => product.id === id);
            if (productIndex !== -1) {
                const updatedProduct = { ...products[productIndex], ...updateFields };
                products[productIndex] = updatedProduct;
                await fs.promises.writeFile(this.filename, JSON.stringify(products));
                console.log("El producto se actualizó correctamente");
            } else {
                console.log("Producto a actualizar no encontrado");
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    };
}

export default ProductManager;


