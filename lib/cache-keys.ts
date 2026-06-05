//`entity:qualifier:value`
export const CacheKeys = {
  userByEmail: (email: string) => `user:email:${email}`,
  orgById: (orgId: string) => `org:${orgId}`,
  orgAdminList: () => `orgs:all:admin_list`,
  invitationByToken: (token: string) => `invitation:token:${token}`,
};
