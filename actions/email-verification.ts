"use server";

import { db } from "@/lib/db";
import { getUserByEmail } from "@/data/user/user";
import { getVerificationTokenByToken } from "@/data/auth/verification-token";

export const completeEmailVerification = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) return { error: "만료 혹은 잘못된 인증 토큰입니다. " };

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "토큰이 만료됐습니다." };

  const existingUser = await getUserByEmail(existingToken.email);
  if (!existingUser) return { error: "이메일이 존재하지 않습니다." };

  await db.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      emailVerified: new Date(),
      email: existingToken.email,
    },
  });

  await db.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: "이메일 인증 완료!" };
};
