import HeaderBox from "@/components/header-box";
import SearchInput from "@/components/search-input";

export default function Home() {
  return (
    <section className="no-scrollbar flex w-full flex-row max-xl:max-h-screen">
      <div className="no-scrollbar flex w-full flex-1 flex-col p-2 md:px-5 md:py-3 xl:max-h-screen">
        <header className="flex flex-col justify-between">
          <HeaderBox type="title" title="Hi" subtext="Welcome back"></HeaderBox>
        </header>
      </div>
    </section>
  );
}
