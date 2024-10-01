import * as z from "zod";

export const LoginSchema = z.object({
  email: z
    .string({
      invalid_type_error: "올바른 이메일 형식을 입력해주세요.",
    })
    .email(),
  password: z.string().min(12, {
    message: "비밀번호는 최소 12글자 이상입니다.",
  }),
});

export const RegisterSchema = z.object({
  email: z
    .string({
      invalid_type_error: "올바른 이메일 형식을 입력해주세요.",
    })
    .email(),
  password: z.string().min(12, {
    message: "비밀번호는 최소 12글자 이상입니다.",
  }),
  name: z.string().min(3, {
    message: "이름은 필수 입력 값입니다.",
  }),
});

export const ResetSchema = z.object({
  email: z
    .string({
      invalid_type_error: "올바른 이메일 형식을 입력해주세요.",
    })
    .email(),
});

export const NewPasswordSchema = z.object({
  password: z.string().min(12, {
    message: "비밀번호는 최소 12글자 이상 입니다.",
  }),
});
