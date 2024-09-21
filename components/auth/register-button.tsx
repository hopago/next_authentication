"use client";

import { useRouter } from "next/navigation";

interface RegisterButtonProps {
  children: React.ReactNode;
  asChild?: boolean;
  mode?: "modal" | "redirect";
}

export const RegisterButton = ({
  children,
  asChild,
  mode = "redirect",
}: RegisterButtonProps) => {
  const router = useRouter();

  const onClick = () => router.push("/register");

  if (mode === "modal") return <span>TODO:</span>;

  return <span onClick={onClick}>{children}</span>;
};
