import type { Request, Response } from 'express';
import * as queries from '../db/queries';

// Opcional: Tipamos los parámetros de la URL para que req.params.id sea siempre string
interface ProductParams {
  id: string;
}

// GET all products (public)
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await queries.getAllProducts();
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error getting products:", error);
    return res.status(500).json({
      error: "Failed to get products"
    });
  }
};

// GET single product by ID (public)
export const getProductById = async (req: Request<ProductParams>, res: Response) => {
  try {
    const { id } = req.params;

    // Validación previa para asegurar que el ID no llegue vacío o indefinido
    if (!id || typeof id !== 'string') {
      return res.status(400).json({
        error: "Invalid or missing product ID"
      });
    }

    const product = await queries.getProductById(id);

    if (!product) {
      return res.status(404).json({
        error: "Product not found"
      });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error getting product by ID:", error);
    return res.status(500).json({
      error: "Failed to get product"
    });
  }
};