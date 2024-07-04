"use client";

import { usePathname } from "next/navigation";

import { damFormSteps } from "@/data/dam/constants";
import { cn } from "@/lib/utils";

export function Aside() {
  const pathname = usePathname();

  return (
    <aside className="xs:relative xs:h-[35.5rem] xs:w-[17.125rem] xs:rounded-lg absolute left-0 right-0 top-0 z-0 h-[10.75rem] max-h-full p-8">
      <ul className="xs:flex-col flex justify-center gap-8">
        {damFormSteps.sidebarNav.map((data, index) => (
          <li key={index} className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full",
                pathname === data.path ? "bg-light-blue" : "border text-white",
              )}
            >
              {data.id}
            </div>
            <div>
              <span className="text-pastel-blue xs:block hidden text-xs">
                {data.id}
              </span>
              <p className="xs:block hidden text-sm leading-4 text-white">
                {data.description}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
