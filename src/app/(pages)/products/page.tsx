import { Suspense } from "react";
import Products from "./[category]/Products";
import ProductPageSideBar from "./ProductPageSideBar";
import Loading from "@/components/shared/Loading";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Filter } from "lucide-react";

export default function Page() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><Loading /></div>}>
      <div className="max-w-7xl min-h-screen mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Mobile Filter Button */}
        <div className="lg:hidden flex justify-end mb-4">
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-primary text-sm font-bold uppercase tracking-wider rounded-md shadow-sm hover:border-primary transition-colors">
                <Filter className="w-4 h-4" />
                Filters
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85%] sm:w-[400px] overflow-y-auto p-4 border-r z-[1000]">
              <div className="sr-only">
                <SheetTitle>Filters</SheetTitle>
                <SheetDescription>Filter products by category, color, size, and price.</SheetDescription>
              </div>
              <div className="mt-4">
                <ProductPageSideBar />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="hidden lg:block lg:col-span-1">
            <ProductPageSideBar />
          </div>
          <div className="col-span-1 lg:col-span-3">
            <Products />
          </div>
        </div>
      </div>
    </Suspense>
  )
}
