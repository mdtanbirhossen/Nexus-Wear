"use client"
import { usePathname } from "next/navigation";
import Nav_1 from "./Nav_1/Nav_1";
import Nav_2 from "./Nav_2/Nav_2";

export default function Navbar() {
    const pathName = usePathname();
    const shouldShowNav2 = (pathName === '/about-us') || (pathName === '/contact-us');
    return (
        <div className="md:px-5 px-3 w-full">
            <div className="max-w-7xl w-full flex flex-col gap-2 my-3 mx-auto  py-2.5">
                <Nav_1></Nav_1>
                {shouldShowNav2 ? '' : <Nav_2 />}

            </div>
        </div>
    )
}
