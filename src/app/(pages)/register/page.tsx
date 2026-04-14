import Link from "next/link";
import { RegisterForm } from "./register-form";
import Image from "next/image";

export default function RegisterPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="font-bold flex items-center gap-2">
              <Image 
                src="https://nexus-wear-dashboard.vercel.app/mainLogo.png" 
                alt="Logo" 
                width={64} 
                height={64}
                className="w-16 h-auto" 
              />
            NEXUS WEAR
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
      
      <div className=" hidden relative lg:flex items-center justify-center">
        <div className="absolute inset-0 bg-[url('https://nexus-wear-dashboard.vercel.app/loginBg1.jpg')] bg-cover" />
        <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
        <div className="relative z-10 flex flex-col items-center gap-4 text-white">
          <Image 
            src="https://nexus-wear-dashboard.vercel.app/mainLogo.png" 
            alt="Logo" 
            width={160} 
            height={160}
            className="w-40 h-auto" 
          />
          <h1 className="text-6xl font-extrabold text-black">NEXUS WEAR</h1>
        </div>
      </div>
    </div>
  )
}
