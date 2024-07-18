"use client";
// import { Poppins } from "next/font/google";

import LogoApp from "@/components/logo-app";

import CardMainPage from "@/components/card-main-page";
import BannerMainPage from "@/components/banner-main-page";
import FooterMainPage from "@/components/footer-main-page";

// const font = Poppins({
//   subsets: ["latin"],
//   weight: ["600"],
//   preload: false,
// });

export default function Home() {
  return (
    <div className="flex min-h-screen w-full min-w-[350px] max-w-4xl flex-col items-center justify-center">
      <header className="flex w-full flex-col items-center">
        <div className="flex w-4/5 max-w-[280px] justify-center">
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
          href="/dam"
        />
        <CardMainPage
          title="Dams regulation"
          subtitle="Get information about legislation on dam safety"
          src="/images/regulations_ia1.jpg"
          href="/regulation"
        />
      </section>
      <footer className="w-full border-t bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-black to-slate-800 p-2 dark:from-yellow-500 dark:to-yellow-400">
        <FooterMainPage />
      </footer>
    </div>
  );
}
