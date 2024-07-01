import Link from "next/link";
import { Button } from "./ui/button";

export default function FooterMainPage() {
  const currentYear = new Date().getFullYear();
  return (
    <div className="flex flex-col-reverse items-center justify-between gap-2 sm:flex-row">
      <div className="text-xs text-background">
        © 2024-{currentYear} Ricardos Inc. All rights reserved.
      </div>
      <nav className="flex gap-4 text-background">
        <Link className="text-sm hover:underline" href="#">
          Privacy
        </Link>
        <Link className="text-sm hover:underline" href="#">
          Terms
        </Link>
        <Link className="text-sm hover:underline" href="/contacts">
          <Button
            variant="default"
            size="sm"
            className="border bg-yellow-500 text-foreground hover:bg-foreground/80 hover:text-background dark:bg-background dark:hover:bg-yellow-500 dark:hover:text-background"
          >
            Contact
          </Button>
        </Link>
      </nav>
    </div>
  );
}
