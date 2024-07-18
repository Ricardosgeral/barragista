import { auth } from "@/auth";
import type { Metadata } from "next";
import { Inter, IBM_Plex_Serif, Roboto, Poppins } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { SessionProvider } from "next-auth/react";
import "@/app/globals.css";

import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";

import { ourFileRouter } from "@/app/api/uploadthing/core";
import { ThemeProvider } from "@/components/theme-provider";

// const inter = Inter({
//   subsets: ["latin"],
//   variable: "--font-inter",
//   preload: false,
// });
// const roboto = Roboto({
//   weight: "400",
//   subsets: ["latin"],
// });
// const ibmPlexSerif = IBM_Plex_Serif({
//   subsets: ["latin"],
//   weight: ["400", "700"],
//   variable: "--font-ibm-plex-serif",
//   preload: false,
// });
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
  preload: false,
});
export const metadata: Metadata = {
  title: "DamHub",
  description: "All about dams",
  icons: { icon: "/logos/logo-black-_2lines.svg" },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <SessionProvider session={session}>
      <html suppressHydrationWarning className={poppins.className} lang="en">
        <body>
          <NextSSRPlugin
            /**
             * The `extractRouterConfig` will extract **only** the route configs
             * from the router to prevent additional information from being
             * leaked to the client. The data passed to the client is the same
             * as if you were to fetch `/api/uploadthing` directly.
             */
            routerConfig={extractRouterConfig(ourFileRouter)}
          />
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <section className="flex h-screen flex-grow items-center justify-center">
              {children}
            </section>
          </ThemeProvider>
          <Toaster />
        </body>
      </html>
    </SessionProvider>
  );
}
