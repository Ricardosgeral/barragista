import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarLinks } from "@/app/constants";

export default function NavLinks() {
  const pathname = usePathname();
  //console.log(pathname);

  return (
    <div className="flex flex-col items-start justify-center space-y-2 pr-3">
      {sidebarLinks.map((item) => {
        const isActive =
          pathname === item.route || pathname.startsWith(`${item.route}/`);

        return (
          <Link className="w-full" href={item.route} key={item.label}>
            <div
              className={cn(
                "flex w-full items-center justify-end space-x-2 rounded-r-xl p-2 font-semibold hover:text-yellow-500 xl:justify-end",
                { "bg-black text-white dark:bg-yellow-500": isActive },
              )}
            >
              <p className={cn("sidebar-label", { "text-white": isActive })}>
                {item.label}
              </p>
              <div className="relative">
                {
                  <item.icon
                    className={cn({
                      "dark:text-foreground/80": isActive,
                    })}
                    height={20}
                    width={20}
                  />
                }
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
