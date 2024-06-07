"use client";
import { Poppins } from "next/font/google";

import { Button } from "@/components/ui/button";
import { LoginButton } from "@/components/auth/login-button";
import LogoApp from "@/components/logo-app";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import Image from "next/image";
import { ModeToggle } from "@/components/theme-toggle";
import { useRouter } from "next/navigation";
import CardMainPage from "@/components/card-main-page";
import BannerMainPage from "@/components/banner-main-page";
import FooterMainPage from "@/components/footer-main-page";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

export default function Home() {
  return (
    <div className="flex min-h-screen w-full min-w-[350px] max-w-4xl flex-col items-center justify-center">
      <header className="flex w-full flex-col items-center">
        <div className="flex w-full justify-center">
          <LogoApp />
        </div>
        <div className="w-full">
          <BannerMainPage />
        </div>
      </header>

      <section className="flex w-full flex-grow flex-col items-center space-y-4 p-4 lg:px-0">
        <CardMainPage
          title="Dams database"
          subtitle="Discover main features and characteristics of dams"
          src="/images/dams_vertical.jpg"
          href="/dams"
        />
        <CardMainPage
          title="Dams regulation"
          subtitle="Get information about legislation on dam safety"
          src="/images/regulations_ia.jpg"
          href="/regulations"
        />
      </section>
      <footer className="w-full border-t bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-black to-slate-800 p-2 dark:from-yellow-500 dark:to-yellow-400">
        <FooterMainPage />
      </footer>
    </div>
  );
}
