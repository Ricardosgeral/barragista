"use client";
import useDarkMode from "@/hooks/use-dark-mode";
import Image from "next/image";
import Link from "next/link";

interface LogAppProps {
  negative?: boolean;
  square?: boolean;
}

export default function LogoApp({
  negative = false,
  square = false,
}: LogAppProps) {
  const isDarkModeOn = useDarkMode();
  if (isDarkModeOn) {
    negative = true;
  }

  return (
    <>
      {!square ? (
        <Image
          src={negative ? "/logos/logos_Page 5.svg" : "/logos/logos_Page 3.svg"}
          alt="Barragista logo"
          width={60}
          height={60}
          className="w-full"
          priority
        />
      ) : (
        <Link href="/" passHref legacyBehavior>
          <div className="text-shadow-xl flex flex-col items-center text-center font-[Poppins] text-xl font-bold text-yellow-500 hover:font-extrabold hover:text-slate-800">
            <Image
              priority
              src="/logos/logos_Page 2.svg"
              width={70}
              height={70}
              alt="Barragista logo"
              className="cursor-pointer"
            />
            <h1 className="cursor-pointer">Barragista</h1>
          </div>
        </Link>
      )}
    </>
  );
}
