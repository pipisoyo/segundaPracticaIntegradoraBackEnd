import { Router } from 'express';
import ProductManager from "../dao/services/productManager.js";
import { auth } from '../middeleweres/auth.js';

const realTimeProducts = Router();
const productManager = new ProductManager();

realTimeProducts.get('/', auth , async (req, res) => {
 
  try {
    const products = await productManager.getAll(31, 0);
    res.render('realTimeProducts', { products: products.result.docs });
  } catch (error) {
    console.error('Error al obtener la lista de productos:', error);
    res.status(500).send('Error al obtener la lista de productos');
  }
});

export default realTimeProducts;