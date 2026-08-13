import { requireAuth } from '@clerk/express';
import { Router } from "express";

import { syncUser } from '../controllers/userController';


const router = Router();

// /api/users/sync - POST => sync the Clerk user to DB (PROTECTED)
router.post("/sync", requireAuth(), syncUser)

export default router;