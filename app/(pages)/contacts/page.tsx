import HeaderBox from "@/components/header-box";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function Contacts() {
  const user = await currentUser(); // uses auth from lib for rendering in server components

  if (!user) redirect("/auth/login"); //middleware should avoid this but
  return (
    <section className="no-scrollbar flex w-full flex-row max-xl:max-h-screen">
      <div className="no-scrollbar flex w-full flex-1 flex-col p-3 md:p-5 xl:max-h-screen">
        <header className="flex flex-col justify-between pb-2">
          <HeaderBox
            type="title"
            title="Contacts"
            //subtext="Any question or suggestion?"s
          ></HeaderBox>
        </header>
        <div className="pt-2">
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
          <h1>dsadad</h1>
        </div>
      </div>
    </section>
  );
}
