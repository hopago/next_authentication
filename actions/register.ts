"use server";

import * as z from "zod";

import { RegisterSchema } from "@/schemas";

import bcrypt from "bcryptjs";

import { db } from "@/lib/db";

import { getUserByEmail } from "@/data/user/user";

import { generateVerificationToken } from "@/lib/tokens";

import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const validatedFields = RegisterSchema.safeParse(values);
  if (!validatedFields.success) return { error: "부적합한 제출 형식입니다." };

  const { email, password, name } = validatedFields.data;
  const hashedPassword = await bcrypt.hash(password, 10);

  const isExist = await getUserByEmail(email);
  if (isExist) return { error: "사용중인 이메일입니다." };

  try {
    await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: "이메일 인증 토큰 전송 완료!" };
  } catch (err) {
    console.log(err);
    return { error: "서버 오류입니다. 잠시 후 다시 시도해주세요." };
  }
};
