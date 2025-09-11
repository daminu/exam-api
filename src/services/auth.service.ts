import { db } from '../database/connection.js';
import { ROLE, users } from '../database/schema.js';
import { hashPassword } from '../utils/bcrypt.util.js';
import {
  ConflictException,
  UnauthorizedException,
} from '../utils/exception.util.js';
import { sign } from '../utils/jwt.util.js';
import type { RegisterSchema, LoginSchema } from '../utils/schema.util.js';
import { compare } from 'bcrypt';
import { DrizzleQueryError, eq } from 'drizzle-orm';
import type z from 'zod';

export class AuthService {
  static async register(values: z.infer<typeof RegisterSchema>) {
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

  static async login(values: z.infer<typeof LoginSchema>) {
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
      email: user.email,
    });
    return token;
  }
}
