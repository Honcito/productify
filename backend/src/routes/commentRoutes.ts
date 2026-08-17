import { createComment } from './../db/queries';
import { requireAuth } from '@clerk/express';
import { Router } from "express";
import * as commentController from "../controllers/commentController";

const router = Router();

// POST /api/comments/:productId - Add comment to product (protected)
router.post('/:productId', requireAuth(), commentController.createComment);

// DELETE /:commentId - Delete comment (protected - owner only)
router.delete('/:commentId', requireAuth(), commentController.deleteComment);

export default router;