import Image from "next/image";
import { Card } from "./ui/card";
import Link from "next/link";
import { Button } from "./ui/button";

interface CardMainPageProps {
  title: string;
  subtitle: string;
  src: string;
  href: string;
}

export default function CardMainPage({
  title,
  subtitle,
  src,
  href,
}: CardMainPageProps) {
  return (
    <Card className="flex w-full flex-1 flex-row rounded-xl bg-foreground/5 shadow-xl">
      <div className="relative w-1/2">
        <Image
          alt={title}
          className="rounded-l-xl object-cover"
          fill
          src={src}
        />
      </div>

      <div className="flex w-1/2 flex-col justify-evenly p-4">
        <div className="">
          <h1 className="text-2xl font-bold tracking-tighter">{title}</h1>
          <p className="flex-1 text-pretty text-gray-500 dark:text-gray-400">
            {subtitle}
          </p>
        </div>
        <Link href={href}>
          <Button variant="default" size="sm" className="h-8 w-1/3">
            Go
          </Button>
        </Link>
      </div>
    </Card>
  );
}
