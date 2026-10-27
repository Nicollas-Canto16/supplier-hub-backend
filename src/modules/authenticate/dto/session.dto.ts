type Session = {
  id: string;
  refresh_token: string;
  ip_addresss: string | null;
  user_agent: string | null;
  expired_at: Date;
  revoked_at: Date | null;
  last_uses_at: Date | null;
  created_at: Date;
  user_id: string;
};

type SessionCreate = {
  refresh_token: string;
  ip_addresss?: string | null;
  user_agent?: string | null;
  expired_at: Date;
  user_id: string;
};

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};
