import ErrorCard from "@/app/_components/ErrorCard";

const AuthErrorPage = () => {
  return (
    <div className="h-full flex items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-600">
      <ErrorCard />
    </div>
  );
};

export default AuthErrorPage;
