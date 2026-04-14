import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="w-full text-black border-t mt-16">
            {/* Footer content */}
            <div className="container mx-auto px-4 py-10 max-w-7xl">
                {/* Company name and tagline */}
                <div className="mb-8 text-center flex flex-col items-center">
                    <Link href={'/'}>
                        <Image 
                            src="https://nexus-wear-dashboard.vercel.app/mainLogo.png" 
                            alt="Logo" 
                            width={80} 
                            height={64}
                            className="w-20 h-auto mb-4" 
                        />
                    </Link>
                    <div>
                        <h3 className="text-2xl font-bold">NexusWare.com</h3>
                        <p className="text-gray-700 mt-1">&ldquo;Let&apos;s Shop Beyond Boundaries&rdquo;</p>
                    </div>
                </div>

                {/* Footer links grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
                    {/* Nexus Ware column */}
                    <div>
                        <h4 className="font-bold text-xl mb-4">Nexus Ware</h4>
                        <ul className="space-y-2">
                            {['About Nexus Ware', 'Career', 'Mitra Blog', 'B2B Digital'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-gray-700 hover transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Buy column */}

                    {/* Sell column */}
                    <div>
                        <h4 className="font-bold text-xl mb-4">Sell</h4>
                        <ul className="space-y-2">
                            {['Seller Education Center', 'Brand Index', 'Register Official Store'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-gray-700 hover transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Guide and Help column */}
                    <div>
                        <h4 className="font-bold text-xl mb-4">Guide and Help</h4>
                        <ul className="space-y-2">
                            {['Nexus Ware Care', 'Term and Condition', 'Privacy', 'Mitra'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-gray-700 hover transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold text-xl mb-4">Buy</h4>
                        <ul className="space-y-2">
                            {['Bill & Top Up', 'Nexus Ware COD', 'Mitra Blog', 'Promo'].map((item) => (
                                <li key={item}>
                                    <Link href="#" className="text-gray-700 hover transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Copyright section */}
                <div className="border-t border-gray-700 pt-6 text-center">
                    <p className="text-gray-700">
                        © 2001 - {new Date().getFullYear()}, NexusWare.com
                    </p>
                </div>
            </div>
        </footer>
    );
}