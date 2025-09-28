import { db } from '../database/connection.js';
import { ROLE, users, vonageVerifications } from '../database/schema.js';
import { hashPassword } from '../utils/bcrypt.util.js';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
  UnauthorizedException,
} from '../utils/exception.util.js';
import { sign } from '../utils/jwt.util.js';
import type {
  RegisterRequestSchema,
  LoginSchema,
  SendCodeRequestSchema,
  VerifyCodeRequestSchema,
} from '../utils/schema.util.js';
import { sendSmsCode, verifySmsCode } from '../utils/vonage.js';
import { compare } from 'bcrypt';
import { and, DrizzleQueryError, eq } from 'drizzle-orm';
import type z from 'zod';

class AuthService {
  async register(values: z.infer<typeof RegisterRequestSchema>) {
    try {
      const hashedPassword = await hashPassword(values.password);
      await db.insert(users).values({
        email: values.email,
        password: hashedPassword,
        role: ROLE.USER,
      });
    } catch (error) {
      if (error instanceof DrizzleQueryError) {
        if (error.cause.code === 'ER_DUP_ENTRY') {
          throw new ConflictException('Email not available.');
        }
      }
    }
    return {
      message: 'User has been created succesfully.',
    };
  }

  async login(values: z.infer<typeof LoginSchema>) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, values.email),
      columns: {
        password: true,
        id: true,
        role: true,
        email: true,
      },
    });
    if (!user) {
      throw new UnauthorizedException('Either email or password is wrong.');
    }
    const result = await compare(values.password, user.password);
    if (!result) {
      throw new UnauthorizedException('Either email or password is wrong.');
    }
    const token = await sign({
      id: user.id,
      role: user.role,
    });
    return token;
  }

  async me(userId: number) {
    const user = await db.query.users.findFirst({
      where: (usersTable) => eq(usersTable.id, userId),
      columns: {
        id: true,
        email: true,
        role: true,
      },
    });

    return user;
  }

  async sendCode({ phoneNumber }: z.infer<typeof SendCodeRequestSchema>) {
    const user = await db.query.users.findFirst({
      where: (usersTable) => eq(usersTable.phoneNumber, phoneNumber),
      columns: {
        id: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    const { requestId } = await sendSmsCode(phoneNumber);
    await db.insert(vonageVerifications).values({ requestId, userId: user.id });
    return { requestId };
  }

  async verifyCode({
    code,
    phoneNumber,
    requestId,
  }: z.infer<typeof VerifyCodeRequestSchema>) {
    const user = await db.query.users.findFirst({
      where: (usersTable) => eq(usersTable.phoneNumber, phoneNumber),
      columns: {
        id: true,
        email: true,
        role: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found.');
    }
    const vonageVerification = await db.query.vonageVerifications.findFirst({
      where: (vonageVerificationsTable) =>
        and(
          eq(vonageVerificationsTable.requestId, requestId),
          eq(vonageVerificationsTable.userId, user.id)
        ),
    });
    if (!vonageVerification) {
      throw new BadRequestException('Send verification code again.');
    }
    const status = await verifySmsCode(vonageVerification.requestId, code);
    return { status };
  }
}

export const authService = new AuthService();
