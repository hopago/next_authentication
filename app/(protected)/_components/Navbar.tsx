"use client";

import UserButton from "@/components/auth/user-button";
import { Button } from "@/components/ui/button";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ProtectedDashboardNavbar = () => {
  const pathname = usePathname();

  return (
    <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm">
      <div className="flex gap-x-2">
        <Button
          variant={pathname === "/server" ? "default" : "outline"}
          asChild
        >
          <Link href="/settings">서버</Link>
        </Button>
        <Button
          variant={pathname === "/client" ? "default" : "outline"}
          asChild
        >
          <Link href="/settings">클라이언트</Link>
        </Button>
        <Button variant={pathname === "/admin" ? "default" : "outline"} asChild>
          <Link href="/settings">관리자</Link>
        </Button>
        <Button
          variant={pathname === "/settings" ? "default" : "outline"}
          asChild
        >
          <Link href="/settings">설정</Link>
        </Button>
      </div>
      <UserButton />
    </nav>
  );
};

export default ProtectedDashboardNavbar;
