"use server";

import * as z from "zod";

import { NewPasswordSchema } from "@/schemas";
import { getPasswordResetTokenByToken } from "@/data/auth/password-reset-token";
import { getUserByEmail } from "@/data/user/user";

import { db } from "@/lib/db";

import bcryptjs from "bcryptjs";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema>,
  token?: string | null
) => {
  if (!token) return { error: "인증 토큰이 없습니다." };

  const validatedFields = NewPasswordSchema.safeParse(values);
  if (!validatedFields.success)
    return { error: "유효하지 않은 필드 값입니다." };

  const existingToken = await getPasswordResetTokenByToken(token);
  if (!existingToken) return { error: "유효하지 않은 토큰입니다." };

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "만료된 인증 토큰입니다." };

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: "존재하지 않는 유저 혹은 이메일입니다." };

  const hashedPassword = await bcryptjs.hash(values.password, 10);
  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  await db.passwordResetToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "비밀번호 재설정 완료!" };
};
