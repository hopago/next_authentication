import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/new-verification?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "[WEB 발신] 이메일 인증 토큰",
    html: `<p>이메일 인증을 위한 링크입니다.
    <a href="${confirmLink}">인증하기</a>
    </p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `http://localhost:3000/new-password?token=${token}`;

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "[WEB 발신] 비밀번호 재설정 토큰",
    html: `
      <p>비밀번호 재설정을 위한 링크입니다.
        <a href=${resetLink}>재설정 하기</a>
      </p>
    `,
  });
};
