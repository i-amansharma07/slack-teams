import { AuthService } from "@/modules/auth/auth.service";
import { OrgAdminService } from "@/modules/org/org-admin.service";
import { OrgService } from "@/modules/org/org.service";

export const getAuthService = () => new AuthService();
export const getOrgService = () => new OrgService();
export const getOrgAdminService = () => new OrgAdminService();
