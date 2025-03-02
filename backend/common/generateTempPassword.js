export const generateTempPassword = () => {
  const length = 8;
  const chars =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#!.?';
  let tempPassword = '';
  for (let i = 0; i < length; i++) {
    tempPassword += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return tempPassword;
};
