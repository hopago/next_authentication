import { Poppins } from "next/font/google";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-600">
      <div className="space-y-6">
        <h1
          className={cn(
            "text-6xl font-semibold text-white drop-shadow-md",
            font.className
          )}
        >
          🔒 인증 시스템
        </h1>
        <p className="text-white text-lg text-center">
          간단한 인증 절차 서비스
        </p>
        <div className="flex justify-center">
          <LoginButton>
            <Button variant="secondary" size="lg">
              로그인 체험하기
            </Button>
          </LoginButton>
        </div>
      </div>
    </main>
  );
}
