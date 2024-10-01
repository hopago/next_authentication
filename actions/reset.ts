"use server";

import * as z from "zod";

import { ResetSchema } from "@/schemas";
import { getUserByEmail } from "@/data/user/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";

export const reset = async (values: z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);
  if (!validatedFields.success) return { error: "부적합한 이메일 형식입니다." };

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);
  if (!existingUser) return { error: "해당 사용자를 찾지 못했습니다." };

  const passwordResetToken = await generatePasswordResetToken(email);
  try {
    await sendPasswordResetEmail(
      passwordResetToken.email,
      passwordResetToken.token
    );

    return { success: "비밀번호 재설정 이메일 발송 완료!" };
  } catch (err) {
    return { error: "이메일 전송 중 오류가 발생했습니다." };
  }
};
