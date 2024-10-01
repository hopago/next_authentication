"use server";

import * as z from "zod";

import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

import { AuthError } from "next-auth";

import { getUserByEmail } from "@/data/user/user";

import {
  generateVerificationToken,
  generateTwoFactorToken,
} from "@/lib/tokens";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail";
import { getTwoFactorTokenByEmail } from "@/data/auth/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/auth/two-factor-confirmation";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "부적합한 입력 형식입니다.",
    };
  }

  const { email, password, twoFactorCode } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password)
    return { error: "잘못된 아이디/비밀번호 입니다." };
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    try {
      await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token
      );

      return {
        success: "이메일 인증을 위해 인증 토큰을 보내드렸어요!",
      };
    } catch (err) {
      return { error: "무언가 잘못됐군요..." };
    }
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (twoFactorCode) {
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
      if (!twoFactorToken) return { error: "유효하지 않은 입력 형식입니다." };
      if (twoFactorToken.token !== twoFactorCode)
        return { error: "2FA 인증 코드가 일치하지 않습니다." };

      const hasExpired = new Date(twoFactorToken.expires) < new Date();
      if (hasExpired) return { error: "만료된 2FA 인증 토큰입니다." };

      await db.twoFactorToken.delete({
        where: {
          id: twoFactorToken.id,
        },
      });

      const existingConfirmation = await getTwoFactorConfirmationByUserId(
        existingUser.id
      );
      if (existingConfirmation)
        await db.twoFactorConfirmation.delete({
          where: {
            id: existingConfirmation.id,
          },
        });

      await db.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        },
      });
    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token);

      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: DEFAULT_LOGIN_REDIRECT,
    });
  } catch (err) {
    console.log(err);

    if (err instanceof AuthError) {
      switch (err.type) {
        case "CredentialsSignin":
          return { error: "잘못된 입력 형식 입니다." };
        default:
          return { error: "회원가입 시도 중 문제가 생겼습니다." };
      }
    }

    throw err;
  }
};
