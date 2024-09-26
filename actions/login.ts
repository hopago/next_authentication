"use server";

import * as z from "zod";

import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

import { AuthError } from "next-auth";

import { getUserByEmail } from "@/data/user/user";

import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      error: "부적합한 입력 형식입니다.",
    };
  }

  const { email, password } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser || !existingUser.email || !existingUser.password)
    return { error: "잘못된 아이디/비밀번호 입니다." };
  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(
      existingUser.email
    );

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return {
      success: "이메일 인증을 위해 인증 토큰을 보내드렸어요!",
    };
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
