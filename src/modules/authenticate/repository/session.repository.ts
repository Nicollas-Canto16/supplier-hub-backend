import { Session, SessionCreate } from '../dto/session.dto.js';

export abstract class SessionRepository {
  abstract create(session: SessionCreate): Promise<Session>;
  abstract findByRefreshToken(refreshToken: string): Promise<Session | null>;
  abstract rotate(params: {
    id: string;
    refresh_toke: Date;
    expired_at: Date;
  }): Promise<Session>;
  abstract revoke(id: string): Promise<void>;
  abstract rebvokeAllByUserId(uerID: string): Promise<void>;
}
