type AccessLogAction =
  | 'LOGIN_SUCCESS'
  | 'LOGIN-FAILURE'
  | 'LOGOUT'
  | 'TOKEN-REFRESH'
  | 'FORGOT-PASSAWORD'
  | 'RESET-PASSWORD';

type AccesLog = {
  id: string;
  action: AccessLogAction;
  email: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: Date;
  user_id: string | null;
};

type AccessLogCreate = {
  action: AccessLogAction;
  email?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  user_id?: string | null;
};

type RequestMetaData = {
  ip_address?: string | null;
  user_agent?: string | null;
};
