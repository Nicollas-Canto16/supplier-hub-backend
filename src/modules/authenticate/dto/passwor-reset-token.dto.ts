type PasswordResetrToken = {
  id: string;
  token: string;
  expiered_at: Date | null;
  created_at: Date;
  user_id: string;
};

type PasswordResetTokenCreated = {
  token: string;
  expired_at: Date;
  uer_id: string;
};
