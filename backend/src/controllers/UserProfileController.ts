import type { Request, Response } from 'express';
import { userProfilesDB } from '../data/userProfileMock.js';
import type { UserProfile } from '../types/UserProfile.js';
import { AppError } from '../errors/AppError.js';

export class UserProfileController {
  // GET /profile/:id
  async getProfile(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    if (!id || typeof id !== 'string') {
      throw new AppError(400, 'ID do perfil é obrigatório');
    }

    const profile = userProfilesDB.get(id);

    if (!profile) {
      throw new AppError(404, 'Perfil não encontrado');
    }

    res.json({
      success: true,
      data: profile
    });
  }

  // PUT /profile/:id
  async updateProfile(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { nome, email, bio, foto } = req.body;

    if (!id || typeof id !== 'string') {
      throw new AppError(400, 'ID do perfil é obrigatório');
    }

    // Validação do campo obrigatório
    if (!nome || nome.trim().length === 0) {
      throw new AppError(400, 'O campo "nome" é obrigatório e não pode estar vazio');
    }

    const profile = userProfilesDB.get(id);

    if (!profile) {
      throw new AppError(404, 'Perfil não encontrado');
    }

    // Atualizar apenas os campos fornecidos
    const updatedProfile: UserProfile = {
      ...profile,
      nome: nome || profile.nome,
      email: email || profile.email,
      bio: bio || profile.bio,
      foto: foto || profile.foto
    };

    userProfilesDB.set(id, updatedProfile);

    res.json({
      success: true,
      message: 'Perfil atualizado com sucesso',
      data: updatedProfile
    });
  }
}
