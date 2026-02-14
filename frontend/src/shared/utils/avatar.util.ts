export const generateAvatarUrl = (seed: string, avatarUrl?: string): string => {
  if (avatarUrl) return avatarUrl;

  // return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
  return `https://api.dicebear.com/7.x/fun-emoji/svg?seed=${seed}`;
};
