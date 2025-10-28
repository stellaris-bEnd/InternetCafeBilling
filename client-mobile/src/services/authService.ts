import api from './api';
import { User } from '../types/entities';

interface LoginRequest {
  email: string;
  password: string;
}

// <-- TAMBAHAN BARU
interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}
// -->

interface LoginResponse {
  token: string;
  user: User;
}

export const authService = {
  login: (data: LoginRequest) => {
    return api.post<LoginResponse>('/auth/login', data);
  },
  // <-- TAMBAHAN BARU
  register: (data: RegisterRequest) => {
    return api.post<LoginResponse>('/auth/register', data);
  },
  // -->
};