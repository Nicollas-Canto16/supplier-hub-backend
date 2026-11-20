// import { PasswordResetToken } from '../../../../generated/prisma/client.js';

export abstract class PasswordResetTokensRepository {
  // abstract create(
  //   passwordResetToken: PasswordResetTokensRepository,
  // ): Promise<PasswordResetToken>;
  // abstract findByToken(token: string): Promise<PasswordResetToken | null>;
  abstract markAsUsed(id: string): Promise<void>;
  abstract invalidateAllByUserId(userId: string): Promise<void>;
}
