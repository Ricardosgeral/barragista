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
          alt="Barragista Logo"
          width={1}
          height={1}
          className="w-3/4 min-w-[200px] py-1 sm:w-1/3"
          priority
        />
      ) : (
        <Link href="/" className="cursor-pointer" passHref legacyBehavior>
          <div className="text-shadow-xl flex flex-col items-center text-center font-[Poppins] text-xl font-bold text-yellow-500 hover:font-extrabold hover:text-slate-800">
            <Image
              priority
              src="/logos/logos_Page 2.svg"
              width={70}
              height={70}
              alt="Barragista logo"
            />
            <h1>Barragista</h1>
          </div>
        </Link>
      )}
    </>
  );
}
