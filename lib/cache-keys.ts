//`entity:qualifier:value`
export const CacheKeys = {
  userByEmail: (email: string) => `user:email:${email}`,
  orgById: (orgId: string) => `org:${orgId}`,
  orgAdminList: () => `org:all_admin_list`,
  invitationByToken: (token: string) => `invitation:toke${token}`,
};
