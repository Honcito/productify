import type { Request, Response } from 'express';
import * as queries from '../db/queries';
import { getAuth } from '@clerk/express';

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

// Get products by current user (protected)
export const getMyProducts = async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    const userId = auth.userId;

    if (!userId) return res.status(401).json({
      error: "Unauthorized"
    });

    const products = await queries.getProductsByUserId(userId);
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error getting user products:", error);
    return res.status(500).json({
      error: "Failed to get user products"
    });
  }
};

// GET single product by ID (public)
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

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

// Create product (protected)
export const createProduct = async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    const userId = auth.userId;

    if (!userId) return res.status(401).json({
      error: "Unauthorized"
    });

    const { title, description, imageUrl } = req.body;

    if (!title || !description || !imageUrl) {
      res.status(400).json({
        error: "Title, description, and imageUrl are required"
      });
      return;
    }

    const product = await queries.createProduct({
      title,
      description,
      imageUrl,
      userId,
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    return res.status(500).json({
      error: "Failed to create product"
    });
  }
};

// Update product (protected - owner only)
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    const userId = auth.userId;

    if (!userId) return res.status(401).json({
      error: "Unauthorized"
    });

    const { id } = req.params as { id: string };
    const { title, description, imageUrl } = req.body;

    // Check if product exists and belongs to user
    const existingProduct = await queries.getProductById(id);
    if (!existingProduct) {
      res.status(404).json({
        error: "Product not found"
      });
      return;
    }

    if (existingProduct.userId !== userId) {
      res.status(403).json({
        error: "You can only update your own products"
      });
      return;
    }

    const product = await queries.updateProduct(id, {
      title,
      description,
      imageUrl,
    });

    return res.status(200).json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      error: "Failed to update product"
    });
  }
};

// Delete product (protected - owner only)
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const auth = getAuth(req);
    const userId = auth.userId;

    if (!userId) return res.status(401).json({
      error: "Unauthorized"
    });

    const { id } = req.params as { id: string };

    // Check if product exists and belongs to user
    const existingProduct = await queries.getProductById(id);
    if (!existingProduct) {
      res.status(404).json({
        error: "Product not found"
      });
      return;
    }

    if (existingProduct.userId !== userId) {
      res.status(403).json({
        error: "You can only delete your own products"
      });
      return;
    }

    await queries.deleteProduct(id);
    return res.status(200).json({
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return res.status(500).json({
      error: "Failed to delete product"
    });
  }
};