"use client"
import { cn } from "@/lib/utils";
import { FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";

export default function Nav_Search() {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        const search = formData.get("search") as string;
        
        if (search.trim()) {
            router.push(`/products?search=${encodeURIComponent(search.trim())}`);
        } else {
            router.push('/products');
        }
    };

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="w-full">
                <div className="flex justify-center items-center mr-3 border-2 border-secondary-color rounded-md w-full">
                    <input
                        type="text"
                        name="search"
                        data-slot="input"
                        className={cn(
                            "file:text-foreground h-8 w-full placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 flex rounded-md bg-transparent px-3 py-1 text-base outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
                        )}
                        placeholder="Search"
                    />
                    <button type="submit" className="px-2">
                        <FaSearch />
                    </button>
                </div>
            </form>
        </div>
    )
}
