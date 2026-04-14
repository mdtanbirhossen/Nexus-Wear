import { SectionCards } from "@/components/section-cards";

export default function Page() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold px-4 lg:px-6">Management Dashboard</h1>
      <SectionCards />
    </div>
  );
}
