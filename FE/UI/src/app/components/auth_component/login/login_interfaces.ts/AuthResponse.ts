// UI\src\app\components\auth_component\login\login_interfaces.ts\AuthResponse.ts

export interface AuthResponse {
  username: string;
  token: string;
  refreshToken: string;
  isAdmin: boolean;
  rememberMe?: boolean;
}
