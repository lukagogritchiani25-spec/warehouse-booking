export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
}

export interface AuthResponse {
  token: string;
  user: UserDto;
}

export interface UserDto {
  id: string;
  email: string;
  fullName: string;
  phoneNumber?: string;
  role: string;
  createdAt: string;
}
