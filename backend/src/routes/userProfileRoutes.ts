import { Router } from 'express';
import { UserProfileController } from '../controllers/UserProfileController.js';
import { autenticarToken } from '../middleware/authMiddleware.js';
import { verificarPropriedadeOuAdmin } from '../middleware/permissionMiddleware.js';
import errorHandler from '../middleware/errorHandler.js';

const userProfileRoutes = Router();
const controller = new UserProfileController();

// GET /profile/:id - Admin ou proprio usuario
userProfileRoutes.get('/:id', autenticarToken, verificarPropriedadeOuAdmin, async (req, res, next) => {
  try {
    await controller.getProfile(req, res);
  } catch (error) {
    next(error);
  }
});

// PUT /profile/:id - Admin ou proprio usuario
userProfileRoutes.put('/:id', autenticarToken, verificarPropriedadeOuAdmin, async (req, res, next) => {
  try {
    await controller.updateProfile(req, res);
  } catch (error) {
    next(error);
  }
});

export default userProfileRoutes;
