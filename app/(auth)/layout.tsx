import { Navbar } from "@/components/navbar";
import AuthGuard from "@/components/AuthGuard";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <AuthGuard blockIfAuthenticated>
        {children}
      </AuthGuard>
    </>
  );
}