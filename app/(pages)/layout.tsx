import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";
import LogoApp from "@/components/logo-app";

interface PagesLayoutProps {
  children: React.ReactNode;
}

export default async function PagesLayout({ children }: PagesLayoutProps) {
  const user = await currentUser(); // uses auth from lib for rendering in server components

  if (!user) redirect("/auth/login"); //middleware should avoid this, but...

  return (
    <main className="font-inter flex h-screen w-full">
      <Sidebar />

      <div className="ml-0 flex flex-grow flex-col md:ml-[140px]">
        <div className="flex h-16 items-center justify-between md:hidden">
          <div className="h-16 w-16">
            <LogoApp />
          </div>
          <div>
            <MobileNav />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
}
