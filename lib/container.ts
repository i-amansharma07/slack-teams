import { AuthService } from "@/modules/auth/auth.service";

export const getAuthService = () => new AuthService()