"use client";

import { useRouter } from "next/navigation";

interface LoginButtonProps {
  children: React.ReactNode;
  asChild?: boolean;
  mode?: "modal" | "redirect";
}

export const LoginButton = ({
  children,
  asChild,
  mode = "redirect",
}: LoginButtonProps) => {
  const router = useRouter();

  const onClick = () => router.push("/login");

  if (mode === "modal") return <span>TODO:</span>;

  return <span onClick={onClick}>{children}</span>;
};
