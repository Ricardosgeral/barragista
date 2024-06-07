"use client";

import { Input } from "@/components/ui/input";
import { LuSearch } from "react-icons/lu";

export default function SearchInput() {
  return (
    <div className="relative block">
      <LuSearch className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input placeholder="Search" className="bg-primary/10 pl-8" />
    </div>
  );
}
