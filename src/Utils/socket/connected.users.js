const connectedUsers = new Map();

export const addConnection = (userId, socketId) => {
  const sockets = connectedUsers.get(userId);
  if (!sockets) {
    connectedUsers.set(userId, new Set([socketId]));
    return true;
  }
  sockets.add(socketId);
  return false;
};
export const removeConnection = (userId, socketId) => {
  const sockets = connectedUsers.get(userId);

  if (!sockets) {
    return true;
  }
  sockets.delete(socketId);

  if (sockets.size > 0) return false;

  connectedUsers.delete(userId);
  return true;
};
export const isUserOnline = (userId) => {
  return connectedUsers.has(userId);
};
export const getUserSocketcount = (userId) => {
  return connectedUsers.get(userId)?.size ?? 0;
};
export const getOnlineUsersIds = () => {
  return [...connectedUsers.keys()];
};
