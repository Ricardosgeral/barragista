import { isCuid } from "@/app/utils/isCuid";
import HeaderBox from "@/components/header-box";
import { getDamById } from "@/data/dam/get-dam-by-id";
import { currentUser } from "@/lib/auth";
import { Dam } from "@prisma/client";
import { redirect } from "next/navigation";

interface DamDetailsProps {
  params: { damId: string };
}

export default async function DamDetailsPage({ params }: DamDetailsProps) {
  const user = await currentUser(); // uses auth from lib for rendering in server components
  if (!user) redirect("/auth/login"); //middleware should avoid this but

  const damId = params.damId;

  if (!isCuid(damId)) redirect("/dam/");

  const damData: Dam | null = await getDamById(damId);

  return (
    <section className="no-scrollbar flex w-full flex-row max-xl:max-h-screen">
      <div className="no-scrollbar flex w-full flex-1 flex-col p-2 md:px-5 md:py-3 xl:max-h-screen">
        <header className="flex flex-col justify-between">
          <HeaderBox
            type="title"
            title={damData ? damData.name : "Not found"}
            subtext="Dam details"
          ></HeaderBox>
        </header>
      </div>
    </section>
  );
}
