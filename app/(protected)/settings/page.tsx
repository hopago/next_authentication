"use client";

import { logout } from "@/actions/logout";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/user/use-current-user";

export default function SettingsPage() {
  const user = useCurrentUser();

  const onClick = () => logout();

  return (
    <div className="bg-white p-10 rounded-xl">
      {JSON.stringify(user)}
      <form>
        <Button type="submit" onClick={onClick}>
          로그아웃
        </Button>
      </form>
    </div>
  );
}
