import { getAllProducts } from './../db/queries';
import { Router } from "express";
import * as productController from '../controllers/productController';
import { requireAuth } from '@clerk/express';

const router = Router();

// GET /api/producst => Get all products (public)
router.get('/', productController.getAllProducts)



export default router;