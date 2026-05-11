export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  bio: string;
  foto: string;
}

export interface ProfileResponse {
  success: boolean;
  data?: UserProfile;
  message?: string;
  error?: string;
}
