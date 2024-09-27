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
