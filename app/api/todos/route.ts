export const GET = () => {
  return Response.json({
    todos: [
      "option to transfer org to other user/new email user",
      "less calling auth() from next js currently called inside middlware -> requireSuperAdmin -> request handler",
    ],
  });
};
