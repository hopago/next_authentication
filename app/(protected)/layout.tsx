import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import ProtectedDashboardNavbar from "./_components/Navbar";

const ProtectedLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  return (
    <SessionProvider session={session}>
      <div className="h-full w-full flex flex-col gap-y-10 items-center justify-center  bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-600">
        <ProtectedDashboardNavbar />
        {children}
      </div>
    </SessionProvider>
  );
};

export default ProtectedLayout;
