import type { UserProfile } from '../types/UserProfile.js';

export const userProfilesDB: Map<string, UserProfile> = new Map([
  ['user-123', {
    id: 'user-123',
    nome: 'João Silva',
    email: 'joao@example.com',
    bio: 'Desenvolvedor Full Stack',
    foto: 'https://example.com/foto-joao.jpg'
  }],
  ['user-456', {
    id: 'user-456',
    nome: 'Maria Santos',
    email: 'maria@example.com',
    bio: 'Gestora de Projetos',
    foto: 'https://example.com/foto-maria.jpg'
  }]
]);
